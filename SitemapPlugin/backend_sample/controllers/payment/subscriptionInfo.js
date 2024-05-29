import { middlewaresHandler } from "Middlewares/orchestrator";
import dynamoDBClient from "Services/dynamodb";
import sendEmail from "Services/email";
import { EMAIL_CONFIG } from "Constants";
import { getUserEmail, getUserName } from "Utilities";
import { success, failure } from "Helpers/response";
import moment from 'moment';
import { Logger } from "Helpers/logger";

const { SITE_INFO_TABLE, USER_SITES_TABLE, PAYMENTS_TABLE, BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY, BRAINTREE_ENVIRONMENT } = process.env;

const log = new Logger()
export const subscriptionInfoSchema = {
    id: "subscriptionInfoSchema",
    type: "object",
    properties: {
        domain: { type: "string", maxLength: 255 }
    },
    // required: [ "domain" ]
};

const handler = async ( req ) => {
    
        let braintree = require( "braintree" );
        const requestBody = req.event.body;

        const username = getUserName( req.event );
        // const userEmail = getUserEmail( req.event );
        const domain = requestBody.domain;
        const email = requestBody.userEmail;
        const name = requestBody.userName;
        const plugin = requestBody.plugin
        log.push('Request')
        log.separator()
        log.push(JSON.stringify(req))
        log.separator()
        log.push('Info logs')
        log.separator()

        log.push(email)
        // check domain access rights:
        let hookRes = '';
        let hookResNotification = '';
        log.push(["zzzplugin",JSON.stringify(requestBody)])
        let wpPlugin = false;

            let getWpPlugin =  await dynamoDBClient( "get", {
                TableName: USER_SITES_TABLE,
                Key: { userId: username },
            } )  || { Item: {} };

            let getWpPluginInstall =  await dynamoDBClient( "get", {
                TableName: SITE_INFO_TABLE,
                Key: { domain:domain },
            } )  || { Item: {} };

            if(getWpPluginInstall.Item!==undefined && getWpPluginInstall.Item.wpPlugin!==undefined){
                wpPlugin = getWpPluginInstall.Item.wpPlugin;
         }
    try {
        
        if(plugin==true){
            var siteInfoParams = {
                TableName: SITE_INFO_TABLE,
                Key: {
                    domain:domain
                },
                UpdateExpression: 'SET #wpPlugin =:val',
            
                ExpressionAttributeNames: {
                     '#wpPlugin': 'wpPlugin'
                },
                ExpressionAttributeValues: { 
                   ':val': true
                },
            };
            let storeSitePromises = await dynamoDBClient( "update", siteInfoParams );
        }

        let getWpPlugin =  await dynamoDBClient( "get", {
            TableName: USER_SITES_TABLE,
            Key: { userId: username },
        } )  || { Item: {} };

        let getWpPluginInstall =  await dynamoDBClient( "get", {
            TableName: SITE_INFO_TABLE,
            Key: { domain:domain },
        } )  || { Item: {} };

        if(getWpPluginInstall.Item!==undefined && getWpPluginInstall.Item.wpPlugin!==undefined){
            wpPlugin = getWpPluginInstall.Item.wpPlugin;
        }

        let dbResponse = await dynamoDBClient( "get", {
            TableName: SITE_INFO_TABLE,
            Key: { domain:domain }
        } );

        if(dbResponse.Item!==undefined){
            if(dbResponse.Item.type=="premium" && dbResponse.Item.braintreeSubscriptionId==undefined){

            var siteInfoParams = {
                TableName: SITE_INFO_TABLE,
                Key: {
                    domain:domain,
                },
                UpdateExpression: 'SET #type =:val',
    
                ExpressionAttributeNames: {
                     '#type': 'type'
                },
                ExpressionAttributeValues: { 
                   ':val': "community"
                },
            };
            let storeSitePromise = await dynamoDBClient( "update", siteInfoParams )

            }
        }
        
        log.push(["dbresponse>>>>>>",getWpPlugin])
        if(getWpPlugin.Item!==undefined && getWpPlugin.Item.domains!==undefined && getWpPlugin.Item.domains.length>0){
            log.push('dbrestore')
            let getPaymentPromise;
            if(Array.isArray(getWpPlugin.Item.domains))  {
                getWpPlugin.Item.domains.map(async(domain,i)=>{
                let dbResponse = await dynamoDBClient( "get", {
                    TableName: SITE_INFO_TABLE,
                    Key: { domain:domain }
                } );
            
                let { braintreeSubscriptionId } = dbResponse.Item;
                if ( !braintreeSubscriptionId || braintreeSubscriptionId.length == 0 ) {
                     //restore premium account if premium account deleted
                    getPaymentPromise =  await dynamoDBClient( "get", {
                    TableName: PAYMENTS_TABLE,
                    Key: { userId: username, domain: domain },
                } )  || { Item: {} };
            } else {
                let domainName = getWpPlugin.Item.domains
                    let dbResponse = await dynamoDBClient( "get", {
                        TableName: SITE_INFO_TABLE,
                        Key: { domain:domainName }
                    } );
                
                    let { braintreeSubscriptionId } = dbResponse.Item;
                    if ( !braintreeSubscriptionId || braintreeSubscriptionId.length == 0 ) {
                         //restore premium account if premium account deleted
                        getPaymentPromise =  await dynamoDBClient( "get", {
                        TableName: PAYMENTS_TABLE,
                        Key: { userId: username, domain: domainName },
                    } )  || { Item: {} };
            }
            let subscription = getPaymentPromise.Item!==undefined && getPaymentPromise.Item.hasOwnProperty('additionalData') && [...getPaymentPromise.Item.additionalData.subscriptionData] ;
           
            //add domain to subscription data
            let index = '';
            let sitesData = '';
            subscription.map((ele,i)=>{
                if(domain==JSON.parse(ele).domain && JSON.parse(ele).deletedData!==undefined){
                    index=i;
                    sitesData = JSON.parse(ele).deletedData.siteInfoData;
                }
            })
            if(index!==''){
                if(sitesData!=='' && sitesData.braintreeSubscriptionId!==undefined){
                    let today = new Date();
                    var tenDaysFromNow  = new Date();
                    tenDaysFromNow.setDate(today.getDate() + 10);
                    if(moment(sitesData.subscriptionDate).format("YYYY-MM-DD")>= moment().format("YYYY-MM-DD")){
                        
                        let getUserSitesData = await dynamoDBClient( "get", {
                            TableName: USER_SITES_TABLE,
                            Key:{userId:dbResponse.Item.userId}
                        } );
                        let filteredDomains = getUserSitesData.Item.domains.push(domain)
                
                        // restore domain in array to user sites table
                        if( getUserSitesData.Item.domains.indexOf(domain)==-1){
                        var userSitesParams = {
                            TableName: USER_SITES_TABLE,
                            Key: {userId:dbResponse.Item.userId},
                            UpdateExpression: 'SET #domains =:val',
                
                            ExpressionAttributeNames: {
                                '#domains': 'domains'
                            },
                            ExpressionAttributeValues: { 
                            ':val':filteredDomains
                            },
                        };
                        let removeSitePromise = await dynamoDBClient( "update", userSitesParams );}
                        
                        // Restore domain data in site info table
                        const siteInfoRes = await dynamoDBClient("put", {
                            TableName: SITE_INFO_TABLE,
                            Item: sitesData
                        });
                
                    }
                }
                // remove deletedData key from that domain in payment table

                let addKey = JSON.parse(subscription[index])
                delete addKey["deletedData"];
                subscription[index]=JSON.stringify(addKey);
                let storePaymentPromise = await dynamoDBClient( "put", {
                    TableName: PAYMENTS_TABLE,
                    Item: {
                        // userId: getPaymentPromise.Item.userId,
                        // braintreeCustomerId:getPaymentPromise.Item.braintreeCustomerId,
                        // paymentMethodToken:getPaymentPromise.Item.paymentMethodToken,
                        additionalData :{ subscriptionData: subscription},
                        ...getPaymentPromise
                    },
                } );
            }
            let { Item } = (await dynamoDBClient("get", {
                TableName: PAYMENTS_TABLE,
                Key: { userId: dbResponse.Item.userId,domain: domain },
              })) || { Item: {} };
                    
                }

            })
        }
        if ( !dbResponse.Item ) {
            throw new Error( "Site info cannot be found" );
        }
        if ( !dbResponse.Item.userId || !dbResponse.Item.userId !== username ) {
            // throw new Error( "No access to the selected domain." );
        }

        let { braintreeSubscriptionId } = dbResponse.Item;
        if ( !braintreeSubscriptionId || braintreeSubscriptionId.length == 0 ) {
           
            throw new Error( "Cannot find subscription info" );
        }

        let gateway = braintree.connect( {
            environment: braintree.Environment[BRAINTREE_ENVIRONMENT],
            // Use your own credentials from the sandbox Control Panel here
            merchantId: BRAINTREE_MERCHANT_ID,
            publicKey: BRAINTREE_PUBLIC_KEY,
            privateKey: BRAINTREE_PRIVATE_KEY
        } );

        let transactionPromise =
            new Promise( async ( resolve, reject ) => {
                let { Item } = (await dynamoDBClient("get", {
                    TableName: PAYMENTS_TABLE,
                    Key: { userId: username, domain: domain },
                  })) || { Item: {} };
                if(Item.additionalData!==undefined||Item.additionalData!==null){
                    resolve(Item)
                }else{
                    reject({errorType:"reject"})
                }
            } );


        let dbSiteInfo = await dynamoDBClient( "scan", {
            TableName: SITE_INFO_TABLE,
        } );
        log.push(["dbSiteInfo",JSON.stringify(dbSiteInfo)])

        if(dbSiteInfo.Items!==undefined && dbSiteInfo.Items.length>0){
           
            

            //added braintree subscription id list of premium account for fetch query from braintree
            let subscriptionIdList = [];
            dbSiteInfo.Items.map(function(ele){
                if(ele.type=="premium" && ele.braintreeSubscriptionId!==undefined){
                    subscriptionIdList.push(ele.braintreeSubscriptionId)
                }
            })
            log.push(["subscriptionIdList",JSON.stringify(subscriptionIdList)])
            
            //auto renewal
            var pastDue = gateway.subscription.search(function (search) {
                // log.push("search>>>>",search)
                search.daysPastDue().min(1);
                subscriptionIdList.map(function(ele){
                    search.id().is(`${ele}`);
                })
              },function(err,result){
                //   log.push("pastdueResult>>>",result)
                  if(result && result.ids!==undefined && result.ids.length>0){
                     dbSiteInfo.Items.map((ele,i)=>{
                        result.ids.map(async(elem,j)=>{
                                if(dbSiteInfo.Items[i].braintreeSubscriptionId!==undefined && dbSiteInfo.Items[i].braintreeSubscriptionId==result.ids[j]){
                                    let find  = await gateway.subscription.find(result.ids[j],async function (err, result) {
                                        // log.push("pastdueSubs>>>",result)
                                        if(result!==undefined && result.hasOwnProperty('status') && result.status!=='Active'){
                                            var siteInfoParams = {
                                                TableName: SITE_INFO_TABLE,
                                                Key: {
                                                   domain: ele.domain,
                                                },
                                                UpdateExpression: 'SET #status =:val',
                                    
                                                ExpressionAttributeNames: {
                                                     '#status': 'status'
                                                },
                                                ExpressionAttributeValues: { 
                                                   ':val': result.status
                                                },
                                            };
                                            let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );

                                        }
                                        //set email for auto renewal fail
                                        if(result.daysPastDue==1||result.daysPastDue==4||result.daysPastDue==7){
                                            
                                            let emailSend = false;
                                            var today = new Date();
                                             
                                            let emailData = ele.emailSent == undefined ? '' : {...ele.emailSent}

                                        if(result.daysPastDue==1){
                                            var daysFromNow  = ele.emailSent!==undefined && ele.emailSent.invalidPaymentNoticeDay1!==undefined ? new Date(ele.emailSent.invalidPaymentNoticeDay1) : '';

                                            if(daysFromNow!==''){
                                                daysFromNow.setDate(daysFromNow.getDate() + 10)
                                            }
                                            if(daysFromNow!=='' && moment(daysFromNow).format("YYYY-MM-DD") < moment(today).format("YYYY-MM-DD") ){
                                                emailSend = true;
                                                emailData = emailData=="" ?
                                                {"invalidPaymentNoticeDay1":moment(today).format("YYYY-MM-DD")} 
                                                : {...emailData,"invalidPaymentNoticeDay1":moment(today).format("YYYY-MM-DD")}
                                            }
                                        }

                                        if(result.daysPastDue==4){
                                            var daysFromNow  = ele.emailSent!==undefined && ele.emailSent.invalidPaymentNoticeDay4!==undefined ? new Date(ele.emailSent.invalidPaymentNoticeDay4) : '';

                                            if(daysFromNow!==''){
                                                daysFromNow.setDate(daysFromNow.getDate() + 10)
                                            }
                                            if(daysFromNow!=='' && moment(daysFromNow).format("YYYY-MM-DD") < moment(today).format("YYYY-MM-DD") ){
                                                emailSend = true;
                                                emailData = emailData=="" ?
                                                {"invalidPaymentNoticeDay4":moment(today).format("YYYY-MM-DD")} 
                                                : {...emailData,"invalidPaymentNoticeDay4":moment(today).format("YYYY-MM-DD")}                                            
                                            }
                                        }

                                        if(result.daysPastDue==7){
                                            var daysFromNow  = ele.emailSent!==undefined && ele.emailSent.invalidPaymentNoticeDay7!==undefined ? new Date(ele.emailSent.invalidPaymentNoticeDay7) : '';

                                            if(daysFromNow!==''){
                                                daysFromNow.setDate(daysFromNow.getDate() + 10)
                                            }
                                            if(daysFromNow!=='' && moment(daysFromNow).format("YYYY-MM-DD") < moment(today).format("YYYY-MM-DD") ){
                                                emailSend = true;
                                                emailData = emailData=="" ?
                                                {"invalidPaymentNoticeDay7":moment(today).format("YYYY-MM-DD")} 
                                                : {...emailData,"invalidPaymentNoticeDay7":moment(today).format("YYYY-MM-DD")}
                                            
                                            }
                                        //Account downgraded to community at past due day 7
                                            var siteInfoParams = {
                                                TableName: SITE_INFO_TABLE,
                                                Key: {
                                                    domain,
                                                },
                                                UpdateExpression: 'SET #type =:val, #status = :value',
                                    
                                                ExpressionAttributeNames: {
                                                     '#type': 'type',
                                                     '#status': 'status'
                                                },
                                                ExpressionAttributeValues: { 
                                                   ':val': "community",
                                                   ':value': result.status
                                                },
                                            };
                                            let storeSitePromise = await dynamoDBClient( "update", siteInfoParams )
                                        }
                                        
                                        if(ele.emailSent!==undefined && emailSend==false ){
                                            log.push("mail already sent");
                                        }else{
                                            let emailResponse = await sendEmail( {
                                                to: data.email,
                                                subject: EMAIL_CONFIG.braintreeSubscriptionUpdateFailure.subject,
                                                templateName: EMAIL_CONFIG.braintreeSubscriptionFailure.templateName,
                                                data:{data:"auto subscription renewal",notice:result.daysPastDue!==7?"":"Your account will be downgraded to community account untill we receive payment."}
                                            } );
                                            log.push("email response",emailResponse)
                                            if(emailResponse.MessageId){
                                                
                                                var siteInfoParams = {
                                                    TableName: SITE_INFO_TABLE,
                                                    Key: {
                                                    domain: ele.domain,
                                                    },
                                                    UpdateExpression: 'SET #emailSent =:val',
                                        
                                                    ExpressionAttributeNames: {
                                                        '#emailSent': 'emailSent'
                                                    },
                                                    ExpressionAttributeValues: { 
                                                    ':val':emailData
                                                    },
                                                };
                                                let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );

                                                if(result.daysPastDue==7){
                                                var siteInfoParamsUserInformed = {
                                                    TableName: SITE_INFO_TABLE,
                                                    Key: {
                                                    domain: ele.domain,
                                                    },
                                                    UpdateExpression: 'SET #isUserInformed =:val',
                                        
                                                    ExpressionAttributeNames: {
                                                        '#isUserInformed': 'isUserInformed'
                                                    },
                                                    ExpressionAttributeValues: { 
                                                    ':val':true
                                                    },
                                                };
                                                let storeSitePromiseUserInfromed = await dynamoDBClient( "update", siteInfoParamsUserInformed );
                                            }
                                            }

                                        }
                                    }

                                    })
                            }
                        })
                     })
                    log.push('autoRenewal failed')
                  }else{
                    dbSiteInfo.Items.map(async(ele,i)=>{
                        if(ele.braintreeSubscriptionId!==undefined){
                            let find  = await gateway.subscription.find(ele.braintreeSubscriptionId,async function (err, result) {
                                // log.push("pastduzeelse>>>",result)
                                if(ele!==undefined && ele.type=="premium" && ele.status!=="Active" && result.status=='Active'){
                                    //set email for auto renewal
                                    let emailResponse = await sendEmail( {
                                        to: email,
                                        subject: EMAIL_CONFIG.braintreeSubscriptionUpdated.subject,
                                        templateName: EMAIL_CONFIG.braintreeSubscriptionUpdated.templateName,
                                        data: {name:name, domain:ele.domain, nextRenewal:moment(result.nextBillingDate).format("MMM DD, YYYY"), amount:result.nextBillAmount, updatedAt:moment( new Date()).format("MMM DD, YYYY hh:mm:ss"),currencyIsoCode:"USD"}
                                    } );
                                }
                                // if(result.status!=='Active'){
                                    var siteInfoParams = {
                                        TableName: SITE_INFO_TABLE,
                                        Key: {
                                           domain: ele.domain,
                                        },
                                        UpdateExpression: 'SET #status =:val',
                            
                                        ExpressionAttributeNames: {
                                             '#status': 'status'
                                        },
                                        ExpressionAttributeValues: { 
                                           ':val': result.status
                                        // ':val': 'Past Due'
                                        },
                                    };
                                    let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );
                                // }

                                // Renewal Notice Email can be set one month out
                                if(result.currentBillingCycle==12){                                   

                                        let emailSend = false;
                                        var today = new Date();
                                        var daysFromNow  = ele.emailSent!==undefined && ele.emailSent.noticeBeforeMonth!==undefined ? new Date(ele.emailSent.noticeBeforeTenDays) : '';
                                        if(daysFromNow!==''){
                                            daysFromNow.setDate(daysFromNow.getDate() + 10)
                                        }

                                        if(daysFromNow!=='' && moment(daysFromNow).format("YYYY-MM-DD")<moment(today).format("YYYY-MM-DD")&& moment(result.nextBillingDate).format("YYYY-MM-DD")> moment(daysFromNow).format("YYYY-MM-DD")){
                                            emailSend = true
                                        }
                                        if(ele.emailSent!==undefined && ele.emailSent.noticeBeforeMonth!==undefined && emailSend==false ){
                                            log.push("mail already sent");
                                        }else{

                                            let emailResponse = await sendEmail( {
                                                to: email,
                                                subject: EMAIL_CONFIG.braintreeSubscriptionReminder.subject,
                                                templateName: EMAIL_CONFIG.braintreeSubscriptionReminder.templateName,
                                                data: {name:name,domain:ele.domain,date:moment(result.nextBillingDate).format("MMM DD, YYYY"),amount:result.nextBillAmount}
                                            } );
                                            log.push(["email response",emailResponse])
                                            if(emailResponse.MessageId){
                                                // save email sent date to site info table
                                            let emailData = ele.emailSent == undefined ? '' : {...ele.emailSent}

                                            emailData = emailData=="" ?
                                            {"noticeBeforeMonth":moment(today).format("YYYY-MM-DD")} 
                                            : {...emailData,"noticeBeforeMonth":moment(today).format("YYYY-MM-DD")}
                                                
                                                var siteInfoParams = {
                                                    TableName: SITE_INFO_TABLE,
                                                    Key: {
                                                    domain: ele.domain,
                                                    },
                                                    UpdateExpression: 'SET #emailSent =:val',
                                        
                                                    ExpressionAttributeNames: {
                                                        '#emailSent': 'emailSent'
                                                    },
                                                    ExpressionAttributeValues: { 
                                                    ':val':emailData
                                                    },
                                                };
                                                let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );
                                            }

                                        }
                                }

                            })

                        }                        
                    })
                  }
              })
              

            //reminder before 10 days of next billings
            var today = new Date();
            var daysFromNow  = new Date();
            daysFromNow.setDate(today.getDate() + 10)
            var stream1 = gateway.subscription.search(function (search) {
                search.nextBillingDate().max(daysFromNow);
                // search.ids().is('bq9r92','dm6mfm');
                subscriptionIdList.map(function(ele){
                    search.id().is(`${ele}`);
                })
              },function(err,res){
                // log.push("ele>>>>res>>>",res)
                  if(res.ids!==undefined && res.ids.length>0){
                      dbSiteInfo.Items.map((ele,i)=>{
                        res.ids.map(async(elem,j)=>{
                                if(  dbSiteInfo.Items[i].braintreeSubscriptionId==res.ids[j]){
                                    let find  = await gateway.subscription.find(res.ids[j],async function (err, result) {
                                        log.push(["ids>>>>",result])
                                        if(result.trialPeriod!==true){
                                        let emailSend = false;
                                        var today = new Date();
                                        var daysFromNow  = ele.emailSent!==undefined && ele.emailSent.noticeBeforeTenDays!==undefined ? new Date(ele.emailSent.noticeBeforeTenDays) : '';
                                        if(daysFromNow!==''){
                                            daysFromNow.setDate(daysFromNow.getDate() + 10)
                                        }

                                        if(daysFromNow!=='' && moment(daysFromNow).format("YYYY-MM-DD")<moment(today).format("YYYY-MM-DD")&& moment(result.nextBillingDate).format("YYYY-MM-DD")> moment(daysFromNow).format("YYYY-MM-DD")){
                                            emailSend = true
                                        }
                                        if(ele.emailSent!==undefined && ele.emailSent.noticeBeforeTenDays!==undefined && emailSend==false ){
                                            log.push("mail already sent");
                                        }else{
                                            let emailResponse = await sendEmail( {
                                                to: email,
                                                subject: EMAIL_CONFIG.braintreeSubscriptionReminder.subject,
                                                templateName: EMAIL_CONFIG.braintreeSubscriptionReminder.templateName,
                                                data: {name:name,domain:ele.domain,date:moment(result.nextBillingDate).format("MMM DD, YYYY"),amount:result.nextBillAmount}
                                            } );
                                            log.push(["email response",emailResponse])
                                            if(emailResponse.MessageId){ 

                                                let emailData = ele.emailSent == undefined ? '' : {...ele.emailSent}
    
                                                emailData = emailData=="" ?
                                                {"noticeBeforeTenDays":moment(today).format("YYYY-MM-DD")} 
                                                : {...emailData,"noticeBeforeTenDays":moment(today).format("YYYY-MM-DD")}                                                
                                                log.push(["emailDataaa>>>>",emailData])
                                                // save email send date to site info table:
                                                var siteInfoParams = {
                                                    TableName: SITE_INFO_TABLE,
                                                    Key: {
                                                    domain: ele.domain,
                                                    },
                                                    UpdateExpression: 'SET #emailSent =:val',
                                        
                                                    ExpressionAttributeNames: {
                                                        '#emailSent': 'emailSent'
                                                    },
                                                    ExpressionAttributeValues: { 
                                                    ':val':emailData
                                                    },
                                                };
                                                let storeSitePromise = await dynamoDBClient( "update", siteInfoParams );
                                            }

                                        }
                                        }
                                    });
                                    
                            }
                        })
                    })
                  }
              }
              );            
        }

  
       

        // wait for braintree transaction
        let retVal = await transactionPromise;
        // log.push("retval>>>",retVal)
        log.push('Response')
        log.separator()
        log.push(JSON.stringify(retVal))
        return success( { status: 1, message: "Success!", data: retVal, wpPlugin:wpPlugin, domain:domain }, 200, {
            "Access-Control-Allow-Origin": "*"
        } );
    } 
    }catch (generalError) {
        log.push( "ERROR DETAILS:" );
        log.separator()
        log.push( generalError );
        return failure( { status: 0, "message": "An error occurred.", data: {}, wpPlugin:wpPlugin, domain:domain }, 500, {
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
    settings: { schema: subscriptionInfoSchema }
} );
