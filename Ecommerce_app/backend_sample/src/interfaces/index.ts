export * from './IElasticProduct';
export * from './IElasticCategory';
export * from './IElasticBrand';
export interface IBrand<T>{
    create(payload: any, db: any): Promise<T[]>;
}

export interface ICategory<T>{
    create(payload: any, db: any): Promise<T[]>;
}

export interface IProduct<T>{
    create(payload: any, db: any): Promise<T[]>;
}

export interface IFinancialSettings<T>{
    findByCurrency(currency: string, db: any): Promise<T[]>;
}

export interface IFeaturedCategoryBrand<T>{
    findAll(id: string, db: any): Promise<T[]>;
}

export interface IHomePageSettings<T>{
    findAll(id: string, db: any): Promise<T[]>;
}

export interface ICart<T>{
    find(id: string, db: any): Promise<T[]>;
}

export interface IAdminBrand<T>{
    findAll(id: string, db: any): Promise<T[]>;
}

export interface ITopPicks<T>{
    findAll(id: string, db: any): Promise<T[]>;
}

export interface IScroller<T>{
    find(id: string, db: any): Promise<T[]>;
}

export interface IBanner<T>{
    findAll(id: string, db: any): Promise<T[]>;
}

export interface ICategoryList<T>{
    findAll(id: string, db: any): Promise<T[]>;
}

export interface ICronDetails<T>{
    findByName(name: string, db: any): Promise<T[]>;
}

export interface DeepLinkRequest {
    link: string;
    createdAt?: number;
    updatedAt?: number;
    criteria?: {
        searchText?: string;
        filters?: Array<{ [key: string]: string }>;
        sortBy?: {
            [key: string]: string;
        };
    };
}

export interface Variant {
    name: { en: string; ar: string };
    parent_slug: string;
    brand_name: string;
    category_name: string;
    link: string;
    SKU: string;
    ASIN: string;
    status: string;
    images_gallery: Array<string> [];
    product_images: Array<string> [];
    attributes: any;
    default_variant_slug: string;
    reviews: any;
    price: any;
    chatgpt_actions?: any;
    product_seo: any,
    variants?: any,
    slug?: any,
    objectID?: any,
    createdAt?: number,
    updatedAt?: number,
    type?: string
}

export interface Product {
    _id?: string ;
    original_name: { en: string; ar: string };
    name: { en: string; ar: string };
    slug: { en: string; ar: string };
    brand_name: string;
    category_name: string;
    link: string;
    SKU: string;
    ASIN: string;
    source_type: string;
    original_short_description: { en: string; ar: string };
    original_long_description: { en: string; ar: string };
    delivery_time: { en: string; ar: string };
    status: string;
    images_gallery: Array<string> [];
    product_images: Array<string> [];
    attributes: any;
    default_variant_slug: string;
    reviews: any;
    price: any;
    product_seo: any;
    chatgpt_actions?: any;
    variants: Variant[];
}

export interface IEvent<T>{
    create(payload: any, db: any): Promise<T[]>;

}

export interface ICheckSKUOrASIN<T>{
    checkSKUOrASIN(payload: any, db: any): Promise<T[]>;
}

export interface FilterValue {
    key:string;
    itemCounts?:number;
    value:string | number
}

export interface FilterObject {
    label: string;
    type: string;
    key: string;
    filterType: string;
    values: FilterValue[];
}