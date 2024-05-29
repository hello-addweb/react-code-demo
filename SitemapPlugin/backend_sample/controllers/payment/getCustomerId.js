import { middlewaresHandler } from "Middlewares/orchestrator";
import dynamoDBClient from "Services/dynamodb";
import { getUserName } from "Utilities";
import { Logger } from "Helpers/logger";

const { PAYMENTS_TABLE } = process.env;

const settings = {};

const handler = async ({ event }) => {
    // return { "data": w3logger(JSON.stringify(event))};
    const log = new Logger()
    const username = getUserName( event );
    log.push('Request')
    log.separator()
    log.push(event)
    log.separator()
    const domain = event.queryStringParameters.domain
    let { Item } = await dynamoDBClient( "get", {
        TableName: PAYMENTS_TABLE,
        Key : {  "userId": username, "domain":domain}
    } ) || { Item: {} };
    log.push
    log.push(["user>>>>>>>>>>>>>",Item])
    log.print()
    return { data:Item,event };
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async event => middlewaresHandler({ event, handler, settings });
