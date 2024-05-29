export interface ElasticProduct {
  name: LocalizedString;
  slug: LocalizedString;
  original_name: LocalizedString;
  original_short_description: LocalizedString;
  original_long_description: LocalizedString;
  brand_name: string;
  category_name: string;
  parent_slug: string;
  link: string;
  SKU: string;
  ASIN: string;
  source_type: string;
  short_description: LocalizedString;
  long_description: LocalizedString;
  delivery_time: LocalizedString;
  status: string;
  images_gallery: string[];
  Product_images: string[];
  attributes: ProductAttributes;
  default_variant_slug: string;
  reviews: Review;
  price: Price;
  price_iqd: Price,
  product_seo: SEOInfo;
  variants: Variant[];
  brand: Brand;
  category: Category[];
  updatedAt: number;
  createdAt: number;
  event: {
    name: string,
    color: string,
  },
  category_slug: string;
  thumbnails: string[],
  shipping : Shipping
}

export interface Variant {
  name: LocalizedString;
  slug: LocalizedString;
  brand_name: string;
  category_name: string;
  category_slug: string;
  parent_slug: string;
  link: string;
  SKU: string;
  ASIN: string;
  source_type: string;
  short_description: LocalizedString;
  long_description: LocalizedString;
  delivery_time: LocalizedString;
  status: string;
  images_gallery: string[];
  product_images: string[];
  attributes: ProductAttributes;
  default_variant_slug: string;
  reviews: Review;
  price: Price;
  product_seo: ProductSEO;
  brand: Brand;
  updatedAt: number;
}

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface IObject {
  [key: string]: string | unknown;
}

export interface ProductAttributes {
  [key: string]: IObject;
}

export interface Dimensions {
  dimensions: string;
  "Length (cm)": number | string;
  "Width (cm)": number | string;
  "Height (cm)": number | string;
  "Volume (m3)": number | string;
  "Weight (kg)": number | string;
}

export interface Review {
  rating: number;
  out_of: number;
  number_of_reviews: number;
}

export interface ChatGPTActions {
  short_description_action: string;
  long_description_action: string;
  product_name_action: string;
  product_tag_action: string;
  product_keyword_action: string;
  alt_description_action: string;
  meta_description_action: string;
}

export interface Price {
  amazon_price_uae: string;
  amazon_discount_uae: string;
  amazon_price: number;
  amazon_discount: number;
  hanooot_price: number;
  hanooot_discount: number;
  commission: number;
  hanooot_price_air: number;
  hanooot_discount_air: number;
  shipping_cost: number;
  shipping_cost_by_air: number;
  discount_percentage: number;
}

export interface Shipping {
  mode: string,
  sea: {
    min: number,
    max: number
  },
  air: {
    min: number,
    max: number
  },
  compareOrderWith: string
}

export interface SEOInfo {
  ASIN: string;
  short_description: LocalizedString;
  long_description: LocalizedString;
  keywords: { en: string[]; ar: string[] };
  product_tag: LocalizedString;
  meta_description: LocalizedString;
  alt_description: LocalizedString;
}

export interface Brand {
  _id: { $oid: string };
  name: LocalizedString;
  logo: string;
  slug: LocalizedString;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

export interface Category {
  name: LocalizedString;
  slug: LocalizedString;
  _id: { $oid: string };
  default?: boolean;
}

export interface BasicInfo {
  name: LocalizedString;
  original_name: LocalizedString;
  original_short_description?: LocalizedString;
  original_long_description?: LocalizedString;
  slug: LocalizedString;
  product_seo: {
    keywords: { en: string[]; ar: string[] };
    product_tag: LocalizedString;
  },
  event?: {
    name: string;
    color: string;
  },
  brand_name: string;
  category_name: string;
  category_slug: string;
  brand: Brand;
  category: Category[];
  group_slug: string,
  parent_slug: string;
  link: string;
  SKU: string;
  ASIN: string;
  source_type: string;
  delivery_time: LocalizedString;
  status: string;
  images_gallery: string[];
  product_images: string[];
  attributes: ProductAttributes;
  default_variant_slug: string;
  reviews: Review;
  price_iqd: Price,
  shipping: Shipping,
  thumbnails:string[],
  createdAt: number;
  updatedAt: number;
}

export interface VariantInfo {
  variants: Variant[];
}
