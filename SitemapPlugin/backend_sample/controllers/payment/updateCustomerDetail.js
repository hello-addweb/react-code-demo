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
  BRAINTREE_PRIVATE_KEY,
  BRAINTREE_ENVIRONMENT,
} = process.env;

const log = new Logger()
export const generateTokenSchema = {
  id: "generateTokenSchema",
  type: "object",
  // properties: {
  //     customerID: { type: "string", maxLength: 255 },
  // },
  // required: [ "customerID" ]
};

/***
 * Get user's first name, last name, etc...
 * @param userId
 * @returns {Promise<void>}
 * @private
 */
const _getUserDetails = async (userId) => {
  let { Item } = (await dynamoDBClient("get", {
    TableName: USER_SITES_TABLE,
    Key: { userId },
  })) || { Item: {} };
  return Item;
};

const handler = async (req) => {
  let logHeader = "subscribe.js";

  try {
    let braintree = require("braintree");
    const { IS_OFFLINE: isOffline } = process.env;
    const requestBody = req.event.body;

    log.push('Request')
    log.separator()
    log.push(JSON.stringify(req))
    log.separator()
    log.push('Info logs')
    log.separator()
    const username = getUserName(req.event);
    const userEmail = getUserEmail(req.event);
    log.push(userEmail)
    const token = requestBody.token;
    const paymentMethodNonceFromJs = requestBody.paymentMethodNonce;
    const domain = requestBody.domain;
    const data = requestBody.formData;

    // writeToLog("init phase passed");

    let { Item } = (await dynamoDBClient("get", {
      TableName: PAYMENTS_TABLE,
      Key: { userId: username },
    })) || { Item: {} };
    let customerID = await Item.braintreeCustomerId;
    let gateway = braintree.connect({
      environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
      // Use your own credentials from the sandbox Control Panel here
      merchantId: BRAINTREE_MERCHANT_ID,
      publicKey: BRAINTREE_PUBLIC_KEY,
      privateKey: BRAINTREE_PRIVATE_KEY,
    });
    let transactionPromise = new Promise(async (resolve, reject) => {
      const nonceFromTheClient = paymentMethodNonceFromJs;
      gateway.address.update(
        customerID,
        token,
        {
          firstName: data.first_name,
          lastName: data.last_name,
          company: "Braintree",
          streetAddress: data.address,
          extendedAddress: "Suite 403",
          locality: data.city,
          region: data.state,
          postalCode: data.zip_code,
          // countryName: data.country
          countryCodeAlpha2: data.country,
        },
        function (err, response) {
          gateway.customer.update(customerID, {
            firstName: data.first_name,
            lastName: data.last_name,
            email:data.email
          }, function (err, result) {
            
            if (response.success != true) {
              reject({ errorType: "reject", data: err });
            } else {
              let createCustomerTransaction = gateway.customer.find(
                customerID,
                function (err, customer) {
                  if (customer !== null) {
                    resolve(customer);
                  } else {
                    reject({ errorType: "reject", data: err });
                  }
                }
              );
            }
          
          });
         
        }
      );
    });

    // wait for braintree transaction
    let retVal = await transactionPromise;
    log.push('Response')
    log.separator()
    log.push(JSON.stringify(retVal))
    return success({ status: 1, message: "Success!", data: retVal }, 200);
  } catch (e) {
    log.push([logHeader, "Error in main try catch block. Details: "]);
    log.push([logHeader, e]);
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
