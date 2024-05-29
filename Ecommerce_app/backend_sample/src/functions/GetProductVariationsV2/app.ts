import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { ProductController } from '../../controllers/ProductController';

const controller: ProductController = new ProductController();
const getProductVariationsV2 = controller.getProductVariationsV2;

export const lambdaHandler = middy(getProductVariationsV2)
    .use(middyJsonBodyParser())
    .use(httpErrorHandler());