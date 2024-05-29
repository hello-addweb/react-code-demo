import dotenv from "dotenv";
import { put, take, fork } from "redux-saga/effects";
import { API,Auth } from "aws-amplify";
import * as cloudSitemapActions from "actions/cloudSitemap";

dotenv.load();

const {
    REACT_APP_CONNECT_TO_SERVERLESS_OFFLINE,
    REACT_APP_MOCK,
    REACT_APP_API_SITEMAP_BUILD_API_GATEWAY_URL
} = process.env;

/***
 * Start sitemap regeneration in cloud
 * @returns {IterableIterator<<"TAKE", TakeEffectDescriptor>|<"PUT", PutEffectDescriptor<*>>>}
 */
function* watchBuildCloudXmlSitemap() {
    while (true) {

        const { request } = yield take( cloudSitemapActions.CLOUD_SITEMAP_BUILD.REQUEST );

        const { domain, sitemapIndex,userId, generatetype="Build Sitemap Button Click"} = request;
        const generateAt = new Date();
        
        try {
            if ( !domain ) {
                throw new Error( "watchBuildCloudXmlSitemap - Invalid domain provided." );
            }
            
            
            let jsonData = null;

            if (REACT_APP_MOCK === 'true') {
                jsonData = { data: {} };
            } else {
                let reqBody = { domain, sitemapIndex };
                if ( REACT_APP_CONNECT_TO_SERVERLESS_OFFLINE === "true" ) {
                    let response = yield fetch( `${REACT_APP_API_SITEMAP_BUILD_API_GATEWAY_URL}/build/buildSitemapTypes`, {
                        method: "POST",
                        body: JSON.stringify( reqBody )
                    } );

                    let responseObject = yield response.json();

                    if (typeof responseObject === "string") {
                        responseObject = JSON.parse(responseObject);
                    }


                    jsonData = JSON.parse( responseObject.body ).data;


                } else {
                    const apiCallConfig = {
                        body: { ...reqBody }
                    };
                    let user;
                    if(userId) {
                        user = userId
                    } else {
                        const userDetails = yield Auth.currentAuthenticatedUser()
                    }
                    
                    let responseObject = yield API.post("sitemap-build-api", "/build/buildSitemapTypes", apiCallConfig);
                    jsonData = JSON.parse(responseObject.body).data;   
                }
                
            }            
            yield put( cloudSitemapActions.buildCloudSitemap.success( jsonData ) );

        } catch (e) {
            yield put( cloudSitemapActions.buildCloudSitemap.error( e.message ) );
        }
    }
}

/***
 * Build Sitemap Index in Cloud
 * @returns {IterableIterator<<"TAKE", TakeEffectDescriptor>|<"PUT", PutEffectDescriptor<*>>>}
 */
function* watchBuildCloudXmlSitemapIndex() {
    while (true) {

        const { request } = yield take( cloudSitemapActions.CLOUD_SITEMAP_INDEX_BUILD.REQUEST );


        const { domain} = request;

        try {
            if ( !domain ) {
                throw new Error( "watchBuildCloudXmlSitemapIndex - Invalid domain provided." );
            }

            let jsonData = null;

            if ( REACT_APP_MOCK === 'true' ) {
                jsonData = { data: {} };
            } else {
                // reall call:

                let reqBody = { domain };
                if ( REACT_APP_CONNECT_TO_SERVERLESS_OFFLINE === "true" ) {
                    let response = yield fetch( `${REACT_APP_API_SITEMAP_BUILD_API_GATEWAY_URL}/build/buildSitemapTypes`, {
                        method: "POST",
                        body: JSON.stringify( reqBody )
                    } );

                    let responseObject = yield response.json();

                    if ( typeof responseObject === "string" ) {
                        responseObject = JSON.parse( responseObject );
                    }
                    jsonData = JSON.parse( responseObject.body ).data;


                } else {
                    const apiCallConfig = {
                        body: { ...reqBody }
                    };
                    let responseObject = yield API.post( "sitemap-build-api", "/build/buildSitemapTypes", apiCallConfig );
                    jsonData = JSON.parse( responseObject.body ).data;
                }
            }


            yield put( cloudSitemapActions.buildCloudSitemapIndex.success( jsonData ) );

        } catch (e) {
            yield put( cloudSitemapActions.buildCloudSitemapIndex.error( e.message ) );
        }
    }
}

function start() {
    return [
        fork( watchBuildCloudXmlSitemap ),
        fork( watchBuildCloudXmlSitemapIndex )
    ];
}

export default start();
