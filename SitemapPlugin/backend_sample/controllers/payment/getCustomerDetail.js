import { middlewaresHandler } from "Middlewares/orchestrator";
import { success } from "Helpers/response";
import dynamoDBClient from "Services/dynamodb";
import { getUserName, getUserEmail } from "Utilities";
import { Logger } from "Helpers/logger";

const {
  PAYMENTS_TABLE,
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_PRIVATE_KEY,
  BRAINTREE_ENVIRONMENT,
} = process.env;
const settings = {};

const handler = async ({ event }) => {
  // return { "data": console.log(JSON.stringify(event))};
  const log = new Logger();
  try {
    let braintree = require("braintree");
    const username = getUserName(event);
    const email = getUserEmail(event);
    log.push('Request')
    log.separator()
    log.push(JSON.stringify(event))
    log.push('Info logs')
    log.separator()
    log.push(email);
    // const username = "localtestuser"
    const domain = event.queryStringParameters.domain;
    let { Item } = (await dynamoDBClient("get", {
      TableName: PAYMENTS_TABLE,
      Key: { userId: username, domain: domain },
    })) || { Item: {} };

    // writeToLog("init phase passed");

    let gateway = braintree.connect({
      environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
      // Use your own credentials from the sandbox Control Panel here
      merchantId: BRAINTREE_MERCHANT_ID,
      publicKey: BRAINTREE_PUBLIC_KEY,
      privateKey: BRAINTREE_PRIVATE_KEY,
    });

    let transactionPromise = new Promise(async (resolve, reject) => {
      if (Item == undefined || Item.braintreeCustomerId == undefined) {
        reject({ errorType: "reject", data: "Braintree Id not found" });
      } else {
        let createCustomerTransaction = gateway.customer.find(
          Item.braintreeCustomerId,
          function (err, customer) {
            if (err == null) {
              resolve(customer);
            } else {
              reject({ errorType: "reject", data: err });
            }
          }
        );
      }
    });

    // wait for braintree transaction
    let retVal = await transactionPromise;
    log.push('Response')
    log.separator()
    log.push(JSON.stringify(retVal))
    // return { data: retVal };
    return success({ status: 1, message: "Success!", data: retVal }, 200, {
      "Access-Control-Allow-Origin": "*",
    });
  } catch (e) {
    log.push(["error", e]);
    log.separator()
    return success({ status: 0, message: e.data, data: {} }, 200);
  } finally {
    log.print();
  }
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async (event) =>
  middlewaresHandler({ event, handler, settings });
