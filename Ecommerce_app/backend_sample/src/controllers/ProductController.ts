import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ProductRepository } from '../repositories/ProductRepository';
import { MongoClient } from 'mongodb';
import createProductSchema from '../functions/CreateProduct/schema';
import deleteProductSchema from '../functions/DeleteProduct/schema';
import getProductSchema from '../functions/GetProduct/schema';
import getProductDetailSchema from '../functions/GetProductDetails/schema';
import getProductVariationsSchema from '../functions/GetProductVariations/schema';
import getProductVariationsV2Schema from '../functions/GetProductVariationsV2/schema';
import { findParentData, getMetaData, getResponseCodeAndMessage, findCommonAttribute, checkLatestProductAndAddNewEvent, getDefaultCombination, getAllCombinations, getKeysFromAttributesArray, sendTriggerConversionEventSQSMessage, formatDescription, createOrUpdateProductSQSMessage } from '../helpers';
import { HttpStatusCode } from '../shared/http-status-codes';
import { ResponseBuilder } from '../shared/response-builder';
import { ElasticProduct } from '../interfaces';
import { BrandRepository } from '../repositories/BrandRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { FinancialSettingsRepository } from '../repositories/FinancialSettingsRepository';
import { ElasticController } from './ElasticController'
import { deleteProductFromZohoSQSMessage } from "../helpers/ZohoHelper";
import { CURRENCY, ENVIRONMENT, MONGO_DB_NAME, MONGO_URI } from '../shared/const';

export class ProductController {
    private productRepository = new ProductRepository();
    private brandRepository = new BrandRepository();
    private categoryRepository = new CategoryRepository();
    private financialSettingsRepository = new FinancialSettingsRepository();
    private elasticController = new ElasticController()

    private async establishDBConnection() {
        const client = await MongoClient.connect(MONGO_URI);
        const db = client.db(MONGO_DB_NAME);
        return { client, db }
    }

    private async closeConnections(client: any) {
        await client.close();
    }

    // Product crud functions
    public calculateIQDPrice = async (obj: any, db: any) => {
        const financialSetting = await this.financialSettingsRepository.findByCurrency(CURRENCY, db);
        // console.log('financialSetting', financialSetting);
        if (financialSetting && financialSetting.exchange_rate) {
            const exchangeRate = financialSetting.exchange_rate;
            const fieldsToCalculate = [
                'price',
                'discount',
                'commission',
                'shipping_cost',
                'price_air',
                'discount_air',
                'shipping_cost_by_air'
            ];

            const price_iqd: any = {};
            for (const field of fieldsToCalculate) {
                if (obj?.price?.hasOwnProperty(field)) {
                    const calculatedValue = obj.price[field] * exchangeRate;
                    // price_iqd[field] = parseFloat(calculatedValue.toFixed(2));
                    price_iqd[field] = 250 * Math.round(calculatedValue / 250);
                }
            }

            obj.price_iqd = { ...obj.price, ...price_iqd };
        }
        return obj;
    }

    public attachBrandAndCategoryObj = async (product: any, db: any) => {
        if (product?.brand_name) {
            const brand = await this.brandRepository.findByName(product?.brand_name, db);
            // console.log('brand', brand);
            if (brand) product.brand = brand;
            else delete product?.brand;
        }
        if (!product?.brand_name && product?.brand) {
            delete product?.brand;
        }
        if (product?.category_slug) {
            // console.log('product?.category_name', product?.category_name);
            const category = await this.categoryRepository.findBySlugInAllLevels(product?.category_slug, db);
            // console.log('category', category);
            if (category) {
                const categoryArrays = await findParentData(category, product?.category_slug);
                product.category = categoryArrays;
            } else {
                delete product.category;
            }
        }
        if (!product?.category_slug && product?.category) {
            delete product?.category;
        }
        if (product?.price && Object.keys(product?.price)?.length >= 1) {
            product = await this.calculateIQDPrice(product, db);
        }
        // console.log('product', product);
        return product;
    }

    public attachBrandAndCategoryObjInVariants = async (obj: any, db: any) => {
        // console.log('obj.variants', obj?.variants);
        for (let index = 0; index < obj.variants.length; index++) {
            obj.variants[index] = await this.attachBrandAndCategoryObj(obj.variants[index], db);
        }
        // console.log(obj);
        return obj;
    }

    public processProduct = async (obj: any, db: any, productStatus: any[], fromJob: boolean = false) => {
        if (this.productRepository.isParentProduct(obj)) {
            console.log('isParentProduct', obj?.ASIN);
            // Handle parent product
            let product = await this.productRepository.findProduct(obj, db);

            // attach brand, category, and price_iqd
            obj = await this.attachBrandAndCategoryObj(obj, db);
            if (obj?.variants?.length >= 1) {
                obj = await this.attachBrandAndCategoryObjInVariants(obj, db);
            }
            if (obj?.price && Object.keys(obj?.price)?.length >= 1) {
                obj = await this.calculateIQDPrice(obj, db);
            }

            if (product) {
                // Update existing parent product
                let unsetFields: any = {};
                if (!obj?.category) unsetFields.category = 1;
                if (!obj?.brand) unsetFields.brand = 1;
                obj.updatedAt = Math.floor(Date.now() / 1000);
                if (ENVIRONMENT === "Prod" && obj?.variants && obj.variants.length > 0) {
                    const variants = obj.variants as ElasticProduct[];
                    for (const variant of variants) {
                        if (variant) {
                            await this.elasticController.syncSingleProduct(variant);
                        }
                    }
                }
                if (ENVIRONMENT === "Prod" && (!obj?.variants || (obj?.variants && obj?.variants?.length < 1))) {
                    await this.elasticController.syncSingleProduct(obj)
                }
                await this.productRepository.updateProduct(product, obj, unsetFields, fromJob, db);
                // update first variant
                const defaultVariantIndex = product?.variants?.findIndex((variant: any) => variant?.parent_slug === "");
                // console.log('defaultVariantIndex', defaultVariantIndex);
                if (defaultVariantIndex !== -1) {
                    await this.productRepository.updateVariantProduct(product?._id?.toString(), defaultVariantIndex, obj, fromJob, db);
                }
                productStatus.push({ status: 'success', message: "Parent product updated successfully." });
            } else {
                // Create new parent product
                obj.createdAt = obj.updatedAt = Math.floor(Date.now() / 1000);
                if (ENVIRONMENT === "Prod" && obj?.variants && obj.variants.length > 0) {
                    const variants = obj.variants as ElasticProduct[];
                    for (const variant of variants) {
                        if (variant) {
                            await this.elasticController.syncSingleProduct(variant);
                        }
                    }
                }
                const newProduct = await db.collection('Products').insertOne(obj);
                console.log('fromJob', fromJob);
                if (newProduct?.insertedId && ENVIRONMENT === "Prod" && !fromJob) {
                    await createOrUpdateProductSQSMessage(newProduct?.insertedId)
                }
                productStatus.push({ status: 'success', message: "Parent product created successfully." });
            }
        } else {
            console.log('isVariantProduct', obj?.ASIN);
            // Handle variation
            let parentProduct = await this.productRepository.findParentProduct(obj.parent_slug, db);
            if (parentProduct) {
                let variation = await this.productRepository.findVariation(parentProduct, obj);
                // console.log('variation', variation);
                // attach brand, category, and price_iqd
                obj = await this.attachBrandAndCategoryObj(obj, db);
                if (obj?.price && Object.keys(obj?.price)?.length >= 1) {
                    obj = await this.calculateIQDPrice(obj, db);
                }
                if (variation) {
                    // Update existing variation
                    obj.updatedAt = Math.floor(Date.now() / 1000);
                    await this.productRepository.updateVariation(parentProduct, variation, obj, fromJob, db);
                    productStatus.push({ status: 'success', message: "Variation updated successfully." });
                } else {
                    // Add new variation
                    obj.createdAt = obj.updatedAt = Math.floor(Date.now() / 1000);
                    await this.productRepository.addVariation(parentProduct, obj, fromJob, db);
                    productStatus.push({ status: 'success', message: "Variation added successfully." });
                }
                if (ENVIRONMENT === "Prod") {
                    const newCreatedParentProduct = await this.productRepository.findParentProduct(obj.parent_slug, db);
                    const newVariation = await this.productRepository.findVariation(newCreatedParentProduct, obj);
                    await this.elasticController.syncSingleProduct(newVariation)
                }
            } else {
                productStatus.push({ status: 'failed', message: "Parent product not found for variation.", parent_slug: obj.parent_slug });
            }
        }
    };

    public createProduct = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
        context.callbackWaitsForEmptyEventLoop = false;
        let statusCode: any, result: any, data, client: any, db;
        let productStatus: any = [];
        try {
            ({ client, db } = await this.establishDBConnection());
            let body: any = event?.body;
            if (!body || !body.data) {
                statusCode = HttpStatusCode.BadRequest;
                data = getMetaData(HttpStatusCode.BadRequest, "Body parameters does not exist", {});
                result = JSON.stringify(data);
            }
            const productsData = Array.isArray(body.data) ? body.data : [body.data];

            for (const obj of productsData) {
                const validate = createProductSchema?.validate(obj);
                if (validate?.error) {
                    productStatus.push({ status: 'failed', message: validate.error.details[0].message });
                    continue;
                }
                if (obj?.brand_name) obj.brand_name = obj?.brand_name?.trim();
                if (obj?.category_name) obj.category_name = obj?.category_name?.trim();
                if (obj?.category_slug) obj.category_slug = obj?.category_slug?.trim();
                await this.processProduct(obj, db, productStatus);
            }

            const successCount = productStatus.filter((obj: any) => obj.status === 'success').length;
            const { message, responseCode } = getResponseCodeAndMessage('product', productStatus.length, successCount, 'processed');
            statusCode = HttpStatusCode.Ok;
            data = getMetaData(responseCode, message, { product_status: productStatus });
            console.log('proccessed response', data);
            result = JSON.stringify(data);
        } catch (error) {
            console.error('Error:', error);
            statusCode = HttpStatusCode.InternalServerError;
            data = getMetaData(HttpStatusCode.InternalServerError, "Internal Server Error", {});
            result = JSON.stringify(data);
        } finally {
            await this.closeConnections(client);
        }
        return ResponseBuilder.custom(result, statusCode);
    };

    public deleteProduct = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
        context.callbackWaitsForEmptyEventLoop = false;
        let statusCode: any, result: any, data, client: any, db;
        let ASIN: any = event?.queryStringParameters?.ASIN;

        try {
            ({ client, db } = await this.establishDBConnection());
            if (!event?.queryStringParameters) {
                statusCode = HttpStatusCode.BadRequest;
                data = getMetaData(HttpStatusCode.BadRequest, "Query parameters does not exists", {});
                result = JSON.stringify(data);
            } else {
                const validate = deleteProductSchema?.validate(event?.queryStringParameters);
                if (validate?.error) {
                    statusCode = HttpStatusCode.BadRequest;
                    data = getMetaData(HttpStatusCode.BadRequest, validate.error.details[0].message, {});
                    result = JSON.stringify(data);
                } else {
                    let product = await this.productRepository.findByASIN(ASIN, db);
                    if (product) {
                        if (ENVIRONMENT === "Prod") {
                            if (product?.variants && product?.variants?.length >= 1) {
                                const ASINS = product?.variants?.filter((variant: any) => !variant?.deletedAt)?.map((variant: any) => variant?.ASIN);
                                await this.elasticController.bulkDelete(ASINS);
                                await deleteProductFromZohoSQSMessage(ASINS);
                            }
                        }
                        await this.productRepository.softDeleteProduct(product, db);
                        statusCode = HttpStatusCode.Ok;
                        data = getMetaData(HttpStatusCode.Ok, "Product deleted successfully", {});
                    } else {
                        let { parentProduct, variationIndex } = await this.productRepository.findVariationByASIN(ASIN, db);
                        if (parentProduct && variationIndex > -1) {
                            parentProduct.variants[variationIndex].deletedAt = Math.floor(Date.now() / 1000)
                            if (ENVIRONMENT === "Prod") {
                                const ASIN = parentProduct.variants[variationIndex].ASIN;
                                await this.elasticController.deleteProduct(ASIN);
                                await deleteProductFromZohoSQSMessage([ASIN]);
                            }
                            await this.productRepository.update(parentProduct, db);
                            statusCode = HttpStatusCode.Ok;
                            data = getMetaData(HttpStatusCode.Ok, "Variation deleted successfully", {});
                        } else {
                            statusCode = HttpStatusCode.NotFound;
                            data = getMetaData(HttpStatusCode.NotFound, "Product or variation not found", {});
                        }
                    }
                    result = JSON.stringify(data);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            statusCode = HttpStatusCode.InternalServerError;
            data = getMetaData(HttpStatusCode.InternalServerError, "Internal Server Error", {});
            result = JSON.stringify(data);
        } finally {
            await this.closeConnections(client);
        }
        return ResponseBuilder.custom(result, statusCode);
    };

    public getProduct = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
        context.callbackWaitsForEmptyEventLoop = false;
        let statusCode: any, result: any, data, client: any, db;
        let ASIN: any = event?.queryStringParameters?.ASIN

        try {
            ({ client, db } = await this.establishDBConnection());
            if (!event?.queryStringParameters) {
                statusCode = HttpStatusCode.BadRequest;
                data = getMetaData(HttpStatusCode.BadRequest, "Query parameters does not exists", {});
                result = JSON.stringify(data);
            }
            else {
                const validate = getProductSchema?.validate(event?.queryStringParameters);
                if (validate?.error) {
                    statusCode = HttpStatusCode.BadRequest;
                    data = getMetaData(HttpStatusCode.BadRequest, validate.error.details[0].message, {});
                    result = JSON.stringify(data);
                } else {
                    let product = await this.productRepository.findByVariantASIN(ASIN, db);
                    console.log("new variant")
                    if (!product) {
                        statusCode = HttpStatusCode.NotFound;
                        data = getMetaData(HttpStatusCode.NotFound, "Product with the given ASIN not found.", {});
                        result = JSON.stringify(data);
                    } else {
                        statusCode = HttpStatusCode.Ok;
                        data = getMetaData(HttpStatusCode.Ok, "Product fetched successfully.", product);
                        result = JSON.stringify(data);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            statusCode = HttpStatusCode.InternalServerError;
            data = getMetaData(HttpStatusCode.InternalServerError, "Internal Server Error", {});
            result = JSON.stringify(data);
        } finally {
            await this.closeConnections(client);
        }
        return ResponseBuilder.custom(result, statusCode);
    };

    public getProductDetail = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
        context.callbackWaitsForEmptyEventLoop = false;
        let statusCode: any, result: any, data, client: any, db;
        try {
            ({ client, db } = await this.establishDBConnection());
            if (!event?.pathParameters) {
                statusCode = HttpStatusCode.BadRequest;
                data = getMetaData(HttpStatusCode.BadRequest, "Query parameters does not exists", {});
                result = JSON.stringify(data);
            }
            else {
                const validate = getProductDetailSchema?.validate(event?.pathParameters);
                if (validate?.error) {
                    statusCode = HttpStatusCode.BadRequest;
                    data = getMetaData(HttpStatusCode.BadRequest, validate.error.details[0].message, {});
                    result = JSON.stringify(data);
                } else {
                    let { slug } = validate?.value;
                    let all_product = event?.queryStringParameters?.all_product
                    let product: any = await this.productRepository.findProductBySlug(slug, all_product, db);
                    if (!product) {
                        statusCode = HttpStatusCode.NotFound;
                        data = getMetaData(HttpStatusCode.NotFound, "Product with the given slug not found.", {});
                        result = JSON.stringify(data);
                    } else {
                        if (!all_product) {
                            product.variants = product.variants.filter((variant: any) => variant.status === "PUBLISH");
                        }
                        const variations = await findCommonAttribute(product)
                        product.variations = variations;
                        const defaultVariant = product?.variants?.find((variant: any) => variant?.slug?.en === slug || variant?.slug?.ar === slug || variant?.ASIN === slug);
                        // const defaultVariant = await findDefaultVariant(product, slug);
                        product.default_variant_slug = defaultVariant?.slug?.en || defaultVariant?.slug?.ar;
                        product.other_variation = {
                            "en": defaultVariant?.attributes?.others,
                            "ar": defaultVariant?.attributes?.others_arabic
                        };
                        product = await checkLatestProductAndAddNewEvent(product);
                        product.variants = product?.variants?.map((variant: any) => {
                            if (variant?.original_long_description?.en) {
                                variant.original_long_description.en = formatDescription(variant.original_long_description.en);
                            }
                            if (variant && variant?.default_variant_slug) {
                                delete variant.default_variant_slug;
                            }
                            if (variant?.variants) {
                                delete variant.variants;
                            }
                            return variant;
                        });
                        if (product?.original_long_description?.en) {
                            product.original_long_description.en = formatDescription(product.original_long_description.en);
                        }
                        statusCode = HttpStatusCode.Ok;
                        data = getMetaData(HttpStatusCode.Ok, "Product fetched successfully.", product);
                        result = JSON.stringify(data);

                        if (ENVIRONMENT === 'Prod') {
                            const deviceInfo = event?.headers['device-information'] || event?.headers['Device-Information'];
                            const userData = event?.headers['User'] || event?.headers['user'];
                            const user = userData ? JSON.parse(decodeURI(userData)) : null;
                            const customData = {
                                currency: "IQD",
                                content_ids: [
                                    product?.ASIN
                                ],
                                content_type: "product",
                                content_name: product?.name?.en || product?.name?.ar,
                                content_category: product?.category_name,
                                value: product?.price_iqd?.discount || product?.price_iqd?.price,
                                images_gallery: product?.images_gallery,
                                product_link: product?.dynamic_link,
                                fb_content: [
                                    {
                                        product_name: product?.name,
                                        ASIN: product?.ASIN,
                                        quantity: product?.quantity || 1,
                                        price: product?.price_iqd?.discount || product?.price_iqd?.price
                                    }
                                ]
                            }
                            const payload = {
                                type: "facebook_conversion",
                                data: {
                                    event_name: "ViewContent",
                                    device_info: deviceInfo && deviceInfo !== "" ? JSON.parse(deviceInfo) : {},
                                    user,
                                    custom_data: customData
                                }
                            }
                            console.log("payload", payload);
                            // call conversion API
                            sendTriggerConversionEventSQSMessage(payload);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            statusCode = HttpStatusCode.InternalServerError;
            data = getMetaData(HttpStatusCode.InternalServerError, "Internal Server Error", {});
            result = JSON.stringify(data);
        } finally {
            await this.closeConnections(client);
        }
        return ResponseBuilder.custom(result, statusCode);
    };

    public getProductVariations = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
        context.callbackWaitsForEmptyEventLoop = false;
        let statusCode: any, result: any, data, client: any, db;
        try {
            ({ client, db } = await this.establishDBConnection());

            if (!event?.pathParameters) {
                statusCode = HttpStatusCode.BadRequest;
                data = getMetaData(HttpStatusCode.BadRequest, "Query parameters do not exist", {});
                result = JSON.stringify(data);
            } else {
                const validation = getProductVariationsSchema?.validate(event?.pathParameters);

                if (validation?.error) {
                    statusCode = HttpStatusCode.BadRequest;
                    data = getMetaData(HttpStatusCode.BadRequest, validation.error.details[0].message, {});
                    result = JSON.stringify(data);
                } else {
                    let { slug } = validation?.value;
                    let product: any = await this.productRepository.findProductBySlug(slug, false, db);
                    // console.log('product', product);
                    if (!product) {
                        statusCode = HttpStatusCode.NotFound;
                        data = getMetaData(HttpStatusCode.NotFound, "Product with the given slug not found", {});
                        result = JSON.stringify(data);
                    } else {
                        // console.log('product?.variants', product?.variants);
                        product.variants = product?.variants?.filter((variant: any) => variant.status === "PUBLISH");
                        let lang = event?.queryStringParameters?.lang;
                        let attributesValue = product?.variants?.map((variant: any) => variant?.attributes);
                        const keys = getKeysFromAttributesArray(product?.variants);
                        // console.log('keys', keys);
                        if (!lang) {
                            lang = 'en'
                        }
                        const enKeys = keys.filter((key: any) => !key.includes('_ar'));
                        const arKeys = keys.filter((key: any) => key.includes('_ar'));
                        console.log('product?.variants', product?.variants);
                        const defaultVariant = product?.variants?.find((variants: any) => variants?.slug?.en === slug || variants?.slug?.ar === slug);
                        console.log('defaultVariant', defaultVariant);
                        const combinationMatrix: any = getAllCombinations(attributesValue, lang === 'en' ? enKeys : arKeys);
                        const combinationsValue: any = [];

                        product.variants = product?.variants?.map((item: any) => {
                            const combination = getDefaultCombination(item.attributes, enKeys, 'en');
                            const arabic_combination = getDefaultCombination(item.attributes, arKeys, 'ar');
                            item.attributes.combination = combination;
                            item.attributes.arabic_combination = arabic_combination;
                            combinationsValue?.push({ slug: item?.slug?.en, combination: item?.attributes?.combination, arabic_combination: item?.attributes?.arabic_combination });
                            return { ...item };
                        });

                        const defaultCombination = lang === 'en' ? defaultVariant?.attributes?.combination : defaultVariant?.attributes?.arabic_combination;
                        console.log('defaultCombination', defaultCombination);

                        const response = [];
                        let index = 0;

                        for (const key in combinationMatrix) {
                            const resVal = [];

                            for (const keyVal of combinationMatrix[key]) {
                                const payload: any = { title: keyVal };

                                if (defaultCombination[index] === keyVal) {
                                    // payload.combination = defaultCombination;
                                    payload.isSelected = true;
                                    payload.slug = defaultVariant?.slug?.en;
                                } else {
                                    const defaultVal = [...defaultCombination];
                                    defaultVal[index] = keyVal;

                                    const newCombinationVal = combinationsValue?.map((comb: any) => lang === 'en' ? comb?.combination : comb?.arabic_combination);
                                    const includesSubArray = newCombinationVal.some((array: any) => JSON.stringify(array) === JSON.stringify(defaultVal));

                                    if (includesSubArray) {
                                        // payload.combination = defaultVal;
                                        // payload.slug = defaultVariant?.slug?.en;
                                        for (const combVal of combinationsValue) {
                                            const combElement = lang === 'en' ? combVal.combination : combVal.arabic_combination;
                                            if (JSON.stringify(combElement) === JSON.stringify(defaultVal)) {
                                                // payload.combination = combElement;
                                                payload.slug = combVal.slug;
                                                break;
                                            }
                                        }
                                    } else {
                                        for (const combVal of combinationsValue) {
                                            const combElement = lang === 'en' ? combVal.combination : combVal.arabic_combination;
                                            if (combElement[index] === keyVal) {
                                                // payload.combination = combElement;
                                                payload.slug = combVal.slug;
                                                break;
                                            }
                                        }
                                    }
                                }

                                resVal.push(payload);
                            }

                            response.push({
                                key: lang === 'ar' ? key?.split('_')[0] : key,
                                value: resVal
                            });

                            index++;
                        }

                        statusCode = HttpStatusCode.Ok;
                        data = getMetaData(HttpStatusCode.Ok, "Product variations fetched successfully", response);
                        result = JSON.stringify(data);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            statusCode = HttpStatusCode.InternalServerError;
            data = getMetaData(HttpStatusCode.InternalServerError, "Internal Server Error", {});
            result = JSON.stringify(data);
        } finally {
            await this.closeConnections(client);
        }

        return ResponseBuilder.custom(result, statusCode);
    };

    public getProductVariationsV2 = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
        context.callbackWaitsForEmptyEventLoop = false;
        let statusCode: any, result: any, data, client: any, db;
        try {
            ({ client, db } = await this.establishDBConnection());

            if (!event?.pathParameters) {
                statusCode = HttpStatusCode.BadRequest;
                data = getMetaData(HttpStatusCode.BadRequest, "Query parameters do not exist", {});
                result = JSON.stringify(data);
            } else {
                const validation = getProductVariationsV2Schema?.validate(event?.pathParameters);

                if (validation?.error) {
                    statusCode = HttpStatusCode.BadRequest;
                    data = getMetaData(HttpStatusCode.BadRequest, validation.error.details[0].message, {});
                    result = JSON.stringify(data);
                } else {
                    let { slug } = validation?.value;
                    let product: any = await this.productRepository.findProductBySlug(slug, false, db);
                    // console.log('product', product);
                    if (!product) {
                        statusCode = HttpStatusCode.NotFound;
                        data = getMetaData(HttpStatusCode.NotFound, "Product with the given slug not found", {});
                        result = JSON.stringify(data);
                    } else {
                        // console.log('product?.variants', product?.variants);
                        product.variants = product?.variants?.filter((variant: any) => variant.status === "PUBLISH");
                        let lang = event?.queryStringParameters?.lang;
                        let attributesValue = product?.variants?.map((variant: any) => variant?.attributes);
                        const keys = getKeysFromAttributesArray(product?.variants);
                        // console.log('keys', keys);
                        if (!lang) {
                            lang = 'en'
                        }
                        const enKeys = keys.filter((key: any) => !key.includes('_ar'));
                        const arKeys = keys.filter((key: any) => key.includes('_ar'));
                        console.log('product?.variants', product?.variants);
                        const defaultVariant = product?.variants?.find((variants: any) => variants?.slug?.en === slug || variants?.slug?.ar === slug);
                        console.log('defaultVariant', defaultVariant);
                        const combinationMatrix: any = getAllCombinations(attributesValue, lang === 'en' ? enKeys : arKeys);
                        const combinationsValue: any = [];

                        product.variants = product?.variants?.map((item: any) => {
                            const combination = getDefaultCombination(item.attributes, enKeys, 'en');
                            const arabic_combination = getDefaultCombination(item.attributes, arKeys, 'ar');
                            item.attributes.combination = combination;
                            item.attributes.arabic_combination = arabic_combination;
                            combinationsValue?.push({ slug: item?.slug?.en, combination: item?.attributes?.combination, arabic_combination: item?.attributes?.arabic_combination });
                            return { ...item };
                        });

                        const defaultCombination = lang === 'en' ? defaultVariant?.attributes?.combination : defaultVariant?.attributes?.arabic_combination;
                        console.log('defaultCombination', defaultCombination);

                        const response = [];
                        let index = 0;

                        for (const key in combinationMatrix) {
                            const resVal = [];

                            for (const keyVal of combinationMatrix[key]) {
                                const payload: any = { title: keyVal };

                                if (defaultCombination[index] === keyVal) {
                                    // payload.combination = defaultCombination;
                                    payload.isSelected = true;
                                    payload.slug = defaultVariant?.slug?.en;
                                } else {
                                    const defaultVal = [...defaultCombination];
                                    defaultVal[index] = keyVal;

                                    const newCombinationVal = combinationsValue?.map((comb: any) => lang === 'en' ? comb?.combination : comb?.arabic_combination);
                                    const includesSubArray = newCombinationVal.some((array: any) => JSON.stringify(array) === JSON.stringify(defaultVal));

                                    if (includesSubArray) {
                                        // payload.combination = defaultVal;
                                        // payload.slug = defaultVariant?.slug?.en;
                                        for (const combVal of combinationsValue) {
                                            const combElement = lang === 'en' ? combVal.combination : combVal.arabic_combination;
                                            if (JSON.stringify(combElement) === JSON.stringify(defaultVal)) {
                                                // payload.combination = combElement;
                                                payload.slug = combVal.slug;
                                                break;
                                            }
                                        }
                                    } else {
                                        for (const combVal of combinationsValue) {
                                            const combElement = lang === 'en' ? combVal.combination : combVal.arabic_combination;
                                            if (combElement[index] === keyVal) {
                                                // payload.combination = combElement;
                                                payload.slug = combVal.slug;
                                                break;
                                            }
                                        }
                                    }
                                }

                                resVal.push(payload);
                            }

                            const attributes_translations = product?.attributes_translations;
                            console.log('attributes_translations', attributes_translations);

                            response.push({
                                key: lang === 'ar' ? attributes_translations && attributes_translations[key] ? attributes_translations[key] : key?.split('_')[0] : key,
                                value: resVal
                            });

                            index++;
                        }

                        statusCode = HttpStatusCode.Ok;
                        data = getMetaData(HttpStatusCode.Ok, "Product variations fetched successfully", response);
                        result = JSON.stringify(data);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            statusCode = HttpStatusCode.InternalServerError;
            data = getMetaData(HttpStatusCode.InternalServerError, "Internal Server Error", {});
            result = JSON.stringify(data);
        } finally {
            await this.closeConnections(client);
        }

        return ResponseBuilder.custom(result, statusCode);
    };
}
