import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { ProductController } from '../../controllers/ProductController';

const controller: ProductController = new ProductController();
const deleteProduct = controller.deleteProduct;

export const lambdaHandler = middy(deleteProduct)
    .use(middyJsonBodyParser())
    .use(httpErrorHandler());