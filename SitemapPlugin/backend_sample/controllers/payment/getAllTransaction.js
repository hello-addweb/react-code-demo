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

const handler = async (event) => {
  // return { "data": log.push(JSON.stringify(event))};
  const log = new Logger();
  try {
    log.push('Request')
    log.separator()

    log.push( JSON.stringify(event));
    log.separator()
    log.push('Info logs')
    log.separator()

    let braintree = require("braintree");
    const username = getUserName(event);
    const email = getUserEmail(event);
    log.push(email);
    const reqBody = JSON.parse(event.body);
    // const username = reqBody.userId
    // const username = "localtestuser"
    //   const domain = event.queryStringParameters.domain
    const domain = reqBody.domain;
    // log.push(domain)
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

    const stream = new Promise(async (resolve, reject) => {
      gateway.customer.search(
        (search) => {
          search.id().is(Item.braintreeCustomerId);
        },
        async (err, response) => {
          if (err) reject(err);
          else {
            response.each(async (err, sub) => {
              resolve(sub);
            });
          }
        }
      );
    });

    // wait for braintree transaction
    let retVal = await stream;
    const transactions = [];
    retVal.paymentMethods[0].subscriptions.filter((item) => item.transactions);
    for (let i = 0; i < retVal.paymentMethods[0].subscriptions.length; i++) {
      retVal.paymentMethods[0].subscriptions[i].transactions.map((tra) =>
        transactions.push(tra)
      );
    }
    // return { data: retVal };
    log.push('Response')
    log.separator()
    log.push(JSON.stringify(transactions))
    return success(
      { status: 1, message: "Success!", data: transactions },
      200,
      {
        "Access-Control-Allow-Origin": "*",
      }
    );
  } catch (e) {
    log.push(["error", e]);
    log.separator()
    return success({ status: 0, message: e.data, data: {} }, 200);
  } finally {
    log.print()
  }
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async (event) => handler(event);

// export const lambda = async (event) =>
//   middlewaresHandler({ event, handler, settings });
