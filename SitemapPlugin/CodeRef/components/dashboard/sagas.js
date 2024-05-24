// @flow

import { call, put, take, fork } from "redux-saga/effects";
import http from "../../api";
import * as actions from "./actions";
import { Storage } from "helpers/index";
import { API } from "aws-amplify/lib/index";
import { BING_TOKENS } from "constants/index";
import Auth from '@aws-amplify/auth'
import { GoogleApiHelper } from "helpers/index";
import { prepareHeaderData, prepareBingChartData,prepareBingHeaderData, prepareChartData, prepareGoogleAnaliticsData, prepareHeaderDataForAnalytics } from "helpers";
import { prepareHeaderSitemapData } from "./components/sitemapStatusSection/sitemapStatusFunctions";
import { isInsideWpAdmin } from "../../helpers/installationFlowHelper";
import { wpApiCall, cloudApiCall } from "../../api/apiClient";
import { customLogger } from 'logger';


const googleWebMaster = GoogleApiHelper.getWebmaster();
const googleAnalyticsReport = GoogleApiHelper.getAnalyticsReport();
const googleAnalytics = GoogleApiHelper.getGoogleAnalytics();

const {
    REACT_APP_COGNITO_APP_CLIENT_ID,
} = process.env;

const decodePayload = jwtToken => {
    const [ payload ] = jwtToken.split(".") || [];
    try {
      return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    } catch (err) {
      return {};
    }
  };

const calculateClockDrift = (iatAccessToken, iatIdToken) => {
    const now = Math.floor(new Date() / 1000);
    const iat = Math.min(iatAccessToken, iatIdToken);
    return now - iat;
  };

 const setToken = async (data) => {
    const idTokenData = await decodePayload(data["id_token"]);
    const accessTokenData = await decodePayload(data["access_token"]);

    localStorage.setItem("CognitoIdentityServiceProvider." + REACT_APP_COGNITO_APP_CLIENT_ID + ".LastAuthUser", idTokenData["cognito:username"]);
    localStorage.setItem("CognitoIdentityServiceProvider." + REACT_APP_COGNITO_APP_CLIENT_ID + "." + idTokenData["cognito:username"] + ".idToken", data["id_token"]);
    localStorage.setItem("CognitoIdentityServiceProvider." + REACT_APP_COGNITO_APP_CLIENT_ID + "." + idTokenData["cognito:username"] + ".accessToken", data["access_token"]);
    localStorage.setItem("CognitoIdentityServiceProvider." + REACT_APP_COGNITO_APP_CLIENT_ID + "." + idTokenData["cognito:username"] + ".refreshToken", data["refresh_token"]);
    localStorage.setItem(
      "CognitoIdentityServiceProvider." + REACT_APP_COGNITO_APP_CLIENT_ID + "." + idTokenData["cognito:username"] + ".clockDrift",
      "" + calculateClockDrift(accessTokenData["iat"], idTokenData["iat"]) + ""
    );
    localStorage.setItem("amplify-redirected-from-hosted-ui", true);
    localStorage.setItem("amplify-signin-with-hostedUI", true);
  };

function* watchGetToken() {
    while (true) {
        const { request } = yield take(actions.AUTH_GET_TOKEN.REQUEST);
        const url = `${request.originHost}/wp-json/jwt-auth/v1/token`;
        try {
            const response = yield call(http, url, {
                method: "POST",
                body: JSON.stringify({ ...request }),
            });

            if (!!response.token && response.token.length > 0){
                yield put(actions.authGetToken.success(response));
                yield Storage.setToken(response.token);
            } else {
                throw new Error("Something went wrong");
            }
        } catch (e) {
            yield put(actions.authGetToken.error(e));
        }
    }
}

function* watchSetGoogleAuthToken() {
    while (true) {                                                                                                                                                                                                                                                                                                                                                                                          
        const { request } = yield take(actions.AUTH_SET_TOKEN.REQUEST);
       
        if(request) {
            const tokens = yield GoogleApiHelper.setTokens(request.code,request.type);
            
            if(tokens){
                yield GoogleApiHelper.storeToken(tokens);
                yield put(actions.setGoogleAuthToken.success(tokens));
            } else {
                throw new Error("Something went wrong");
            }
        }
    }
}

function* watchSetRefreshAuthToken() {
    while (true) {
        const { request } = yield take(actions.AUTH_SET_REFRESH_TOKEN.REQUEST);
        let User;
        try{
            User =  yield Auth.currentAuthenticatedUser({bypassCache: false})
        } catch(e){
            User = null
        }
        if(request.type == 'get-google-token' &&  User){
            try{
                const config = {
                    response: true,
                };
                const response = yield API.get("", "/site/tokens",config);
                let tokens = JSON.parse(response.data.body)
                if(tokens.hasOwnProperty('data') && tokens.data.hasOwnProperty('googletoken')) {
                    yield GoogleApiHelper.storeToken(tokens.data.googletoken);
                }
            } catch(e){
                yield put(actions.setGoogleAuthToken.error(e))
            }
            
        }
    }
}

function* watchGenerateSiteMap() {
    while (true) {
        const { request } = yield take(actions.GENERATE_SITE_MAP.REQUEST);

        try {
            if (request) {
                const config = {
                    body: { ...request },
                    response: true,
                };

                const response = yield API.post("", "/sitemap/push-sitemap", config);

                if (response.status === 200 && response.data){
                    yield put(actions.generateSiteMap.success());
                }
            }
        } catch (e) {
            yield put(actions.generateSiteMap.error(e));
            throw new Error("Something went wrong");
        }
    }
}

function* watchGetGoogleAnalitycsData() {
    while (true) {
        let { request } = yield take(actions.GET_GOOGLE_ANALYTICS_DATA.REQUEST);
        try {
            if (request) {
                yield* watchGetGoogleAnalitycsHeaderData(request);
                yield* watchGetGoogleAnalitycsChartData(request);
            }
        } catch (e) {
            yield put(actions.getGoogleAnalyticsData.error(e));
            throw new Error("Something went wrong");
        }
    }
}

function* watchGetGoogleWebmasterData() {
    while (true) {
        let { request } = yield take(actions.GET_GOOGLE_WEBMASTER_DATA.REQUEST);
        try {
            if (request) {
                yield* watchGetGoogleWebmasterHeaderData(request);
                yield* watchGetGoogleWebmasterChartData(request);
                yield* watchGetGoogleWebmasterRowsData(request);
            }
        } catch (e) {
            yield put(actions.getGoogleWebmasterData.error(e));
            throw new Error("Something went wrong");
        }
    }
}

function* watchGetSitemapData() {
    while (true) {
        let { request } = yield take(actions.GET_SITEMAP_DATA.REQUEST);
        try {
            if (request) {
                yield* watchGetSitemapHeaderData(request);
                yield* watchGetSitemapChartData(request);
                yield* watchGetSitemapRowsData(request);
            }
        } catch (e) {
            yield put(actions.getSitemapData.error(e));
            throw new Error("Something went wrong");
        }
    }
}


function* watchGetGoogleAnalitycsHeaderData(request) {
           try {
        if (request){
            let googleAnalyticsReportsInstance = yield googleAnalyticsReport
            let googleAnalyticsInstance = yield googleAnalytics
            let  accountInfo = yield googleAnalyticsInstance.management.accountSummaries.list()
            let ViewId = accountInfo.data.items[0].webProperties[0].profiles[0].id;
             const res = yield googleAnalyticsReportsInstance.reports.batchGet({
                requestBody: {
                    "reportRequests": [
                        {
                        "viewId": ViewId,
                        "dateRanges": [
                            {
                            "startDate": request.startDate,
                            "endDate": request.endDate
                            }
                        ],
                        "metrics": [
                            {
                            "expression": "ga:uniquePageviews"
                            },
                            {
                            "expression": "ga:visitors"
                            }
                        ],
                        "dimensions": [
                        {
                            "name":"ga:yearMonth"
                        }]
                        }
                    ]
                }
            });
            let headerData =  yield prepareHeaderDataForAnalytics(res.data.reports[0].data.totals[0].values,request.startDate,request.endDate);
             yield put(actions.getGoogleAnalyticsData.successHeaderData({
                headerData
            }));
            
        }
    } catch(e) {
        yield put(actions.getGoogleAnalyticsData.error(e));
    }
}

function* watchGetGoogleAnalitycsChartData(request) {
    try {
        if (request){
            let googleAnalyticsReportsInstance = yield googleAnalyticsReport
            let googleAnalyticsInstance = yield googleAnalytics
            let  accountInfo = yield googleAnalyticsInstance.management.accountSummaries.list()
            let ViewId = accountInfo.data.items[0].webProperties[0].profiles[0].id;
             const res = yield googleAnalyticsReportsInstance.reports.batchGet({
                requestBody: {
                    "reportRequests": [
                        {
                        "viewId": ViewId,
                        "dateRanges": [
                            {
                            "startDate": request.startDate,
                            "endDate": request.endDate
                            }
                        ],
                        "metrics": [
                            {
                            "expression": "ga:uniquePageviews"
                            },
                            {
                            "expression": "ga:visitors"
                            }
                        ],
                        "dimensions": [
                        {
                            "name":"ga:yearMonth"
                        }]
                        }
                    ]
                }
            });
            let chartData =  yield prepareGoogleAnaliticsData(res.data, request.startDate, request.endDate);
            yield put(actions.getGoogleAnalyticsData.successChartData({
                chartData
            }));
            
        }
    } catch(e) {
        yield put(actions.getGoogleAnalyticsData.error(e));
    }
}


function* watchGetGoogleWebmasterHeaderData(request) {
    try {
        if (request){
            let googleWebMasterInstance = yield googleWebMaster
            let { data: { rows } } = yield googleWebMasterInstance.searchanalytics.query({
                siteUrl: request.siteUrl,
                requestBody: {
                    "startDate": request.startDate,
                    "endDate": request.endDate,
                    "rowLimit": 25000,
                    "dimensions": [
                        "date"
                    ]
                }
            });

            yield put(actions.getGoogleWebmasterData.successHeaderData({
                headerData: prepareHeaderData(rows,request.startDate,request.endDate),
            }));
        }
    } catch(e) {
        yield put(actions.getGoogleWebmasterData.error(e));
    }
}

function* watchGetGoogleWebmasterChartData(request) {
    try {
        if (request){

            let googleWebMasterInstance = yield googleWebMaster
            let { data: { rows } } = yield googleWebMasterInstance.searchanalytics.query({
                siteUrl: request.siteUrl,
                requestBody: {
                    "startDate": request.startDate,
                    "endDate": request.endDate,
                    "rowLimit": 25000,
                    "dimensions": [
                        "date"
                    ]
                }
            });

            yield put(actions.getGoogleWebmasterData.successChartData({
                chartData: prepareChartData(rows, request),
            }));
        }
    } catch(e) {
        yield put(actions.getGoogleWebmasterData.error(e));
    }
}

function* watchGetBingWebmasterData() {
    while (true) {
        const { request } = yield take(actions.GET_BING_WEBMASTER_DATA.REQUEST);
        const tokens = Storage.getItem(BING_TOKENS);
        try {
            const user = yield Auth.currentAuthenticatedUser()
            if(user!==null){
                if (request){
                    const res = yield API.post( '', "/webmasters/bing", {
                        body: { 
                            site: "http://wp-dev-env-1545.space/",
                            key: tokens.access_token,
                            api: ["GetCrawlStats","GetQueryStats"],
                        },
                        response: true,
                    });
                    let crawlState = prepareBingChartData(res.data.result,request.selectedDate);
                    yield put(actions.getBingWebmasterData.success({
                        crawlState: crawlState,
                        headerData: prepareBingHeaderData(crawlState,request.selectedDate)
                    }));
                }
            }
        } catch(e) {
            customLogger("error:",e);
            yield put(actions.getBingWebmasterData.error(e));
        }
    }
}

function* watchGetSitemapChartData(request) {
    try {
        if (request){

            let googleWebMasterInstance = yield googleWebMaster
            let { data: { sitemap } } = yield googleWebMasterInstance.sitemaps.list({
                siteUrl: request.siteUrl,
                sitemapIndex: request.sitemapIndex,
            });
            yield put(actions.getSitemapData.successChartData({
                chartData: sitemap,
            }));
        }
    } catch(e) {
         yield put(actions.getSitemapData.error(e));
    }
}

function* watchGetGoogleWebmasterRowsData(request) {
    try {
        if (request){
            let googleWebMasterInstance = yield googleWebMaster

            let { data: { rows } } = yield googleWebMasterInstance.searchanalytics.query({
                siteUrl: request.siteUrl,
                requestBody: {
                    "dimensions": request.dimensions,
                    "startDate": request.startDate,
                    "endDate": request.endDate,
                    "rowLimit": request.rowLimit
                }
            });
            yield put(actions.getGoogleWebmasterData.successRowsData({
                rowsData: rows,
            }));
        }
    } catch(e) {
        yield put(actions.getGoogleWebmasterData.error(e));
    }
}

function* watchGetSitemapHeaderData(request) {
    try {
        if (request){
            let googleWebMasterInstance = yield googleWebMaster
            let { data: { sitemap } } = yield googleWebMasterInstance.sitemaps.list({
                siteUrl: request.siteUrl,
                sitemapIndex: request.sitemapIndex,
            });
            yield put(actions.getSitemapData.successHeaderData({
                headerData: prepareHeaderSitemapData(sitemap),
            }));
        }
    } catch(e) {
        yield put(actions.getSitemapData.error(e));
    }
}

function* watchGetSitemapRowsData(request) {
    try {
        if (request){
            let googleWebMasterInstance = yield googleWebMaster
            let { data: { sitemap } } = yield googleWebMasterInstance.sitemaps.list({
                siteUrl: request.siteUrl,
                sitemapIndex: request.sitemapIndex,
            });
            yield put(actions.getSitemapData.successRowsData({
                rowsData: sitemap,
            }));
        }
    } catch(e) {
        yield put(actions.getSitemapData.error(e));
    }
}

//prepareTableSitemapData(sitemap)
function* watchSetDateRange() {
    while (true) {                                                 
        const { request } = yield take(actions.SET_DATE_RANGE.REQUEST);
        if(request) {
            yield put(actions.setDateRange.success(request));
        }
    }
}
function* watchSetCognitoToken() {
    while (true) {
        const { request : { idToken='',accessToken='', refreshToken='',domain=''} } = yield take(actions.SET_COGNITO_TOKEN.REQUEST);
        customLogger("cognitoRequest")
            try{
                
                let reqBody ={idToken,accessToken,refreshToken};
                customLogger("prod connect!!!!");
                    const apiCallConfig = {
                        body: { ...reqBody ,domain}
                    };
                    const config = {
                            response: true,
                        };
                    // returns response object, with property body as string
                    const response = yield API.post("", "/user/setCognitoToken",apiCallConfig);
                    let responseObject = JSON.parse(response.body)
                    // jsonData = responseObject.data.additionalData.subscriptionData
                    if ( responseObject.status === 0 ) {
                        yield window.localStorage.setItem('siteExists',true)
                    } else {
                        yield window.localStorage.removeItem('siteExists')
                    }
                    customLogger("resulting jsonData setcognito:jsondata",responseObject);
                    // customLogger("resulting jsonData subscription:setting",jsonData);

            yield put(actions.setCognitoToken.success());
            } catch(e){
                customLogger("set-cognito-token ERROR>>>>", e)
                yield put(actions.setCognitoToken.error(e))
            }
    }
}
function* watchGetCognitoToken() {
    while (true) {
        const { request : {domain='',removeToken=false,action=''} } = yield take(actions.GET_COGNITO_TOKEN.REQUEST);
        
            try{
                customLogger("cognitoRequest>>>Token",removeToken)
                let reqBody ={};
                customLogger("prod connect!!!!");
                    const apiCallConfig = {
                        body: { domain:domain,removeToken:removeToken }
                    };
                    customLogger("cognitoRequest",apiCallConfig)
                    const config = {
                            response: true,
                        };
                    // returns response object, with property body as string
                    const response = yield API.post("", "/user/getCognitoToken",apiCallConfig);
                    customLogger("resulting jsonData getcognito:jsondataRES",response);
                    customLogger("getCognitoTOken:res>",isInsideWpAdmin()==true,response.data=="")
                    if(response.data && response.data.idToken && isInsideWpAdmin()==true){
                        customLogger("getCognitoTOken:data>")
                        let tokenData = {
                            id_token: response.data.idToken,
                            access_token: response.data.accessToken,
                            refresh_token: response.data.refreshToken
                          };
                          localStorage.setItem("cognitoLogin",true)
                        yield put(actions.getCognitoToken.success(response.data))
                        yield setToken(tokenData);
                       let authCurrentSession = yield Auth.currentSession();
                          customLogger('authCurrentSession',authCurrentSession);
                    }else if(isInsideWpAdmin()==true && response.data==""){
                        customLogger("getCognitoTOken:>")
                       if(localStorage.length<8){
                           customLogger("getCognitoTOken:loc>>")
                        //     yield Auth.signOut({global: false});
                        //     localStorage.clear();
                        //    yield GoogleApiHelper.onLogout();
                           if(action!==""){
                               yield call(action);
                            // history.push("/sign-in");
                           }                    
                        }
                    } else{
                        yield put(actions.getCognitoToken.error())
                    }

            // yield put(actions.getCognitoToken.success());
            } catch(e){
                customLogger("get-cognito-token ERROR>>>>", e)
                yield put(actions.getCognitoToken.error(e))
            }
    }
}


function* watchSetVerifiedFlag() {
    while (true) {
        const { request : {domain=''} } = yield take(actions.SET_VERIFIED_FLAG.REQUEST);
        
            try{
                
                let reqBody ={};
                customLogger("prod connect!!!!");
                    const apiCallConfig = {
                        body: { domain:domain }
                    };
                    customLogger("cognitoRequest",apiCallConfig)
                    const config = {
                            response: true,
                        };
                    // returns response object, with property body as string
                    const response = yield API.post("", "/site/set-verified-flag",apiCallConfig);
                    customLogger("resulting jsonData SET_VERIFIED_FLAG:jsondataRES",response);
            } catch(e){
                customLogger("set-verified-flag ERROR>>>>", e)
                yield put(actions.setVerifiedFlag.error(e))
            }
    }
}

function* watchNotifySearchEnginesViaPings() {
    while (true) {                                              
        const { request } = yield take(actions.SET_NOTIFY_ENGINES.REQUEST);
        let jsonData = {};

        if(request) {
            
            let callRequest;

            if ( !isInsideWpAdmin() ) {
                callRequest = {
                    relativeUrl: "build/pingSearchEngines",
                    apiStack: "-sitemap-build-api",
                    data: {"type": request.type, "domain": request.domain, "sitemapUrl": request.sitemapUrl},
                    method: "POST"
                };
                jsonData = yield call(cloudApiCall, callRequest);
            } else {
                callRequest = {
                    relativeUrl: "sitemap-pings",
                    method: "GET"
                };
                jsonData = yield call(wpApiCall, callRequest);

                callRequest = {
                    relativeUrl: "get-sitemap-pings",
                    method: "GET"
                };
                jsonData = yield call(wpApiCall, callRequest);
            }

            customLogger("OK!! before dispatching success", jsonData);

            if(jsonData.status == 1) {
                yield put(actions.notifySearchEnginesViaPings.success({"response": jsonData}))
            } else {
                yield put(actions.notifySearchEnginesViaPings.error({"error": jsonData}))
            }
        }
    }
}

function* watchGetPingDetails() {
    while (true) {                                              
        const { request } = yield take(actions.GET_PING_INFO.REQUEST);
        let jsonData = {};

        if(request) {
            
            let callRequest;
            if(isInsideWpAdmin()){
                callRequest = {
                    relativeUrl: "get-sitemap-pings",
                    method: "GET"
                };
                jsonData = yield call(wpApiCall, callRequest);

            

                if(jsonData.status == 1) {
                    yield put(actions.notifySearchEnginesViaPings.success({"response": jsonData}))
                } else {
                    yield put(actions.notifySearchEnginesViaPings.error({"error": jsonData}))
                }
            }
        }
    }
}
export default [
    fork(watchGetToken),
    fork(watchGenerateSiteMap),
    fork(watchGetGoogleWebmasterData),
    fork(watchGetBingWebmasterData),
    fork(watchGetGoogleAnalitycsData),
    fork(watchGetSitemapData),
    fork(watchSetGoogleAuthToken),
    fork(watchSetRefreshAuthToken),
    fork(watchSetDateRange),
    fork(watchSetCognitoToken),
    fork(watchGetCognitoToken),
    fork(watchSetVerifiedFlag),
    fork(watchNotifySearchEnginesViaPings),
    fork(watchGetPingDetails)
];
