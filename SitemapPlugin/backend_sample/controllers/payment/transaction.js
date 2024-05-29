import { middlewaresHandler } from "Middlewares/orchestrator";
import sendEmail from "Services/email";
import dynamoDBClient from "Services/dynamodb";
import { EMAIL_CONFIG } from "Constants";
import { getUserName } from "Utilities";
import { success, failure } from "Helpers/response";
import moment from "moment";
import { Logger } from "Helpers/logger";
import Fetch from "Shared/services/fetch";
import S3 from "Services/s3";

const {
  USER_SITES_TABLE,
  PAYMENTS_TABLE,
  SITE_INFO_TABLE,
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_PRIVATE_KEY,
  BRAINTREE_ENVIRONMENT,
  S3_BUCKET
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
    const userEmail = requestBody.userEmail;
    log.push(userEmail)
    const name = requestBody.userName;
    // const token = requestBody.token;
    const transactionId = requestBody.transactionId;
    const subscriptionId = requestBody.subscriptionId;
    const domain = requestBody.domain;
    const type = requestBody.type;
    log.push(["ids>>>>", transactionId, subscriptionId]);
    // writeToLog("init phase passed");

    let { Item } = (await dynamoDBClient("get", {
      TableName: PAYMENTS_TABLE,
      Key: { userId: username, domain: domain },
    })) || { Item: {} };
    let customerID = await Item.braintreeCustomerId;

    let dbResponse = await dynamoDBClient("get", {
      TableName: SITE_INFO_TABLE,
      Key: { domain },
    });
    let gateway = braintree.connect({
      environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
      // Use your own credentials from the sandbox Control Panel here
      merchantId: BRAINTREE_MERCHANT_ID,
      publicKey: BRAINTREE_PUBLIC_KEY,
      privateKey: BRAINTREE_PRIVATE_KEY,
    });
    let transactionpromise = new Promise(async (resolve, reject) => {

      var plans = gateway.plan.all(function(err, result) {
          if (err== null) {
            resolve(result);
          } else {
            reject({ errorType: "reject", data: err });
          }
      });
    });
  
    // wait for braintree transaction
    let returnVal = await transactionpromise;
    // console.log(returnVal)
    returnVal=returnVal.plans
    returnVal = returnVal.filter(plan=>plan.id===Item.plan)
    const diff = Math.abs(new Date(Item.subscriptionDate) - new Date())
    const daysUsed = Math.round(diff/(1000 * 3600 * 24))
    let serviceAmount = 0
    if(returnVal[0].billingFrequency === 12) {
      const perDayUsage = Math.round((returnVal[0].price / 365) * 100)/100
      serviceAmount = Math.round( (daysUsed * perDayUsage) *100 )/100
    } else {
      serviceAmount =Math.round( (( daysUsed * returnVal[0].price)/ (returnVal[0].billingFrequency * 30)) * 100)/100
    }
    const refundAmount = returnVal[0].price - serviceAmount
    let transactionPromise = new Promise(async (resolve, reject) => {
      if (type == "refund") {
        gateway.transaction.refund(transactionId,refundAmount.toString(), async function (err, result) {
          log.push(["transactionsError>>>>>>>>>>>>", result.message]);
          log.push(["transactions>>>>>>>>>>>>", JSON.stringify(result)]);
          let errorMessage = "";
          if (result.message) {
            errorMessage = result.message;
          }
          if (errorMessage == "") {
            let today = new Date();
            let emailResponse = await sendEmail({
              to: userEmail,
              subject: EMAIL_CONFIG.braintreeSubscriptionRefund.subject,
              templateName:
                EMAIL_CONFIG.braintreeSubscriptionRefund.templateName,
              data: {
                name: name,
                domain: domain,
                date: moment(today).format("MMM DD, YYYY"),
                amount:refundAmount
              },
            });
            log.push(["emailResponse", emailResponse]);
            var siteInfoParams = {
              TableName: SITE_INFO_TABLE,
              Key: {
                domain: domain,
              },
              UpdateExpression: "SET #type =:val, #refund = :value",

              ExpressionAttributeNames: {
                "#type": "type",
                "#refund": "refund",
              },
              ExpressionAttributeValues: {
                ":val": "community",
                ":value": "true",
              },
            };
            let storeSitePromise = await dynamoDBClient(
              "update",
              siteInfoParams
            );
          }
          let createCustomerTransaction = gateway.customer.find(
            customerID,
            function (err, customer) {
              if (err == null) {
                // log.push("customer>>>>",customer)
                resolve({
                  customer: customer,
                  message:
                    errorMessage == "" ? "Refund successful." : errorMessage,
                  res: result,
                });
              } else {
                reject({ errorType: "reject", data: err });
              }
            }
          );
        });
      } else {
        gateway.transaction.refund(transactionId,refundAmount.toString(), async function (err, result) {
          log.push("About to cancel the subscription of customer >>>>");
          log.push(["RefundErr>>>>>>>>>>>>", err]);
          log.push(["Refund>>>>>>>>>>>>", result]);

          let cancelErrorMessage = "";
          let refundErrorMessage = "";

          if (result.message) {
            refundErrorMessage = result.message;
          }
          // Refund success
          if (result.success == true) {
            const resp=  await Fetch.wordpress(
              {
                  domain: domain,
                  wpEndpoint: "update_robots",
                  licenseKey:"",
                  method: "POST",
                  body: JSON.stringify({ url: `https://${domain}/sitemap.xml`, subscriptionStatus: 'canceled' })
              }
          );
          if(resp.message === 'File robots.txt doesn\'t exists'){
            await Fetch.wordpress(
              {
                  domain: domain,
                  wpEndpoint: "saveCloudSitemapsMode",
                  licenseKey:"",
                  method: "POST",
                  body: JSON.stringify( {
                    enabled:  false,
                    cloud_index_url: ""
                })
              }
            );
          }
            let today = new Date();
            let refundEmailResponse = await sendEmail({
              to: userEmail,
              subject: EMAIL_CONFIG.braintreeSubscriptionRefund.subject,
              templateName:
                EMAIL_CONFIG.braintreeSubscriptionRefund.templateName,
              data: {
                name: name,
                domain: domain,
                date: moment(today).format("MMM DD, YYYY"),
                amount: refundAmount,
              },
            });
            const { Contents: list } = await S3.performAction("listObjectsV2", {
              Bucket: S3_BUCKET,
              Prefix: `hosts/${domain}/sitemap/`, // delimeter todo
          });
          if (list instanceof Array && list.length) {
              await S3.performAction("deleteObjects", {
                  Bucket: S3_BUCKET,
                  Delete: {
                      Objects: list.map(({ Key }) => ({ Key }))
                  }
              });
          }
            log.push(["refundEmailResponse", refundEmailResponse]);
            var siteInfoParams = {
              TableName: SITE_INFO_TABLE,
              Key: {
                domain: domain,
              },
              UpdateExpression: "SET #type =:val",

              ExpressionAttributeNames: {
                "#type": "type",
              },
              ExpressionAttributeValues: {
                ":val": "community",
              },
            };
            let storeSitePromise = await dynamoDBClient(
              "update",
              siteInfoParams
            );

            if (refundEmailResponse.MessageId) {
              let emailDate =
                dbResponse.Item.emailSent == undefined
                  ? ""
                  : { ...dbResponse.Item.emailSent };

              emailDate =
                emailDate == ""
                  ? { refund: moment().format("YYYY-MM-DD") }
                  : { ...emailDate, refund: moment().format("YYYY-MM-DD") };

              var siteInfoParams = {
                TableName: SITE_INFO_TABLE,
                Key: {
                  domain,
                },
                UpdateExpression: "SET #emailSent =:val",

                ExpressionAttributeNames: {
                  "#emailSent": "emailSent",
                },
                ExpressionAttributeValues: {
                  ":val": emailDate,
                },
              };
              let storeSitePromise = await dynamoDBClient(
                "update",
                siteInfoParams
              );
            }

            //cancel subscription
            let cancelSubscription = gateway.subscription.cancel(
              subscriptionId,
              async function (error, res) {
                log.push(["subscriptionCancelError>>>>>>>>>>>>", error]);
                log.push(["subscriptionCancel>>>>>>>>>>>>", res]);

                if (res.message) {
                  cancelErrorMessage = res.message;
                }
                if (cancelErrorMessage == "") {
                  let today = new Date();
                  let emailResponse = await sendEmail({
                    to: userEmail,
                    subject: EMAIL_CONFIG.braintreeSubscriptionCancel.subject,
                    templateName:
                      EMAIL_CONFIG.braintreeSubscriptionCancel.templateName,
                    data: {
                      name: name,
                      domain: domain,
                      date: moment(today).format("MMM DD, YYYY"),
                    },
                  });
                  log.push(["emailResponse", emailResponse]);
                  var siteInfoParams = {
                    TableName: SITE_INFO_TABLE,
                    Key: {
                      domain: domain,
                    },
                    UpdateExpression: "SET #type =:val, #status = :value",

                    ExpressionAttributeNames: {
                      "#type": "type",
                      "#status": "status",
                    },
                    ExpressionAttributeValues: {
                      ":val": "community",
                      ":value": "Canceled",
                    },
                  };
                  let storeSitePromises = await dynamoDBClient(
                    "update",
                    siteInfoParams
                  );

                  if (emailResponse.MessageId) {
                    let emailDate =
                      dbResponse.Item.emailSent == undefined
                        ? ""
                        : { ...dbResponse.Item.emailSent };

                    emailDate =
                      emailDate == ""
                        ? {
                            subscriptionCanceled: moment().format("YYYY-MM-DD"),
                          }
                        : {
                            ...emailDate,
                            subscriptionCanceled: moment().format("YYYY-MM-DD"),
                          };

                    var siteInfoParams = {
                      TableName: SITE_INFO_TABLE,
                      Key: {
                        domain,
                      },
                      UpdateExpression: "SET #emailSent =:val",

                      ExpressionAttributeNames: {
                        "#emailSent": "emailSent",
                      },
                      ExpressionAttributeValues: {
                        ":val": emailDate,
                      },
                    };
                    let storeSitePromise = await dynamoDBClient(
                      "update",
                      siteInfoParams
                    );

                    let getPaymentPromise = await dynamoDBClient("scan", {
                      TableName: PAYMENTS_TABLE,
                    });

                    let subscription =
                      getPaymentPromise.Items.length > 0 &&
                      getPaymentPromise.Items[0].additionalData !== undefined
                        ? [
                            ...getPaymentPromise.Items[0].additionalData
                              .subscriptionData,
                            JSON.stringify(res.subscription),
                          ]
                        : [JSON.stringify(res.subscription)];

                    //add domain to subscription data
                    let addDomain = JSON.parse(
                      subscription[subscription.length - 1]
                    );
                    addDomain["domain"] = domain;
                    subscription[subscription.length - 1] = JSON.stringify(
                      addDomain
                    );

                    // save to payments table:
                    let storePaymentPromise = await dynamoDBClient("put", {
                      TableName: PAYMENTS_TABLE,
                      Item: {
                        userId: getPaymentPromise.Items[0].userId,
                        domain: getPaymentPromise.Items[0].domain,
                        braintreeCustomerId:
                          getPaymentPromise.Items[0].braintreeCustomerId,
                        paymentMethodToken:
                          getPaymentPromise.Items[0].paymentMethodToken,
                        additionalData: { subscriptionData: subscription },
                      },
                    });
                  }
                  await Fetch.wordpress(
                    {
                        domain: domain,
                        wpEndpoint: "saveCloudSitemapsMode",
                        licenseKey:"",
                        method: "POST",
                        body: JSON.stringify( {
                          enabled:  false,
                          cloud_index_url: ""
                      })
                    }
                );
                  
                }
              }
            );
            // Return data
            let createCustomerTransaction = gateway.customer.find(
              customerID,
              function (err, customer) {
                if (err == null) {
                  // log.push("customer>>>>",customer)
                  resolve({
                    customer: customer,
                    message:
                      refundErrorMessage == "" && cancelErrorMessage == ""
                        ? "Refund successful.\nSubscription cancellation successful."
                        : refundErrorMessage !== "" && cancelErrorMessage == ""
                        ? `Error:\n${refundErrorMessage}\nPlease try again later.`
                        : refundErrorMessage == "" && cancelErrorMessage !== ""
                        ? `Refund successful.\n${cancelErrorMessage}`
                        : `${refundErrorMessage}\n${cancelErrorMessage}`,
                    res: result,
                  });
                } else {
                  reject({ errorType: "reject", data: err });
                }
              }
            );
          } else {
            reject({ errorType: "reject", data: result });
          }
        });

      }
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

    return failure(
      { status: 0, message: "An error occurred.", data: { e } },
      500
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
    settings: { schema: generateTokenSchema },
  });