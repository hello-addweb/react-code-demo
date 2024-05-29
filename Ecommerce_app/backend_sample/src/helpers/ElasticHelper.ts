import { BasicInfo, BasicCategoryInfo, ElasticProduct, ElasticCategory, ElasticBrand, BasicBrandInfo, SEOInfo } from "../interfaces";
import { SHIPPING_DATA } from "../shared/const";

export const extractBasicProductInfo = (productData: ElasticProduct): BasicInfo => {
    // Function to remove whitespace-only fields recursively
    const removeWhitespaceFields = (obj: { [x: string]: any; hasOwnProperty?: any; }) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key.trim() === '') {
                    delete obj[key]; // Remove the field if the key consists of only whitespace
                }
                else if (key === "others" || key === "others_arabic") {
                    obj[key] = JSON.stringify(obj[key]);
                }
                else if (typeof obj[key] === 'object') {
                    // Recursively call removeWhitespaceFields for nested objects
                    removeWhitespaceFields(obj[key]);
                } else if (obj[key] === "") {
                    delete obj[key];
                }
            }
        }
        return obj; // Return the cleaned object
    };

    const numberOfReviews: number | null = productData?.reviews?.number_of_reviews ? parseFloat(`${productData?.reviews?.number_of_reviews}`) : null;
    if (numberOfReviews !== null) productData.reviews.number_of_reviews = numberOfReviews;

    // Map the basic product info fields
    return {
        name: productData.name,
        original_name: productData.original_name,
        // original_short_description: productData.original_short_description,
        // original_long_description: productData.original_long_description,
        slug: productData.slug,
        brand_name: productData.brand_name,
        category_name: productData.category_name,
        category: productData.category,
        brand: productData.brand,
        category_slug: productData.category_slug,
        group_slug: productData?.parent_slug && productData?.parent_slug !== '' ? productData?.parent_slug : productData?.slug?.en,
        parent_slug: productData.parent_slug,
        link: productData.link,
        SKU: productData.SKU,
        ASIN: productData.ASIN,
        source_type: productData.source_type,
        delivery_time: productData.delivery_time,
        status: productData.status,
        images_gallery: productData.images_gallery,
        product_images: productData.Product_images,
        product_seo: {
            keywords: productData.product_seo.keywords,
            product_tag: productData.product_seo.product_tag,
        },
        event: productData.event,
        // Call removeWhitespaceFields on attributes to clean up whitespace-only fields
        attributes: removeWhitespaceFields({ ...productData.attributes }),
        default_variant_slug: productData.default_variant_slug,
        reviews: productData.reviews,
        price_iqd: productData.price_iqd,
        shipping: productData?.shipping ? productData?.shipping : SHIPPING_DATA,
        thumbnails: productData?.thumbnails,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
    };
};

export const extractSeoInfo = (productData: ElasticProduct): SEOInfo => ({
    ASIN: productData.ASIN,
    short_description: productData.product_seo.short_description,
    long_description: productData.product_seo.long_description,
    keywords: productData.product_seo.keywords,
    product_tag: productData.product_seo.product_tag,
    meta_description: productData.product_seo.meta_description,
    alt_description: productData.product_seo.alt_description
});