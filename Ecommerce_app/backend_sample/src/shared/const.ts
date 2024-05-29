export const ENVIRONMENT: any = process.env.ENVIRONMENT;
export const MONGO_URI: any = process.env.MONGO_URI;
export const MONGO_DB_NAME: any = process.env.MONGO_DB_NAME;
export const PRODUCT_SEARCH_LIMIT: any = process.env.PRODUCT_SEARCH_LIMIT;
export const DYNAMIC_LINK_DOMAIN: string = `${process.env.DYNAMIC_LINK_DOMAIN}`;
export const FIREBASE_API_KEY: string = `${process.env.FIREBASE_API_KEY}`;
export const VERSION: string = "1.0.32";
export const DEFAULT_SEARCHING_FIELDS_MAIN: any = {
    original_name: 1,
    name: 1,
    slug: 1,
    ASIN: 1,
    SKU: 1,
    status: 1,
    delivery_time: 1,
    link: 1,
    source_type: 1,
    category_name: 1,
    category_slug: 1,
    brand_name: 1,
    images_gallery: 1,
    Product_images: 1,
    attributes: 1,
    reviews: 1,
    chatgpt_actions: 1,
    price: 1,
    price_iqd: 1,
    product_seo: 1,
    original_long_description: 1,
    original_short_description: 1,
    event: 1,
    brand: 1,
    category: 1,
    createdAt: 1,
    updatedAt: 1,
}
export const DEFAULT_SEARCHING_FIELDS_VARIANTS: any = {
    original_name: "$variants.original_name",
    name: "$variants.name",
    slug: "$variants.slug",
    ASIN: "$variants.ASIN",
    parent_slug: "$variants.parent_slug",
    SKU: "$variants.SKU",
    status: "$variants.status",
    delivery_time: "$variants.delivery_time",
    link: "$variants.link",
    source_type: "$variants.source_type",
    category_name: "$variants.category_name",
    category_slug: "$variants.category_slug",
    brand_name: "$variants.brand_name",
    images_gallery: "$variants.images_gallery",
    Product_images: "$variants.Product_images",
    attributes: "$variants.attributes",
    reviews: "$variants.reviews",
    chatgpt_actions: "$variants.chatgpt_actions",
    price: "$variants.price",
    price_iqd: "$variants.price_iqd",
    product_seo: "$variants.product_seo",
    original_long_description: "$variants.original_long_description",
    original_short_description: "$variants.original_short_description",
    event: "$variants.event",
    brand: "$variants.brand",
    category: "$variants.category",
    createdAt: "$variants.createdAt",
    updatedAt: "$variants.updatedAt"
}
export const TEXT_FILTERS = [
    'original_name.en',
    'original_name.ar',
    'name.en',
    'name.ar',
    'original_short_description.en',
    'original_short_description.ar',
    'original_long_description.en',
    'original_long_description.ar',
    'variants.original_name.en',
    'variants.original_name.ar',
    'variants.name.en',
    'variants.name.ar',
    'variants.original_short_description.en',
    'variants.original_short_description.ar',
    'variants.original_long_description.en',
    'variants.original_long_description.ar'
]
export const REDIS_CACHE_DOMAIN: string = `${process.env.REDIS_CACHE_DOMAIN}`;
export const REDIS_CACHE_PORT: string = `${process.env.REDIS_CACHE_PORT}`;
export const DEFAULT_EVENT_NAME: string = `${'NEW'}`;
export const DEFAULT_EVENT_COLOR: string = `${'#0080FF'}`;
export const SHIPPING_DATA = {
    "mode": "sea",
    "sea": {
        "min": 10,
        "max": 14
    },
    "air": {
        "min": 5,
        "max": 10
    },
    "compareOrderWith": "00:00"
}
export const CURRENCY = "USD - US Dollars";
export const REDIS_CACHE_EXPIRATION_TIME = 3600;
export const HOMEPAGE_API_END_POINT = ENVIRONMENT === "Prod" ? "https://api.hanooot.com/api/v1/home-page" : "https://staging.api.hanooot.com/api/v1/home-page";
export const CONVERSION_API_ENDPOINT = process.env.FACEBOOK_GRAPH_API_ENDPOINT;
export const CONVERSION_API_PIXEL_ID = process.env.CONVERSION_API_PIXEL_ID;
export const CONVERSION_API_TOKEN = process.env.CONVERSION_API_TOKEN;
export const STATIC_USER_DATA = {
    "country": "Iraq",
    "city": "Baghdad",
    "zip_code": "10011",
    "_id": "65ba2c6ed5f5a9253a767050",
    "full_name": "Mustafa Waiz",
    "phone_number": '+987810118370'
}
export const CREATE_PRODUCT_SQS = process.env.CREATE_PRODUCT_SQS
export const CREATE_PRODUCT_QUEUE_ARN = process.env.CREATE_PRODUCT_QUEUE_ARN
export const ZOHO_REFRESH_TOKEN = "1000.b68c139895e777fc005d9dddfe5eb144.83fbf7893858fbe856e243acadb9e6fb"
export const ZOHO_CLIENT_SECRET = "59767fbf60377898c58b73e0bb03e6fe89e408d090"
export const ZOHO_CLIENT_ID = "1000.6JHA1MA9MW13QM8NIQ4LIIGW8O891B"
export const TRIGGER_CONVERSION_EVENT_QUEUE_URL = process.env.TRIGGER_CONVERSION_EVENT_QUEUE_URL;
export const NEW_ARRIVALS = [5, 10, 20, 30, 40];
export const DISCOUNT_LIST = [10, 20, 30, 40, 50];
export const ELASTIC_ENDPOINT = `${process.env.ELASTIC_ENDPOINT}`;
export const ELASTIC_API_KEY = `${process.env.ELASTIC_API_KEY}`;
export const ZOHO_ITEM_API_URL = "https://www.zohoapis.com/inventory/v1/items/"
export const DELETE_ZOHO_PRODUCT_SQS = process.env.DELETE_ZOHO_PRODUCT_SQS
