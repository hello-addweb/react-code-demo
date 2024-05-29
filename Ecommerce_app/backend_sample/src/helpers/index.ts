import { DEFAULT_EVENT_COLOR, DEFAULT_EVENT_NAME, SHIPPING_DATA, TRIGGER_CONVERSION_EVENT_QUEUE_URL, CREATE_PRODUCT_SQS, ZOHO_REFRESH_TOKEN, ZOHO_CLIENT_SECRET, ZOHO_CLIENT_ID, ZOHO_ITEM_API_URL, ENVIRONMENT } from "../shared/const";
import { HttpStatusCode } from '../shared/http-status-codes';
import { ObjectId } from 'bson';
import { SQS } from 'aws-sdk'
import { ProductRepository } from '../repositories/ProductRepository';

export const getMetaData = (statusCode: number, message: string, data: object) => {
    let result: any = {
        meta: {},
        data: {}
    }
    result.meta.response_code = statusCode;
    result.meta.message = message;
    result.data = data
    return result;
}

export const getResponseCodeAndMessage = (tableName: string, totalCount: number, successCount: number, type: string) => {
    let message, responseCode;
    responseCode = HttpStatusCode.Ok;
    const pluralS = successCount !== 1 ? 's' : '';
    message = `Out of ${totalCount}, ${successCount} ${tableName}${pluralS} ${type}`;
    return { message, responseCode }
}

export const checkLatestProductAndAddNewEvent = async (product: any) => {
    if (!('event' in product) && 'createdAt' in product) {
        const twoWeeksInMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000;
        const currentDate: number = new Date().getTime();
        const dateInObj: number = new Date(product?.createdAt * 1000).getTime();
        if (currentDate - dateInObj <= twoWeeksInMilliseconds) {
            product.event = {
                name: DEFAULT_EVENT_NAME,
                color: DEFAULT_EVENT_COLOR
            };
        }
    }
    if (!('shipping' in product)) {
        product.shipping = SHIPPING_DATA
    }
    return product;
}

export const findCommonAttribute = async (product: any) => {
    const attributeVariants: { key: string; value: [{}]; default: string }[] = [];
    product.variants.forEach((item: any) => {
        let attributes = item.attributes;
        let slug = item.slug;
        for (const key in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, key)) {
                const value = attributes[key];
                if (value !== undefined && value !== null && value && typeof value === "string") {
                    // Check if the key already exists in attributeVariants
                    const existingAttribute = attributeVariants.find((attr) => attr.key === key);
                    if (existingAttribute) {
                        // Add the value to the existing attribute
                        existingAttribute.value.push({ name: value, slug });
                    } else {
                        // Create a new attribute
                        attributeVariants.push({
                            key: key,
                            value: [{ name: value, slug }],
                            default: product.attributes[key],
                        });
                    }
                }
            }
        }
    });
    const outputData: any = {
        "en": [],
        "ar": []
    };
    attributeVariants.forEach((item: any) => {
        const languageCode = item.key.includes("_ar") ? "ar" : "en";
        if (languageCode === 'ar') {
            item.value = item?.value?.map((i: any) => ({ ...i, slug: i?.slug?.ar }))
        } else {
            item.value = item?.value?.map((i: any) => ({ ...i, slug: i?.slug?.en }))
        }
        outputData[languageCode].push(item);
    });
    return outputData;
}

export const findDefaultVariant = (product: any, slug: any) => {
    if (product.slug.en === slug || product.slug.ar === slug) {
        return product.default_variant_slug;
    }
    for (const variant of product.variants) {
        if (variant.slug.en === slug || variant.slug.ar === slug) {
            return variant.slug.en;
        }
        else if (variant.slug.ar === slug) {
            return variant.slug.ar
        }
    }
    return "";
}

export const findParentData = async (category: any, targetCategorySlug: any, result: any = []) => {
    // console.log('targetCategorySlug', targetCategorySlug);
    if (category.slug.en.toLowerCase() === targetCategorySlug.toLowerCase()) {
        result.unshift({ name: category.name, slug: category.slug, _id: new ObjectId(category?._id?.toString()), default: true }); // Prepend the target category itself in the result
        return result.reverse(); // Reverse the array to get it in ascending order
    }

    if (category.children && category.children.length > 0) {
        for (const child of category.children) {
            const parentData: any = await findParentData(child, targetCategorySlug, [
                { name: category.name, slug: category.slug, _id: new ObjectId(category._id) },
                ...result
            ]);
            console.log('parentData', parentData)
            if (parentData.length > 0) {
                return parentData; // Return the parent data and the result from the child
            }
        }
    }
    return [];
}

export function getKeysFromAttributesArray(mapedResult: any) {
    const nonBlankKeys = new Set();

    for (const item of mapedResult) {
        const attribute = item?.attributes;
        Object.keys(attribute).forEach((key) => {
            if (typeof(key) === 'string' && isValidKey(key) && attribute[key]) {
                nonBlankKeys.add(key);
            }
        });
    }

    return Array.from(nonBlankKeys);
}

function isValidKey(key: any) {
    const exclusionList = ["others", "others_arabic", "dimensions", "dimensions_arabic"];
    return !exclusionList.includes(key);
}

export function getDefaultCombination(attributes: any, keys: any, language: string) {
    // const uniqueSlug = keys.map((key: any) => {
    //     const attributeKey = getKeyForLanguage(key, language);
    //     return `${attributes[attributeKey].toLowerCase().replace(/\s+/g, '-')}`;
    // }).join('_');
    const uniqueSlug: any = [];
    for (const key of keys) {
        uniqueSlug?.push(attributes[key])
    }
    return uniqueSlug;
}

export const getAllCombinations = (attributesArray: any, keysToCombine: any) => {
    const combinations: any = {};
    // console.log('keysToCombine', keysToCombine);

    for (const item of attributesArray) {
        for (const key of keysToCombine) {
            const languageKey = key;
            const value = item[languageKey] || item[key];

            if (!combinations[key]) {
                combinations[key] = [];
            }

            if (!combinations[key].includes(value)) {
                combinations[key].push(value);
            }
        }
    }

    // console.log("All Combinations in one object:", combinations);
    return combinations;
}

export const sendTriggerConversionEventSQSMessage = (payload: any) => {
    const sqs = new SQS();
    sqs.sendMessage({
        QueueUrl: `${TRIGGER_CONVERSION_EVENT_QUEUE_URL}`,
        MessageBody: JSON.stringify(payload)
    }).promise()
        .then(() => {
            console.log("Message sent successfully");
        })
        .catch((err: any) => {
            console.error("Error sending SQS message:", err);
            // Handle the error appropriately, e.g., logging or throwing
        });
}

export const formatDescription = (text: string) => {
    console.log('text', text);
    let replacedString = text.replace(/\n/g, "<br/>");
    console.log('replacedString', text);
    return replacedString;
}

export const createOrUpdateProductSQSMessage = async (id: string) => {
    const messagePayload = { id }
    const sqs = new SQS()
    await sqs.sendMessage({
        MessageBody: JSON.stringify(messagePayload),
        QueueUrl: `${CREATE_PRODUCT_SQS}`
    }).promise()
        .then(() => {
            console.log("Zoho Message sent successfully");
        })
        .catch((err: any) => {
            console.error("Zoho Error sending SQS message:", err);
            // Handle the error appropriately, e.g., logging or throwing
        });
}

export function getDatabaseFieldName(fieldNameArray: string[], findWord: string, product: any): string[] {
    const matchingFields: string[] = [];

    fieldNameArray.forEach(fieldName => {
        switch (fieldName) {
            case 'Product Name':
                if (product.name.en.includes(findWord)) {
                    matchingFields.push('name.en');
                } else if (product.name.ar.includes(findWord)) {
                    matchingFields.push('name.ar');
                }
                break;
            case 'Brand':
                if (product.brand_name.includes(findWord)) {
                    matchingFields.push('brand_name');
                } else if (product.brand.name.en.includes(findWord)) {
                    matchingFields.push('brand.name.en');
                } else if (product.brand.name.ar.includes(findWord)) {
                    matchingFields.push('brand.name.ar');
                }
                break;
            case 'Short Description':
                if (product.product_seo.short_description.en.includes(findWord)) {
                    matchingFields.push('product_seo.short_description.en');
                } else if (product.product_seo.short_description.ar.includes(findWord)) {
                    matchingFields.push('product_seo.short_description.ar');
                }
                break;
            case 'Key Word':
                if (product.product_seo.keywords.en.includes(findWord)) {
                    matchingFields.push('product_seo.keywords.en');
                } else if (product.product_seo.keywords.ar.includes(findWord)) {
                    matchingFields.push('product_seo.keywords.ar');
                }
                break;
            case 'Content':
                if (product.original_long_description.en.includes(findWord)) {
                    matchingFields.push('original_long_description.en');
                } else if (product.original_long_description.ar.includes(findWord)) {
                    matchingFields.push('original_long_description.ar');
                }
                break;
            case 'Meta Description':
                if (product.product_seo.meta_description.en.includes(findWord)) {
                    matchingFields.push('product_seo.meta_description.en');
                } else if (product.product_seo.meta_description.ar.includes(findWord)) {
                    matchingFields.push('product_seo.meta_description.ar');
                }
                break;
            case 'Alt Description':
                if (product.product_seo.alt_description.en.includes(findWord)) {
                    matchingFields.push('product_seo.alt_description.en');
                } else if (product.product_seo.alt_description.ar.includes(findWord)) {
                    matchingFields.push('product_seo.alt_description.ar');
                }
                break;
            case 'Product Tag':
                if (product.product_seo.product_tag.en.includes(findWord)) {
                    matchingFields.push('product_seo.product_tag.en');
                } else if (product.product_seo.product_tag.ar.includes(findWord)) {
                    matchingFields.push('product_seo.product_tag.ar');
                }
                break;
            // Add mappings for other fields as needed  
            default:
                break; // Handle unknown field names appropriately
        }
    });

    return matchingFields;
}

export const getFilteredFields = (fields: any) => {
    const filteredFields: any = [];
    for (const field of fields) {
        switch (field) {
            case 'product_name':
                filteredFields.push('name.en');
                filteredFields.push('name.ar');
                break;

            case 'product_tag':
                filteredFields.push('product_seo.product_tag.en');
                filteredFields.push('product_seo.product_tag.ar');
                break;

            case 'keyword':
                filteredFields.push('product_seo.keywords.en');
                filteredFields.push('product_seo.keywords.ar');
                break;

            case 'long_description':
                filteredFields.push('product_seo.long_description.en');
                filteredFields.push('product_seo.long_description.ar');
                break;

            case 'short_description':
                filteredFields.push('product_seo.short_description.en');
                filteredFields.push('product_seo.short_description.ar');
                break;

            case 'meta_description':
                filteredFields.push('product_seo.meta_description.en');
                filteredFields.push('product_seo.meta_description.ar');
                break;

            case 'alt_description':
                filteredFields.push('product_seo.alt_description.en');
                filteredFields.push('product_seo.alt_description.ar');
                break;

            case 'brand_name':
                filteredFields.push('brand_name');
                filteredFields.push('brand.name.en');
                filteredFields.push('brand.name.ar');
                break;

            case 'color':
                filteredFields.push('attributes.color');
                filteredFields.push('attributes.color_ar');
                break;

            default:
                break; // Handle unknown field names appropriately
        }
    }
    console.log('filteredFields', filteredFields);
    return filteredFields;
}

export const getFilterQuery = (findWord: string, fieldsArray: any) => {
    console.log('findWord', findWord);
    const orQueries: any = [];
    // const regex = new RegExp(findWord, 'i');
    const regexObj = { $regex: findWord, $options: 'i' };
    for (const field of fieldsArray) {
        switch (field) {
            case 'product_name':
                orQueries.push({ 'name.en': regexObj }); // English variant
                orQueries.push({ 'name.ar': regexObj }); // Arabic variant
                break;

            case 'product_tag':
                orQueries.push({ 'product_seo.product_tag.en': regexObj });
                orQueries.push({ 'product_seo.product_tag.ar': regexObj });
                break;

            case 'keyword':
                orQueries.push({ 'product_seo.keywords.en': regexObj });
                orQueries.push({ 'product_seo.keywords.ar': regexObj });
                break;

            case 'long_description':
                orQueries.push({ 'product_seo.long_description.en': regexObj });
                orQueries.push({ 'product_seo.long_description.ar': regexObj });
                break;

            case 'short_description':
                orQueries.push({ 'product_seo.short_description.en': regexObj });
                orQueries.push({ 'product_seo.short_description.ar': regexObj });
                break;

            case 'meta_description':
                orQueries.push({ 'product_seo.meta_description.en': regexObj });
                orQueries.push({ 'product_seo.meta_description.ar': regexObj });
                break;

            case 'alt_description':
                orQueries.push({ 'product_seo.alt_description.en': regexObj });
                orQueries.push({ 'product_seo.alt_description.ar': regexObj });
                break;

            case 'brand_name':
                orQueries.push({ 'brand_name': regexObj }); // Arabic variant
                orQueries.push({ 'brand.name.en': regexObj }); // English variant
                orQueries.push({ 'brand.name.ar': regexObj }); // Arabic variant
                break;

            case 'color':
                orQueries.push({ 'attributes.color': regexObj });
                orQueries.push({ 'attributes.color_ar': regexObj });
                break;

            default:
                break; // Handle unknown field names appropriately
        }
    }
    console.log('orQueries', JSON.stringify(orQueries));
    return orQueries;
}

export const callZohoProductSQSForMultipleProduct = async (findQuery: any, db: any) => {

    const productRepository = new ProductRepository()
    const productData = await productRepository.findProductId(findQuery, db)

    await productData.reduce((result: any, currentProduct: any) => {
        if (!result.includes(currentProduct._id)) {
            result.push(currentProduct._id);
        }
        return result;
    }, []).map((product: string) => {
        if (product && ENVIRONMENT === "Prod") createOrUpdateProductSQSMessage(product)
    });
}