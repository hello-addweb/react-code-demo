import { middlewaresHandler } from "Middlewares/orchestrator";
import dynamoDBClient from "Services/dynamodb";
import { getUserEmail, getUserName } from "Utilities";
import { success, failure } from "Helpers/response";
import { Logger } from "Helpers/logger";

const {
  STAGE,
  USER_SITES_TABLE,
  PAYMENTS_TABLE,
  SITE_INFO_TABLE,
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_ENVIRONMENT,
  BRAINTREE_PRIVATE_KEY,
} = process.env;

export const generateTokenSchema = {};

/***
 * Get user's first name, last name, etc...
 * @param userId
 * @returns {Promise<void>}
 * @private
 */
const _getUserDetails = async (userId) => {
  let { Item } = (await dynamoDBClient("get", {
    TableName: PAYMENTS_TABLE,
    Key: { userId },
  })) || { Item: {} };
  return Item;
};

const handler = async (req) => {
  // let logHeader = "subscribe.js";

  const log = new Logger()
  try {
    let braintree = require("braintree");
    const { IS_OFFLINE: isOffline } = process.env;

    const username = getUserName(req.event);
    const userEmail = getUserEmail(req.event);
    const domain = req.event.body.domain
    log.push('Reqeust')
    log.separator()
    log.push(JSON.stringify(req))
    log.separator()
    log.push('Info logs')
    log.separator()
    log.push(userEmail)
    // writeToLog("init phase passed");

    let gateway = braintree.connect({
      environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
      // Use your own credentials from the sandbox Control Panel here
      merchantId: BRAINTREE_MERCHANT_ID,
      publicKey: BRAINTREE_PUBLIC_KEY,
      privateKey: BRAINTREE_PRIVATE_KEY,
    });

    let customerID = ''
    try {
      let { Item } = (await dynamoDBClient("get", {
        TableName: PAYMENTS_TABLE,
        Key: { userId: username, domain:domain },
      })) || { Item: {} };

      customerID =
      (await Item) !== undefined && Item.braintreeCustomerId !== undefined
        ? Item.braintreeCustomerId
        : "";

    } catch(e) {
      log.push(['error', e])
    }

    let transactionPromise = new Promise(async (resolve, reject) => {
      let createCustomerTransaction = gateway.clientToken.generate(
        {
          customerId: customerID,
        },
        function (err, response) {
          if (response.success != true) {
            reject({ errorType: "reject", data: err });
          } else {
            resolve({ clientToken: response.clientToken });
          }
        }
      );
    });

    // wait for braintree transaction
    let retVal = await transactionPromise;
    let Id = customerID == "" ? false : true;
    log.push('Response')
    log.separator()
    log.push(retVal)
    return success(
      {
        status: 1,
        message: "Success!",
        data: { Token: retVal.clientToken, ID: Id },
      },
      200
    );
  } catch (e) {
    // writeToLog(logHeader, "Error in main try catch block. Details: ");
    // writeToLog(logHeader, e);
    log.push(["generateToken err",e]);
    log.separator()
    return failure({ status: 0, message: "An error occurred.", data: {} }, 500);
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
    settings: { schema: generateTokenSchema },
  });
