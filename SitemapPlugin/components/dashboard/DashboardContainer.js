// @flow
import { connect } from "react-redux";
import Component from "./DashboardComponent";
import * as actions from "./actions";
import * as userActions from "actions/user";
import * as startupActions from "actions/startup";
import * as settingsActions from "../settings/actions";
import * as paymentSuccessActions from '../settings/payment/actions';
import * as cloudSitemapActions from "actions/cloudSitemap";
import * as cloudSitemapStatusActions from "../../components/cloudSitemapStatus/actions";
import * as signInActions from "../signIn/actions";
import { wpApiCall } from "api/apiClient";
import Swal from "sweetalert2";
import * as createSiteAction from "components/signIn/actions"
/***
 * Returns the url of sitemap index file in cloud:
 * @param domain
 * @returns {string}
 */
const getS3SitemapIndexUrl = (domain, htmlSitemap) => {
    const sitemapFileName = htmlSitemap?.user?.activeSite?.settingsData?.sm_b_sitemap_name || htmlSitemap?.user?.activeSite?.settingsData?.data?.sm_b_sitemap_name || "index";
    const s3RootUrl = "https://1-bucket.s3.us-east-2.amazonaws.com";
    return s3RootUrl + "/hosts/" + domain + `/sitemap/${sitemapFileName}.xml`;
};

const mapStateToProps = state => {
    return {
        dashboard: state.dashboard,
        sitemapStatus: state.sitemapStatusSection,
        activeSite: state.user.activeSite,
        user: state.user,
        initialValues: state.settings.data,
        installationStatus: state.installation.status,
        installationFlow: state.installation.flow,
        S3SitemapIndexUrl: getS3SitemapIndexUrl(((state.user && state.user.activeSite && state.user.activeSite.hasOwnProperty('domain')) ? state.user.activeSite.domain : ''), state),
        settingsData: state.settings,
        cognitoToken:state.dashboard.cognitoToken
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getToken: data => {
            dispatch(actions.authGetToken.request(data));
        },
        setGoogleAuthToken: data => {
            dispatch(actions.setGoogleAuthToken.request(data));
        },
        setDateRange: data => {
            dispatch(actions.setDateRange.request(data));
        },
        generateSiteMap: data => {
            dispatch(actions.generateSiteMap.request(data));
        },
        getBingWebmasterData: data => {
            if (data.isBingApiAuthorized) {
                dispatch(actions.getBingWebmasterData.request(data));
            }
        },
        onSocialSignIn: values => {
            const data = {
                ...values,
                action: ownProps.history.push
            };
            dispatch(signInActions.socialSignIn.request(data));
        },
        getSite: data =>{
            dispatch(signInActions.getSite(data))
        },
        getGoogleWebmasterData: data => {
            if (data.isGoogleApiAuthorized) {
                dispatch(actions.getGoogleWebmasterData.request(data));
            }
        },
        setDomainsData: data => {
            dispatch(userActions.setDomainsData(data));
        },
        setActiveDomain: data => {

            dispatch(userActions.setActiveDomain(data));
        },
        getGoogleAnalyticsData: data => {
            if (data.isGoogleApiAuthorized) {
                dispatch(actions.getGoogleAnalyticsData.request(data));
            }
        },
        generateCloudSitemap: request => {
            const { domain } = request;

            dispatch(cloudSitemapActions.buildCloudSitemap.request(request));
            dispatch(cloudSitemapStatusActions.loadCloudSitemapStatus.request({ domain }));

            Swal.fire({
                icon: "success",
                text: "Your cloud sitemap is successfully submitted to cloud.  Please note that the process of transferring of sitemap data to cloud can take come time. ",
                showConfirmButton: true,
                confirmButtonText:
                    "<i class=\"fa fa-thumbs-up\"></i> Great!",
                timer: 5000
            });

        },
        generateCloudSitemapIndex: request => {
            dispatch(cloudSitemapActions.buildCloudSitemapIndex.request(request));

            Swal.fire({
                icon: "success",
                text: "Your cloud sitemap index is being rebuilt. It will be updated shortly! ",
                showConfirmButton: true,
                confirmButtonText:
                    "<i class=\"fa fa-thumbs-up\"></i> Great!",
                timer: 5000
            });

        },
        onViewCloudSitemapIndex: domain => {
            const indexUrl = getS3SitemapIndexUrl(domain);
            window.open(indexUrl, "_blank");
        },
        onViewWpSitemapIndex: async () => {
            const request = {
                relativeUrl: "GetWpXmlIndexUrl",
                method: "GET",
                data: null
            };
            try {
                let result = await wpApiCall(request);

                let { data } = result;

                window.open(data, "_blank");
            } catch {
                let redictUrl = `${ownProps.activeSite.protocol}://${ownProps.activeSite.domain}/sitemap.php?xml_sitemap=params=`
                window.open(redictUrl, "_blank");
            }
        },
        loadSubscriptionData: data => {
            dispatch(settingsActions.displaySubscriptionInfo.request(data));
        },
        getConfig(data) {
            dispatch(settingsActions.getConfig.request(data));
        },
        startLoadUserData: () => {
            dispatch(startupActions.loadUserAndDomainsData.request(null));
        },
        changeActiveDomain: data => {
            dispatch(userActions.setActiveDomain(data));
        },
        getCognitoToken: data => {
            dispatch(actions.getCognitoToken.request(data));
        },
        activateSite: data => {
            dispatch(paymentSuccessActions.activateSite.request(data));
        },
        setUserData: data => {
            dispatch(userActions.setUserData.success(data))
        },
        setIsAuthenticated: data => {
            dispatch(userActions.setIsauthenticated(data))
        },
        handleSettingsFormSubmit(formProps, props) {
            dispatch(settingsActions.setLicenceParams.request({
                domain: props.activeSite.domain,
                subscriptionType: props.activeSite.type,
                settings: formProps,
            }));
            if (formProps.sm_b_rew_robot) {
                dispatch(settingsActions.updateRobots.request({
                    url: props.activeSite.domain === "http://localhost" ? `${props.activeSite.domain}:8071` : props.activeSite.domain
                }));
            }
        },
        getPingInfo(type, domain, sitemapUrl){
            dispatch(actions.getPingInfo.request({ "type": type, "domain": domain, "sitemapUrl": sitemapUrl }))
        },
        notifySearchEnginesViaPings: (type, domain, sitemapUrl) => {
            dispatch(actions.notifySearchEnginesViaPings.request({ "type": type, "domain": domain, "sitemapUrl": sitemapUrl }));
        },
        checkCloudSitemapProgress: request => {
            dispatch(cloudSitemapStatusActions.loadCloudSitemapStatus.request(request));

        },
        createSite: data =>{
            dispatch(createSiteAction.createSite.request(data))
        },
        logout: () => {
            dispatch(userActions.logout());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
