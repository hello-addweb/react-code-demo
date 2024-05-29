import { ObjectId } from 'bson';
import { IProduct } from '../interfaces';
import { ENVIRONMENT, TEXT_FILTERS } from '../shared/const';
import { getDatabaseFieldName, getFilterQuery, getFilteredFields, createOrUpdateProductSQSMessage, callZohoProductSQSForMultipleProduct } from '../helpers/index'

export class ProductRepository implements IProduct<[]> {

    public wordForFindQuery = "";

    public async create(payload: any, db: any) {
        try {
            console.log('payload', payload);
            const result = await db.collection('Products').insertOne(payload);
            if (result?.insertedId && ENVIRONMENT === "Prod") createOrUpdateProductSQSMessage(result?.insertedId)
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    public async findByASIN(params: any, db: any) {
        try {
            console.log('slug', params);
            const result = await db.collection('Products').findOne({
                ASIN: params,
                deletedAt: { $exists: false }
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    public async findById(id: string, db: any, fetchField: any) {
        try {
            const result = await await db.collection('Products').aggregate([
                {
                    $match: {
                        $and: [
                            { _id: new ObjectId(id) },
                            { 'deletedAt': { $exists: false } }
                        ]
                    },
                },
                {
                    $unwind: "$variants"
                },
                {
                    $replaceRoot: { newRoot: "$variants" }
                },
                {
                    $project: fetchField
                }
            ]).toArray();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    public async findByVariantASIN(ASIN: any, db: any) {
        try {
            const totalVariants = await db.collection('Products').aggregate([
                {
                    $unwind: "$variants"
                },
                {
                    $addFields: {
                        "variants.createdAt": "$createdAt",
                        "variants.updatedAt": "$updatedAt",
                        "variants.deletedAt": "$deletedAt",
                    }
                },
                {
                    $replaceRoot: { newRoot: "$variants" }
                },
                {
                    $match: {
                        ASIN: ASIN, deletedAt: { $exists: false }
                    }
                }
            ]).toArray();

            if (totalVariants?.length >= 1) {
                return totalVariants[0];
            } else {
                return totalVariants;
            }

        } catch (error) {
            console.log(error);
        }
    }

    public async update(product: any, db: any) {
        try {
            const result = await db.collection('Products').updateOne({ _id: product._id }, { $set: product });
            if (product._id && ENVIRONMENT === "Prod") createOrUpdateProductSQSMessage(product._id)
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    public isParentProduct(obj: any) {
        return !obj.parent_slug;
    }

    public async findProduct(obj: any, db: any, fields: any = {}) {
        console.log('find product data by ASIN or SKU', obj.ASIN, obj.SKU);
        if (Object.keys(fields).length === 0) {
            return await db.collection('Products').findOne({ $or: [{ ASIN: obj.ASIN }, { SKU: obj.SKU }] });
        } else {
            return await db.collection('Products').findOne({ $or: [{ ASIN: obj.ASIN }, { SKU: obj.SKU }] }, { projection: fields })
        }
    }

    public async updateProduct(product: any, newData: any, unsetFields: object, fromJob: boolean = false, db: any) {
        console.log('update product data by id', product._id);
        // console.log('newData', newData);
        await db.collection('Products').updateOne({ _id: product._id }, { $set: newData });

        if (Object.keys(unsetFields)?.length >= 1) {
            await db.collection('Products').updateOne({ _id: product._id }, { $unset: unsetFields });
        }
        // if (product._id && ENVIRONMENT === "Prod" && !fromJob) createOrUpdateProductSQSMessage(product._id)
    }

    public async updateVariantProduct(productId: string, variantIndex: any, newData: any, fromJob: boolean = false, db: any) {
        console.log('update variant product data by id', productId);
        delete newData?.variants;
        await db.collection('Products').updateOne({ _id: new ObjectId(productId) },
            {
                $set: {
                    [`variants.${variantIndex}`]: newData
                }
            });
        // if (productId && ENVIRONMENT === "Prod" && !fromJob) createOrUpdateProductSQSMessage(productId)
    }

    public async findParentProduct(parent_slug: String, db: any) {
        console.log('find parent product data by slug', parent_slug);
        return await db.collection('Products').findOne({ 'slug.en': parent_slug });
    }

    public async findVariation(parentProduct: any, variationObj: any) {
        console.log('find variant product data by SKU', variationObj.SKU);
        return await parentProduct.variants.find((variant: any) => variant.SKU === variationObj.SKU);
    }

    public async updateVariation(parentProduct: any, variation: any, newData: any, fromJob: boolean = false, db: any) {
        console.log('update variation data by parent product id', parentProduct._id);
        for (let key in newData) {
            if (newData.hasOwnProperty(key)) {
                variation[key] = newData[key];
            }
        }

        // Update the updatedAt timestamp
        variation.updatedAt = Math.floor(Date.now() / 1000)

        // Save the updated parent product to the database
        await db.collection('Products').updateOne({ _id: parentProduct._id }, { $set: parentProduct });
        // if (parentProduct._id && ENVIRONMENT === "Prod" && !fromJob) createOrUpdateProductSQSMessage(parentProduct._id)
    }

    public async addVariation(parentProduct: any, newVariation: any, fromJob: boolean = false, db: any) {
        console.log('add variation data by parent product id', parentProduct._id);
        newVariation.createdAt = Math.floor(Date.now() / 1000)
        newVariation.updatedAt = Math.floor(Date.now() / 1000)

        // Add the new variation to the parent product's variants array
        parentProduct.variants.push(newVariation);

        // Save the updated parent product to the database
        await db.collection('Products').updateOne({ _id: parentProduct._id }, { $set: parentProduct });
        if (parentProduct._id && ENVIRONMENT === "Prod" && !fromJob) createOrUpdateProductSQSMessage(parentProduct._id)
    }

    public async softDeleteProduct(product: any, db: any) {
        product.deletedAt = Math.floor(Date.now() / 1000)
        await db.collection('Products').updateOne({ _id: product._id }, { $set: product });
        if (product._id && ENVIRONMENT === "Prod") createOrUpdateProductSQSMessage(product._id)
    }

    public async findVariationByASIN(ASIN: any, db: any) {
        const parentProduct = await db.collection('Products').findOne({ "variants.ASIN": ASIN });
        if (parentProduct) {
            const variationIndex = parentProduct.variants.findIndex((v: any) => v.ASIN === ASIN);
            return { parentProduct, variationIndex };
        }
        return { parentProduct: null, variationIndex: -1 };
    }
    
    public async checkSKUOrASIN(payload: any, db: any) {
        try {
            console.log('payload', payload);
            const result = await db.collection('Products').findOne({
                $or: [
                    { "SKU": payload?.TYPE === "SKU" ? new RegExp(payload?.VALUE, 'i') : "" },
                    { "ASIN": payload?.TYPE === "ASIN" ? payload?.VALUE : "" },
                    { "variants": { $elemMatch: { "SKU": payload?.TYPE === "SKU" ? new RegExp(payload?.VALUE, 'i') : "" } } },
                    { "variants": { $elemMatch: { "ASIN": payload?.TYPE === "ASIN" ? payload?.VALUE : "" } } }
                ]
            });
            return result;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    public async findProductBySlug(slug: any, all_product: any, db: any) {
        try {
            const query: any = {
                "variants": {
                    $elemMatch: {
                        $or: [
                            { "slug.en": slug },
                            { "slug.ar": slug },
                            { "ASIN": slug }
                        ]
                    }
                }
            };

            if (all_product === undefined || all_product === null || all_product === "false" || all_product === false) {
                query.variants.$elemMatch.status = "PUBLISH";
            }
            const result = await db.collection('Products').findOne(query);
            return result
        }
        catch (err) {
            console.log("error :", err)
        }
    }

    public async findProductsByQuery(query: any, db: any) {
        try {
            const totalVariants = await db.collection('Products').aggregate([
                {
                    $unwind: "$variants"
                },
                {
                    $addFields: {
                        "variants.createdAt": "$createdAt",
                        "variants.updatedAt": "$updatedAt",
                        // "variants.deletedAt": {
                        //     $cond: {
                        //         if: { $eq: ["$variants.deletedAt", undefined] },
                        //         then: "$deletedAt",
                        //         else: "$variants.deletedAt"
                        //     }
                        // }
                        // "variants.deletedAt": "$deletedAt",
                        "variants.deletedAt": {
                            $ifNull: ["$variants.deletedAt", "$deletedAt"]
                        },
                    }
                },
                {
                    $replaceRoot: { newRoot: "$variants" }
                },
                {
                    $match: query
                }
            ]).toArray();
            return totalVariants;
        }
        catch (err) {
            console.log("error :", err)
        }
    }

    public async findProductsByQueryWithSkipLimit(query: any, offset: number, limit: number, db: any) {
        try {
            const totalVariants = await db.collection('Products').aggregate([
                {
                    $unwind: "$variants"
                },
                {
                    $addFields: {
                        "variants.createdAt": "$createdAt",
                        "variants.updatedAt": "$updatedAt",
                        // "variants.deletedAt": {
                        //     $cond: {
                        //         if: { $eq: ["$variants.deletedAt", undefined] },
                        //         then: "$deletedAt",
                        //         else: "$variants.deletedAt"
                        //     }
                        // }
                        "variants.deletedAt": "$deletedAt",
                        "variants._id": "$_id",
                    }
                },
                {
                    $replaceRoot: { newRoot: "$variants" }
                },
                {
                    $match: query
                },
                { $skip: offset },
                { $limit: limit }
            ]).toArray();
            return totalVariants;
        }
        catch (err) {
            console.log("error :", err)
        }
    }

    public async findProductId(query: any, db: any) {
        return await db.collection('Products').find(query, { _id: 1 }).toArray();
    }
}