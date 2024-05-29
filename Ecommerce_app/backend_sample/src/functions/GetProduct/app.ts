import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { ProductController } from '../../controllers/ProductController';

const controller: ProductController = new ProductController();
const getProduct = controller.getProduct;

export const lambdaHandler = middy(getProduct)
    .use(middyJsonBodyParser())
    .use(httpErrorHandler());