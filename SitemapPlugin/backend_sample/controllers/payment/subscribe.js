import { middlewaresHandler } from "Middlewares/orchestrator";
import sendEmail from "Services/email";
import dynamoDBClient from "Services/dynamodb";
import { EMAIL_CONFIG } from "Constants";
import { getUserEmail, getUserName } from "Utilities";
import { success, failure } from "Helpers/response";
import { getSingleStandardSetting, } from "Core/core-site-settings-standard";
import { Logger } from "Helpers/logger";

import moment from 'moment'
const requestIp = require('request-ip');

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
export const subscribeSchema = {
    id: "SubscribeSchema",
    type: "object",
    properties: {
        paymentMethodNonce: { type: "string", maxLength: 255 },
        domain: { type: "string", maxLength: 255 },
    },
    // required: [ "paymentMethodNonce", "domain" ]
};

/***
 * Get user's first name, last name, etc...
 * @param userId
 * @returns {Promise<void>}
 * @private
 */
const _getUserDetails = async ( userId ) => {
    let { Item } = ( await dynamoDBClient( "get", {
        TableName: USER_SITES_TABLE,
        Key: { userId },
    } ) ) || { Item: {} };
    return Item;
};

const handler = async ( req ) => {
    let logHeader = "subscribe.js";

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

        const username = getUserName( req.event );
        const userEmail = getUserEmail( req.event );
        log.push(userEmail)
        const paymentMethodNonceFromJs = requestBody.paymentMethodNonce;
        const domain = requestBody.domain;
        const data = requestBody.formData;
        const privacy = data.isAcceptPrivacy;
        const terms = data.isAcceptTerms;
        const marketing = data.isMarketing;
        const planId = requestBody.planId

        const ipAddress = requestIp.getClientIp(req.event);
        let paymentMethodToken = "";

        let dbResponse = await dynamoDBClient( "get", {
            TableName: SITE_INFO_TABLE,
            Key: { domain },
        } );

        log.push( "username:" );
        log.push( username );
        log.push(["userDomain",domain]);

        log.push( "dbResponse:" );
        log.push( dbResponse );

        let existingDbResponse = dbResponse;

        let existingItem = undefined;

        let { Item } =  await dynamoDBClient( "get", {
                TableName: PAYMENTS_TABLE,
                Key: { userId: username, domain: domain, },
            } )  || { Item: {} };

        existingItem = Item;
        log.push("existingItem:");
        log.push(existingItem);

        // **** EITHER FIND AN EXISTING CUSTOMER OR CREATE A NEW ONE:
        let resultCustomer = null;
        log.push("check path!");

        let gateway = braintree.connect( {
            environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
            // Use your own credentials from the sandbox Control Panel here
            merchantId: BRAINTREE_MERCHANT_ID,
            publicKey: BRAINTREE_PUBLIC_KEY,
            privateKey: BRAINTREE_PRIVATE_KEY,
        } );

        let paymentFailure = undefined;

        if ( typeof existingItem ==='object' && typeof existingItem !== 'undefined' && existingItem !== undefined && existingItem.braintreeCustomerId !== undefined ) {
            log.push("Looking for existing customer")
            const nonceFromTheClient = paymentMethodNonceFromJs;

            log.push("after braintree connect 1");

            let transactionPromise = new Promise( async ( resolve, reject ) => {
                log.push("entered search customer promise");

                gateway.customer.find(
                    existingItem.braintreeCustomerId,
                    function ( err, customer ) {
                        if ( err ) {
                            reject( { errorType: "reject", data: err } );
                        } else {

                            // todo:
                            // try to find an existing method if possible:
                            gateway.paymentMethod.create(
                                {
                                    customerId: existingItem.braintreeCustomerId,
                                    paymentMethodNonce: nonceFromTheClient,
                                    billingAddress: {
                                        firstName: data.first_name,
                                        // lastName: data.last_name,
                                        company: data.companyName,
                                        streetAddress: data.streetAddress,
                                        locality: data.locality,
                                        region: data.region,
                                        // postalCode: data.zip_code,
                                        // countryCodeAlpha2: data.countryCode,
                                        countryName:data.country
                                    },
                                },
                                function ( err, response ) {
                                    if ( response !== null ) {
                                        resolve( customer );
                                    } else {
                                        console.log("error",err)
                                        reject( { errorType: "reject", data: err } );
                                    }
                                }
                            );
                        }
                    }
                );
            } );

            // wait for braintree transaction
            resultCustomer = await transactionPromise;
            //return success({ status: 1, message: "Success!", data: retVal }, 200);
        } else {
            log.push( "init phase passed" );

            if ( !dbResponse.Item ) {
                throw new Error( "Site info cannot be found" );
            }
            if ( !dbResponse.Item.userId || dbResponse.Item.userId !== username ) {
                console.error("Error - No access to the selected domain" );
                // this should be disabled only for local dev testing:
                throw new Error("No access to the selected domain.");
            }

            log.push( "Braintree connect passed" );

            let transactionPromise = new Promise( async ( resolve, reject ) => {
                // Use the payment method nonce here
                const nonceFromTheClient = paymentMethodNonceFromJs;
                // Create a new subscription:

                // let userDetails = ( await _getUserDetails( username ) ) || {};
                log.push("Entered transaction promise" );

                gateway.customer.create(
                    {
                        firstName: data.first_name,
                        // lastName: data.last_name,
                        company: data.companyName,
                        email: data.email,
                        phone: data.phoneNumber,
                        fax: "614.555.5678",
                        website: domain,
                        paymentMethodNonce: nonceFromTheClient,

                        creditCard: {
                            billingAddress: {
                                firstName: data.first_name,
                                // lastName: data.last_name,
                                company: data.companyName,
                                streetAddress: data.streetAddress,
                                locality: data.locality,
                                region: data.region,
                                // postalCode: data.zip_code,
                                // countryCodeAlpha2: data.countryCode,
                                countryName:data.country
                            },
                        },
                    },
                    function ( err, resultCustomer ) {
                        if ( err ) {
                            console.log('error',err)
                            reject( err );
                        } else {
                            resolve( resultCustomer.customer );
                        }
                    }
                );
            } );

            // wait for braintree transaction
            resultCustomer = await transactionPromise;
            log.push("After await transactionPromise");
            //return success({ status: 1, message: "Success!", data: retVal }, 200);
        }

        log.push("resultCustomer:");
        log.push(resultCustomer);
        log.push(['existingItem>>>>>',JSON.stringify(existingItem)])
        
        // *** AFTER THE CUSTOMER IS EITHER FOUND OR CREATED:
        let subscribePromise = new Promise(  async ( resolve, reject ) => {
            if ( !resultCustomer || !resultCustomer.id ) {
                reject( "Customer not found" );
            } else {
                log.push("inside subscribePromise");

                // to do, final the most recent payment method:

                paymentMethodToken =
                    resultCustomer.paymentMethods[ 0 ].token;

                log.push("paymentMethodToken is:");
                log.push(paymentMethodToken);

                let subscribeTransaction = 
                dbResponse.Item!==undefined && dbResponse.Item.braintreeSubscriptionId!==undefined && dbResponse.Item.status!==undefined && dbResponse.Item.status!=="Canceled" ?

                gateway.subscription.update(dbResponse.Item.braintreeSubscriptionId, {
                    paymentMethodToken,
                    planId: planId,
                  }, async function (error, resultSubscribe) {
                    log.push("Existing Id - Got response from Braintree - for update subscription");

                    if ( resultSubscribe ) {
                        resolve( {
                            resultCustomer,
                            resultSubscribe
                        } );
                    } else {
                        paymentFailure=await "subscriptionRenewalFail"
                            let emailResponse = await sendEmail( {
                                to: data.email,
                                subject: EMAIL_CONFIG.braintreeSubscriptionUpdateFailure.subject,
                                templateName: EMAIL_CONFIG.braintreeSubscriptionFailure.templateName,
                                data:{data:"subscription renewal",notice:''} 
                            } );
                            log.push(["email response",emailResponse])

                            if(emailResponse.MessageId){
                                let emailDate =  dbResponse.Item.emailSent == undefined ? '' : {...dbResponse.Item.emailSent}
                    
                                emailDate = emailDate=="" ?
                                {"subscriptionRenewalFailed":moment().format("YYYY-MM-DD")} 
                                : {...emailDate,"subscriptionRenewalFailed":moment().format("YYYY-MM-DD")}

                                var siteInfoParams = {
                                    TableName: SITE_INFO_TABLE,
                                    Key: {
                                        domain,
                                    },
                                    UpdateExpression: 'SET #emailSent =:val',
                        
                                    ExpressionAttributeNames: {
                                        '#emailSent': 'emailSent'
                                    },
                                    ExpressionAttributeValues: { 
                                        ':val':emailDate
                                    },
                                };
                                let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );

                            }
                        
                        reject( error );
                        
                    }
                  })

                :
                
                gateway.subscription.create(
                    {
                        paymentMethodToken,
                        planId: planId,
                    },
                  async function ( error, resultSubscribe ) {
                        log.push("Got response from Braintree - for create subscription");
                        log.push(error);
                        log.push(resultSubscribe);

                        if ( resultSubscribe ) {
                            resolve( {
                                resultCustomer,
                                resultSubscribe
                            } );
                        } else {
                            paymentFailure= await 'subscriptionFail'
                            var siteInfoParams = {
                                TableName: SITE_INFO_TABLE,
                                Key: {
                                    domain,
                                },
                                UpdateExpression: 'SET #type =:val',
                    
                                ExpressionAttributeNames: {
                                     '#type': 'type'
                                },
                                ExpressionAttributeValues: { 
                                   ':val': "community"
                                },
                            };
                            let storeSitePromises = await dynamoDBClient( "update", siteInfoParams );
                            let emailResponse = await sendEmail( {
                                to: data.email,
                                subject: EMAIL_CONFIG.braintreeSubscriptionFailure.subject,
                                templateName: EMAIL_CONFIG.braintreeSubscriptionFailure.templateName,
                                data: {data:"subscription",notice:''}
                            } );
                            log.push(["email response",emailResponse])

                            if(emailResponse.MessageId){
                                let emailDate = dbResponse.Item.emailSent == undefined ? '' : {...dbResponse.Item.emailSent}
                    
                                emailDate = emailDate=="" ?
                                {"subscriptionFailed":moment().format("YYYY-MM-DD")} 
                                : {...emailDate,"subscriptionFailed":moment().format("YYYY-MM-DD")}

                                var siteInfoParams = {
                                    TableName: SITE_INFO_TABLE,
                                    Key: {
                                        domain,
                                    },
                                    UpdateExpression: 'SET #emailSent =:val',
                        
                                    ExpressionAttributeNames: {
                                        '#emailSent': 'emailSent'
                                    },
                                    ExpressionAttributeValues: { 
                                        ':val':emailDate
                                    },
                                };
                                let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );

                            }
                            reject( error );
                        }
                    }
                );
            }
        } );
        log.push("before retVal");
        const retVal = await subscribePromise; // not await subscribePromise() - immediate code execution otherwise!
        log.push("after retVal");
        log.push(retVal);

        // retVal.resultCustomer, retVal.resultSubscribe
        let braintreeCustomerId = retVal.resultCustomer.id;
        let braintreeSubscriptionId = retVal.resultSubscribe.subscription.id;

        // save subscription id:
        var updateParams = {
            TableName: SITE_INFO_TABLE,
            Key: {
                domain,
            },
            UpdateExpression:
                "set braintreeSubscriptionId = :braintreeSubscriptionId",
            ExpressionAttributeValues: {
                ":braintreeSubscriptionId": braintreeSubscriptionId,
            },
            ReturnValues: "UPDATED_NEW",
        };

        log.push("before  storePromise");

        let storePromise = await dynamoDBClient( "update", updateParams );
        log.push(["DBinfo",dbResponse])
        log.push(["DBinfoID",braintreeCustomerId])
        if(dbResponse.Item!==undefined && braintreeCustomerId!=='' && braintreeSubscriptionId!=='' && braintreeSubscriptionId!=undefined && paymentFailure==undefined){
            log.push("storeSitePromise")
            var siteInfoParams = {
                TableName: SITE_INFO_TABLE,
                Key: {
                    domain,
                },
                UpdateExpression: 'SET #type =:val, #status = :value, #subscriptionDate = :subscriptionValue, #name = :nameValue',
    
                ExpressionAttributeNames: {
                     '#type': 'type',
                     '#status': 'status',
                     '#subscriptionDate': 'subscriptionDate',
                     '#name': 'name',
                    //  '#transactionId':'transactionId'
                },
                ExpressionAttributeValues: { 
                   ':val': "premium",
                   ':value': 'Active',
                   ':subscriptionValue': moment().format("YYYY-MM-DD"),
                   ':nameValue':data.first_name,
                //    ':transactionValue': retVal.resultSubscribe.subscription.transactions[0].id
                },
            };
            let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );
            log.push(['storeSitePromise>>>',storeSitePromise])
        }
        log.push("after storePRomise");
        // log.push("subscriptiondatainformtaion>>>>>",retVal.resultSubscribe.subscription)
        let subscribeData =retVal.resultSubscribe.subscription
        let getPaymentPromise1 = await dynamoDBClient( "scan", {
            TableName: PAYMENTS_TABLE,
        } );
        let getPaymentPromise = await dynamoDBClient( "get", {
            TableName: PAYMENTS_TABLE,
            Key: { userId: username, domain: domain },
        } );

        log.push([">>>>GeT>>>>",getPaymentPromise1,JSON.stringify(subscribeData)])
        let subscription = getPaymentPromise.Item && getPaymentPromise.Item.additionalData!==undefined ? [...getPaymentPromise.Item.additionalData.subscriptionData,JSON.stringify(subscribeData)] : [JSON.stringify(subscribeData)];
       
        //add domain to subscription data
        let addDomain =  JSON.parse(subscription[subscription.length-1]);
        addDomain["domain"]=domain;
        subscription[subscription.length-1]=JSON.stringify(addDomain);
        const indexName = await getSingleStandardSetting(username,domain,'sm_b_sitemap_name');
        log.push(indexName);
        const indexFileName = indexName ? indexName : "index";

        const s3RootUrl = "https://1-sitemap-bucket.s3.us-east-2.amazonaws.com/hosts/" + domain + "/sitemap/" + indexFileName + ".xml";
        // save to payments table:
        if ( existingItem === undefined || existingItem.braintreeCustomerId === undefined ) {
            let subscriptionData = [subscribeData];
            let storePaymentPromise = await dynamoDBClient( "put", {
                TableName: PAYMENTS_TABLE,
                Item: {
                    userId: username,
                    braintreeCustomerId,
                    paymentMethodToken,
                    additionalData :{ subscriptionData },
                    domain: domain,
                    privacy: privacy,
                    terms: terms,
                    marketing: marketing,
                    trialPeriod: true,
                    subscriptionDate: moment().format("YYYY-MM-DD"),
                    subscription_id: braintreeSubscriptionId,
                    s3RootUrl: s3RootUrl,
                    plan: planId,
                    transactionStatus:"submitted_for_settlement",
                    ipAddress:ipAddress
                },
            });
        }else{
            let subscriptionData = existingItem.additionalData.subscriptionData;
            log.push(["subscriptionData",JSON.stringify(subscriptionData)]);
            subscriptionData.push(subscribeData);
            let storePaymentPromise = await dynamoDBClient( "update", {
                TableName: PAYMENTS_TABLE,
                Key: {
                    userId: username,
                    domain: domain
                },
                UpdateExpression: 'SET #additionalData =:val',
                ExpressionAttributeNames: {
                    '#additionalData': 'additionalData',
                },
                ExpressionAttributeValues: { 
                    ':val': { subscriptionData },
                },
            });
        }
        if(retVal.resultSubscribe.subscription.transactions.length==0){
            log.push(["trial",retVal.resultSubscribe.subscription.trialDuration])
            let emailResponse = await sendEmail( {
                to: data.email,
                subject: EMAIL_CONFIG.braintreeSubscriptionTrial.subject,
                templateName: EMAIL_CONFIG.braintreeSubscriptionTrial.templateName,
                data: {name:data.first_name,domain:domain, days:retVal.resultSubscribe.subscription.trialDuration,amount:retVal.resultSubscribe.subscription.nextBillAmount,nextBillingDate: moment(retVal.resultSubscribe.subscription.nextBillingDate).format('MMM DD, YYYY')}
            } );
            log.push(["email response",emailResponse])
            // let data = {date:moment().format('YYYY-MM-DD'),trialDuration:retVal.resultSubscribe.subscription.trialDuration}
            var siteInfoParams = {
                TableName: SITE_INFO_TABLE,
                Key: {
                    domain,
                },
                UpdateExpression: 'SET #trialPeriod =:val',
    
                ExpressionAttributeNames: {
                     '#trialPeriod': 'trialPeriod'
                },
                ExpressionAttributeValues: { 
                   ':val': true
                },
            };
            let storeSitePromises = await dynamoDBClient( "update", siteInfoParams );

        }
        log.push( "After update PAYMENTS_TABLE");
        let emailData;
        if(retVal.resultSubscribe.subscription.transactions.length>0){
         emailData = await retVal.resultSubscribe.subscription.transactions[0].creditCard.cardType!==null ? {
            // heading:"Your subscription is now activated!",
            heading: existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId !== undefined ? "Your subscription is renewed!" : "Your subscription is now activated!",
            domain:domain,
            transactionId: retVal.resultSubscribe.subscription.transactions[0].id,

            merchant:retVal.resultSubscribe.subscription.transactions[0].merchantAccountId,
            amount: retVal.resultSubscribe.subscription.transactions[0].amount,
            currencyIsoCode: retVal.resultSubscribe.subscription.transactions[0].currencyIsoCode,
            createdAt: moment(retVal.resultSubscribe.subscription.transactions[0].createdAt).format("MMM DD, YYYY hh:mm A"),
            updatedAt: moment(retVal.resultSubscribe.subscription.updatedAt).format("MMM DD, YYYY"),
            nextRenewal: moment(retVal.resultSubscribe.subscription.nextBillingDate).format("MMM DD, YYYY"),

            authorizationCode: retVal.resultSubscribe.subscription.transactions[0].processorAuthorizationCode,
            status: retVal.resultSubscribe.subscription.transactions[0].status,

            payment_type:"Credit Card",
            card_type: retVal.resultSubscribe.subscription.transactions[0].creditCard.cardType,
            cardholder_name: retVal.resultSubscribe.subscription.transactions[0].creditCard.cardholderName,
            credit_card_ends_with: retVal.resultSubscribe.subscription.transactions[0].creditCard.last4,

            name: retVal.resultSubscribe.subscription.transactions[0].customer.firstName,
            email: retVal.resultSubscribe.subscription.transactions[0].customer.email,
            billingAddress:retVal.resultSubscribe.subscription.transactions[0].billing.postalCode

        } : {
            // heading:"Your subscription is now activated!", 
            heading: existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId ? "Your subscription is renewed!" : "Your subscription is now activated!",
            domain:domain,
            transactionId: retVal.resultSubscribe.subscription.transactions[0].id,

            merchant:retVal.resultSubscribe.subscription.transactions[0].merchantAccountId,
            amount: retVal.resultSubscribe.subscription.transactions[0].amount,
            currencyIsoCode: retVal.resultSubscribe.subscription.transactions[0].currencyIsoCode,
            createdAt: moment(retVal.resultSubscribe.subscription.transactions[0].createdAt).format("MMM DD, YYYY hh:mm A"),
            updatedAt: moment(retVal.resultSubscribe.subscription.updatedAt).format("MMM DD, YYYY"),
            nextRenewal: moment(retVal.resultSubscribe.subscription.nextBillingDate).format("MMM DD, YYYY"),

            status: retVal.resultSubscribe.subscription.transactions[0].status,

            payment_type:"PayPal Account",
            payer_email: retVal.resultSubscribe.subscription.transactions[0].paypal.payerEmail,
            payer_first_name: retVal.resultSubscribe.subscription.transactions[0].paypal.payerFirstName,
            payer_last_name: retVal.resultSubscribe.subscription.transactions[0].paypal.payerLastName,

            name: retVal.resultSubscribe.subscription.transactions[0].customer.firstName,
            email: retVal.resultSubscribe.subscription.transactions[0].customer.email
        }

        log.push(["paypal Data>>>>",emailData])
        log.push(["afterSetDataExistingItem",existingItem])
        // send email:
        if(existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId!==undefined){
        let sentEmail = '';
            if ( STAGE == "production" ) {
                log.push( "Proceeding with email sending" );
                let emailResponse = await sendEmail( {
                    to: data.email,
                    subject: existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId!==undefined ? EMAIL_CONFIG.braintreeSubscriptionUpdated.subject : EMAIL_CONFIG.braintreeSubscriptionCreated.subject,
                    templateName: existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId!==undefined ? EMAIL_CONFIG.braintreeSubscriptionUpdated.templateName : EMAIL_CONFIG.braintreeSubscriptionCreated.templateName,
                    data: emailData
                } );
                sentEmail=emailResponse;
                log.push(["email response",emailResponse])
            } else {
                log.push( "Email sending disabled for dev");
                let emailResponse = await sendEmail( {
                    to: data.email,
                    subject: existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId!==undefined ? EMAIL_CONFIG.braintreeSubscriptionUpdated.subject : EMAIL_CONFIG.braintreeSubscriptionCreated.subject,
                    templateName: existingDbResponse.Item !== undefined && existingDbResponse.Item.braintreeSubscriptionId!==undefined ? EMAIL_CONFIG.braintreeSubscriptionUpdated.templateName : EMAIL_CONFIG.braintreeSubscriptionCreated.templateName,
                    data: emailData
                } );
                sentEmail=emailResponse;
                log.push(["email response",emailResponse])
            }
            if(sentEmail.MessageId){
                let emailDate =  dbResponse.Item.emailSent == undefined ? '' : {...dbResponse.Item.emailSent}
    
                emailDate = emailDate=="" ?
                {"subscriptionSuccess":moment().format("YYYY-MM-DD")} 
                : {...emailDate,"subscriptionSuccess":moment().format("YYYY-MM-DD")}

                var siteInfoParams = {
                    TableName: SITE_INFO_TABLE,
                    Key: {
                        domain,
                    },
                    UpdateExpression: 'SET #emailSent =:val',
        
                    ExpressionAttributeNames: {
                        '#emailSent': 'emailSent'
                    },
                    ExpressionAttributeValues: { 
                        ':val':emailDate
                    },
                };
                let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );

            }

        }
    }

        log.push( "After email sending" );
        log.push('Response')
        log.separator()
        log.push(JSON.stringify(retVal))
        return success( { status: 1, message: "Success!", data: retVal } );
    } catch (e) {
        log.push( "Error in main try catch block. Details subscribe: " );
        // log.push( e.message );
        log.push( e );
        log.separator()

        return failure( { status: 0, message: "An error occurred.", data: { e } } );
    } finally {
        log.print()
    }
};

/**
 * @param {object} event – invoked event
 * @returns {Promise<{object}>}
 */
export const lambda = async ( event ) =>
    middlewaresHandler( { event, handler, settings: { schema: subscribeSchema } } );
