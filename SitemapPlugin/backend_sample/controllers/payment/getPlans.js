import { middlewaresHandler } from "Middlewares/orchestrator";
import { success, failure } from "Helpers/response";
import { Logger } from "Helpers/logger";

const {
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_PRIVATE_KEY,
  BRAINTREE_ENVIRONMENT
} = process.env;
const settings = {};

const handler = async ({ event }) => {
  // return { "data": w3logger(JSON.stringify(event))};
  const log = new Logger()
  try{
  let braintree = require("braintree");
  let gateway = braintree.connect({
    environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
    // Use your own credentials from the sandbox Control Panel here
    merchantId: BRAINTREE_MERCHANT_ID,
    publicKey: BRAINTREE_PUBLIC_KEY,
    privateKey: BRAINTREE_PRIVATE_KEY,
  });

  let transactionPromise = new Promise(async (resolve, reject) => {

    var plans = gateway.plan.all(function(err, result) {
        if (err== null) {
          resolve(result);
        } else {
          reject({ errorType: "reject", data: err });
        }
    });
  });

  // wait for braintree transaction
  let retVal = await transactionPromise;

  // return { data: retVal };
  return success({ status: 1, message: "Success!", data: retVal }, 200, {
    "Access-Control-Allow-Origin": "*",
  });
} catch (e) {
 
  log.push(["getplan",e])
  log.separator()
  return failure({ status: 0, message: "An error occurred.", data: {} }, 500);
} finally{
  log.print()
}
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async (event) =>
  middlewaresHandler({ event, handler, settings });
