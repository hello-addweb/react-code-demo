import { middlewaresHandler } from "Middlewares/orchestrator";
import dynamoDBClient from "Services/dynamodb";
import { success, failure } from "Helpers/response";
import { Logger } from "Helpers/logger";
const {
  PAYMENTS_TABLE,
} = process.env;

const theSchema = {
  id: "getPaymentInfo",
  type: "object",
  properties: {
    userId: { type: "string", maxLength: 255 },
  },
  required: ["userId"],
};

const handler = async (req) => {
  const log = new Logger()
  try {
    let {Item} = (await dynamoDBClient("get", {
      TableName: PAYMENTS_TABLE,
      Key: req.event.queryStringParameters,
    })) || { Item: {} };
    return success({ status: 1, message: "Success!", data: Item }, 200, {
      "Access-Control-Allow-Origin": "*",
    });
  } catch (generalError) {
    log.push("ERROR DETAILS:");
    log.separator()
    log.push(generalError);

    return failure(
      { status: 0, message: "An error occurred.", data: {} },
      500,
      {
        "Access-Control-Allow-Origin": "*",
      }
    );
  } finally {
    log.print()
  }
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async (event) =>
  middlewaresHandler({
    event,
    handler,
    settings: { schema: theSchema },
  });
