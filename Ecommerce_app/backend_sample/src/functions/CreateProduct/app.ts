import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { ProductController } from '../../controllers/ProductController';

const controller: ProductController = new ProductController();
const createProduct = controller.createProduct;

export const lambdaHandler = middy(createProduct)
    .use(middyJsonBodyParser())
    .use(httpErrorHandler());