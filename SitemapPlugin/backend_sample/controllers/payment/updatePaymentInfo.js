import { middlewaresHandler } from "Middlewares/orchestrator";
import dynamoDBClient from "Services/dynamodb";
import { success, failure } from "Helpers/response";
import { Logger } from "Helpers/logger";

const theSchema = {
    id: "updatePaymentInfoSchema",
    type: "object",
    properties: {
        userId: { type: "string", maxLength: 255 }
    },
    required: [ "userId" ]
};
const log = new Logger()
/***
 * This is the starting endpoint for full xml sitemap generation in cloud.
 * This function starts the regeneration of all individual sitemap units. A call to buildSitemapIndex is required after all items were processed.
 * @param req
 * @returns {Promise<*>}
 */
const handler = async ( req ) => {
    try {
        let braintree = require( "braintree" );
        const { IS_OFFLINE: isOffline } = process.env;

        const requestBody = req.event.body;
        log.push('Request')
        log.separator()
        log.push(JSON.stringify(req))
        log.separator()
        log.push('Info logs')
        log.separator()
        let  Item  = await dynamoDBClient( "put", {
            TableName: "payments-dev",
            Item: requestBody
        } ) || { Item: {} };
        
        log.push('Response')
        log.separator()
        log.push(Item)
        return success( { status: 1, message: "Success!", data: Item }, 200, {
            "Access-Control-Allow-Origin": "*"
        } );
    } catch (generalError) {
        log.push( "ERROR DETAILS:" );
        log.push( generalError );

        return failure( { status: 0, "message": "An error occurred.", data: {} }, 500, {
            "Access-Control-Allow-Origin": "*"
        } );
    } finally {
        log.print()
    }
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async event => middlewaresHandler( {
    event,
    handler,
    updateInfo: { schema: theSchema }
} );
