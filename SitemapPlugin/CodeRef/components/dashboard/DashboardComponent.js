import React, { createRef, useState, useEffect } from "react";
import { GoogleApiHelper, BingApiHelper, Storage } from "helpers/index";
import WelcomeSection from "./fragments/welcomeSection/WelcomeSection";
import GoogleWebmasterSection from "./components/googleWebmasterSection";
import GoogleAnalyticsSection from "./components/googleAnalyticsSection";
import moment from "moment";
import { customLogger } from "logger";
import { BING_TOKENS } from "constants/index";
import BingWebmasterSection from "./components/bingWebmasterSection";
import SitemapStatusSection from "./components/sitemapStatusSection";
import withUser from "helpers/withUser";
import { AnchorBlock, TopPanel } from "common/components";
import { buttonsList } from "../../constants";
import { Auth } from "aws-amplify";
import "../../assets/css/Innerglobal.css";
import { withTranslation } from "react-i18next";
import "../../assets/css/index.css";
import "../../assets/scss/global.scss";
import styles from "./../settings/settings.module.scss";
import "./styling.scss";
import { MdClose } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import {
  isInsideWpAdmin,
  getParameterByName,
} from "../../helpers/installationFlowHelper";
import { getCloudSitemapIndexUrl } from "../../helpers/cloudSitemapsHelper";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { wpApiCall } from "api/apiClient";
import { cloudApiCall } from "../../api/apiClient";

const { REACT_APP_AUTOGENERATE_USER_FOR_QUICK_WP_UPGRADE } = process.env;

const DashboardComponent = (props) => {
  const state = useSelector((state) => state);
  const [sectionRefs, setSectionRefs] = useState({});
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [isBingAuthorized, setIsBingAuthorized] = useState(false);
  const [notifyClose, setNotifyClose] = useState(false);
  const [activeSiteType, setActiveSiteType] = useState("");
  const [siteInfoLoading, setSiteInfoLoading] = useState(false);
  const [readyApp, setReadyApp] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const [disablePluginModalOpen, setDisablePluginModalOpen] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(true);
  const [robotsErrorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const topFixedBlockRef = createRef();
  const {
    isAuthenticated,
    handleLogout,
    startLoadUserData,
    subscriptionType,
    generateCloudSitemap,
    generateCloudSitemapIndex,
    onViewCloudSitemapIndex,
    onViewWpSitemapIndex,
    notifySearchEnginesViaPings,
    checkCloudSitemapProgress,
    t,
  } = props;
  const getS3SitemapIndexUrl = (domain, htmlSitemap) => {
    customLogger(htmlSitemap?.user?.activeSite);
    const sitemapFileName =
      htmlSitemap?.user?.activeSite?.settingsData?.sm_b_sitemap_name ||
      htmlSitemap?.user?.activeSite?.settingsData?.data?.sm_b_sitemap_name ||
      "sitemap";
    const s3RootUrl = "https://1-bucket.s3.us-east-2.amazonaws.com";
    return s3RootUrl + "/hosts/" + domain + `/sitemap/${sitemapFileName}.xml`;
  };
  const {
    dashboard: { selectedDate, loaderToNotifyEngines, pingResponse },
    user,
  } = state;
  const { userData } = state.user;
  const sitemapStatus = state.sitemapStatusSection;
  const { activeSite } = state.user;
  const S3SitemapIndexUrl = getS3SitemapIndexUrl(
    state.user &&
      state.user.activeSite &&
      state.user.activeSite.hasOwnProperty("domain")
      ? state.user.activeSite.domain
      : "",
    state
  );
  const settingsData = state.settings;
  const { AIOSeoSMEnabled, yoastSMEnabled } = settingsData;
  const { cognitoToken } = state.dashboard;
  const { payment, paymentBraintree } = state;
  const onSubmitGenerateSiteMap = (event) => {
    event.preventDefault();
    props.generateSiteMap({ site: props.activeSite.domain });
  };
  function removeURLParameter(url, parameter) {
    var urlparts = url.split("?");
    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(parameter) + "=";
      var pars = urlparts[1].split(/[&;]/g);

      for (var i = pars.length; i-- > 0; ) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    return url;
  }
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  function isStringified(str) {
    try {
      return JSON.parse(str);
    } catch (err) {
      return str;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (
        props.user.isAuthenticated == true &&
        props.user.userData !== null &&
        props.user.sites.length == 0 &&
        !isInsideWpAdmin()
      ) {
        let redirect =
          window.location.href.indexOf("#") == -1 ? "/#/my-sites" : "/my-sites";
        history.push(redirect);
      }
    }, 10);
    checkGoogleAuth();
    if (props.activeSite && !isInsideWpAdmin()) {
      if (props.activeSite.type == "community" && props.user.sites.length > 1) {
        props.user.sites.map((ele) => {
          if (ele.domain == props.activeSite.domain) {
            if (ele.type == "premium" && props.activeSite.type == "community") {
              setTimeout(() => {
                props.changeActiveDomain(ele);
              }, 1000);
            }
          }
        });
      }
    }
    let domainData = window.localStorage.getItem("domainData");

    if (domainData !== undefined && domainData !== null)
      domainData = isStringified(domainData);
    if (
      props.user.isAuthenticated == true &&
      props.activeSite &&
      !isInsideWpAdmin()
    ) {
      if (domainData && domainData.domainOwnershipConfirmed == false) {
        history.push("/my-sites");
      }
    }

    if (
      props.user.isAuthenticated == true &&
      props.activeSite &&
      isInsideWpAdmin()
    ) {
      if (props.activeSite.type == "non-registered") {
        //this.props.history.push("/installation/cs/create-site/community");
      }
    }

    if (props.activeSite) {
      if (props.activeSite.type !== undefined) {
        if (activeSiteType !== props.activeSite.type) {
          setActiveSiteType(props.activeSite.type);
          props.activateSite(props.activeSite);

          if (props.user.isAuthenticated == false) {
            let data = { sm_license_params: {} };
            data.sm_license_params = {
              type: "COMMUNITY",
              purchaseDate: null,
              expirationDate: null,
            };
            props.handleSettingsFormSubmit(data, props);
          }
        }
      }
    }

    if (
      props.cognitoToken?.refreshToken &&
      window.localStorage.getItem("siteCreated") !== true &&
      (!domainData ||
        (domainData && !domainData.hasOwnProperty("domainOwnershipConfirmed")))
    ) {
      afterComponentLoaded();
    }
  }, [props]);

  // is this really needed here?
  const checkGoogleAuth = async () => {
    await GoogleApiHelper.isAuthorized()
      .then((res) => {
        setIsGoogleAuthorized(res);
      })
      .catch((e) => {
        setIsGoogleAuthorized(false);
      });
  };

  const onNoTokenFound = () => {
    if (props.isAuthenticated == true && localStorage.length < 8) {
      // Auth.signOut({global: false});
      // this.props.handleLogout();
    }
  };
  async function beforeComponentLoaded() {
    if (isInsideWpAdmin()) {
      const body = {
        apiStack: "",
        relativeUrl: "getAllSitemapPlugins",
        method: "GET",
      };
      let res = await wpApiCall(body);
      if (res.length > 0) {
        setDisablePluginModalOpen(true);
        const plugins = res.map((item) => {
          return item[0];
        });
        const name = res.map((item) => {
          return item[1];
        });
        setPluginsList(plugins);
        setPluginName(name);
      }
    }
    setReadyApp(false);
    setUserDetailsLoading(true);
    if (props.activeSite?.type === "premium") {
      await BingApiHelper.getToken();
    }
    let urlState = getParameterByName("state");
    const code = getParameterByName("code");

    if (code) {
      const tokens = await GoogleApiHelper.setTokens(code);
      if (urlState && urlState != null) {
        window.location.href = `${urlState}/#/dashboard?tokens=${JSON.stringify(
          tokens
        )}&state=${urlState}`;
      }
    }
    if (isInsideWpAdmin() == true) {
      let data = {
        domain: `${window.location.host}`,
        removeToken: false,
        action: () => onNoTokenFound(),
      };
      setTimeout(async () => {
        await props.getCognitoToken(data);
      }, 10);
      props.startLoadUserData();
    }
    if (
      window.localStorage.getItem("domainData") !== null &&
      window.localStorage.getItem("domainData") !== undefined &&
      typeof window.localStorage.getItem("domainData") !== "undefined"
    ) {
      let domainData = window.localStorage.getItem("domainData");
      props.changeActiveDomain(JSON.parse(domainData));
    }
    setUserAuthenticated(props.isAuthenticated);
    props.getConfig({ domain: activeSite?.domain });
    props.getPingInfo(
      activeSite?.type,
      activeSite?.domain,
      "S3SitemapIndexUrl"
    );
  }
  async function afterComponentLoaded() {
    setSectionRefs(getRefs());

    if (isInsideWpAdmin()) {
      let stringifiable = isStringified(
        window.localStorage.getItem("domainData")
      );
      if (
        window.localStorage.getItem("domainData") !== null &&
        window.localStorage.getItem("domainData") !== undefined &&
        typeof window.localStorage.getItem("domainData") !== "undefined" &&
        typeof stringifiable !== "string"
      ) {
        let domainData = window.localStorage.getItem("domainData");
        props.changeActiveDomain(JSON.parse(domainData));
      }
      let urlState = getParameterByName("state");
      const code = getParameterByName("code");

      if (code) {
        const tokens = await GoogleApiHelper.setTokens(code);
        if (urlState && urlState != null) {
          window.location.href = `${urlState}/#/dashboard?tokens=${JSON.stringify(
            tokens
          )}&state=${urlState}`;
        }
      }
      setTimeout(async () => {
        if (props.activeSite?.type === "premium") {
          checkCloudSitemapProgress({ domain: props.activeSite?.domain });
        }

        const userRes = await Auth.currentAuthenticatedUser().catch((err) =>
          customLogger("not authenticated", err)
        );

        customLogger(
          "cognito tokens[]:",
          props,
          props.cognitoToken,
          cognitoToken,
          userRes
        );
        if (
          cognitoToken?.refreshToken &&
          userRes !== null &&
          userRes !== undefined
        ) {
          (async () => {
            setTimeout(async () => {
              await props.setUserData(userRes);
              await props.setIsAuthenticated(true);
            }, 1);
            if (
              isInsideWpAdmin() &&
              props.activeSite !== null &&
              props.activeSite !== undefined &&
              props.activeSite.hasOwnProperty("domain")
            ) {
              let data = {};
              data.domainData = props.activeSite;
              data.handleLogout = props.handleLogout;
              data.settings = settingsData.data;
              await props.createSite(data);
            }
            window.localStorage.setItem("siteCreated", true);
            if (props.activeSite?.type === "premium") {
              checkCloudSitemapProgress({ domain: props.activeSite?.domain });
            }
          })();
          await setTimeout(() => {
            setUserDetailsLoading(false);
            setSiteInfoLoading(true);
          }, 2000);
        } else if (userRes !== null && userRes !== undefined) {
          if (props.activeSite?.type === "premium") {
            checkCloudSitemapProgress({ domain: props.activeSite?.domain });
          }
        }
        customLogger("activeSiteDomainWill2", props);
        let planType = "community";
        if (
          window.localStorage.getItem("selectedPlan") &&
          window.localStorage.getItem("selectedPlan").includes("premium")
        )
          planType = "premium";
        if (
          (planType === "premium" ||
            window.localStorage.getItem("targetPlan") === "premium") &&
          userRes &&
          activeSite?.type !== "premium" &&
          (payment.message === "" || paymentBraintree.message === "")
        )
          history.push("/payment-braintree");
      }, 2000);
    }
    try {
      const res = await Auth.currentAuthenticatedUser().catch((err) =>
        customLogger("not authenticated")
      );
      if (res !== null) {
        let bing = await BingApiHelper.isAuthorized();
        if (bing) {
          setIsBingAuthorized(bing);
        }
      }
    } catch (error) {
      setIsBingAuthorized(false);
      console.warn("error:", error);
    }

    // this.props.getBingWebmasterData({ site: this.props.activeSite.domain });
    try {
      const {
        data: { siteEntry },
      } = await GoogleApiHelper.getUserSitesList();
      setSitesList(siteEntry);
      setIndexingData(
        await GoogleApiHelper.getIndexingData(props.activeSite.domain)
      );
    } catch (e) {
      // TODO : errorHandler
    }
    if (!isInsideWpAdmin()) {
      setTimeout(async () => {
        const res = await Auth.currentAuthenticatedUser()
          .then(async (user) => {
            customLogger("socialuser>>>>", user);
            props.setUserData(user);
            props.setIsAuthenticated(true);
            let response = [];
            const request = {
              relativeUrl: "site/get-sites",
              apiStack: "",
              data: {},
              method: "GET",
            };
            response = await cloudApiCall(request);
            if (response) {
              customLogger("not inside wp response", response);
              let domainsData = [];
              if (Array.isArray(response.data)) {
                domainsData = response.data;
              } else {
                domainsData = [];
              }
              const existingDomains = domainsData;
              let siteSelected = props.activeSite;
              let rest = null;
              [siteSelected, rest] = domainsData;
              props.setDomainsData(existingDomains);
              if (props.activeSite.domain === undefined)
                props.setActiveDomain(siteSelected);
              window.localStorage.setItem(
                "domainData",
                JSON.stringify(siteSelected)
              );
            }
          })
          .catch((e) => customLogger("Not signed in", e));
        customLogger("reload", res);
      }, 2000);
    }
    if (props.activeSite) {
      const { loadSubscriptionData, activeSite, user } =
        props;
      setTimeout(async function () {
        let userEmail =
          user.userData?.attributes.email !== undefined
            ? user.userData.attributes.email
            : "";
        let userName =
          user.userData?.attributes.name !== undefined
            ? user.userData.attributes.name
            : "";
        if (isInsideWpAdmin() && userEmail !== "")
          await loadSubscriptionData({ activeSite, userEmail, userName });
        else {
          if (user.sites.length > 0 && activeSite?.domain !== undefined)
            await loadSubscriptionData({ activeSite, userEmail, userName });
        }
      }, 500);

      let setCookie = false;
      let cookieValue = document.cookie;
      if (cookieValue.indexOf("activeDomain") !== -1) {
        cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("activeDomain"))
          .split("=")[1];
        setCookie = true;
      }
      if (setCookie == true && props.user.sites.length > 1) {
        let setDomain = false;
        let index = 0;

        await props.user.sites.map((ele, i) => {
          if (ele.domain == JSON.parse(cookieValue).domain) {
            setDomain = true;
            cookieValue =
              ele.type == "premium" &&
              JSON.parse(cookieValue).type == "community"
                ? JSON.stringify(ele)
                : cookieValue;
            index = i;
          }
        });
        const { changeActiveDomain } = props;
        if (setDomain == true && !isInsideWpAdmin()) {
          customLogger("cookie value", JSON.parse(cookieValue));
        }
      }
    }
    const { loadSubscriptionData, activeSite, user } = props;
    if (activeSite?.domain !== undefined) {
      setTimeout(function () {
        let userEmail =
          user.userData?.attributes.email !== undefined
            ? user.userData.attributes.email
            : "";
        let userName =
          user.userData?.attributes.name !== undefined
            ? user.userData.attributes.name
            : "";
        loadSubscriptionData({ activeSite, userEmail, userName });
      }, 500);
    }
    if (
      window.localStorage.getItem("amplify-signin-with-hostedUI") == "false"
    ) {
      let data = {};
      let domainInfo = window.localStorage.getItem("domainData");
      domainInfo = isStringified(domainInfo);
      data.domainData = domainInfo;
      data.handleLogout = props.handleLogout;

      data.settings = settingsData.data;
      await props.createSite(data);
    }
    await Auth.currentAuthenticatedUser()
      .then(async (user) => {
        let domainData = window.localStorage.getItem("domainData");
        domainData = isStringified(domainData);
        if (domainData?.type === "premium" && isInsideWpAdmin()) {
          const req = {
            relativeUrl: "update_robots",
            method: "POST",
            data: {
              url:
                domainData?.type === "premium"
                  ? getCloudSitemapIndexUrl(domainData?.domain)
                  : `https://${domainData?.domain}/sitemap.xml`,
            },
          };
          const resp = await wpApiCall(req);
          if (resp.success !== "true" || resp.success !== true) {
            setErrorMessage("");
            if (resp.message === "File robots.txt doesn't exists") {
              const request = {
                relativeUrl: "saveCloudSitemapsMode",
                method: "POST",
                data: {
                  enabled: domainData?.type === "premium" ? true : false,
                  cloud_index_url:
                    domainData?.type === "premium"
                      ? getCloudSitemapIndexUrl(domainData?.domain)
                      : "",
                },
              };
              const res = await wpApiCall(request);
            } else {
              setErrorMessage(resp?.message);
            }
          }
          const eleye = document.querySelectorAll(".wp-has-submenu");
          eleye.forEach(function (item) {
            let menuName = item.querySelector(".wp-menu-name");
            if (menuName.innerHTML == "Sitemaps") {
              let ul = item.querySelector(".wp-submenu-wrap");
              if (ul !== null) {
                if (ul.lastChild.firstChild.innerHTML === "Upgrade to Premium")
                  ul.lastChild.remove();
              }
            }
          });
        }
        setTimeout(() => {
          setReadyApp(true);
          setSiteInfoLoading(true);
          setUserDetailsLoading(false);
        }, 2000);
      })
      .catch((err) => customLogger("not signed in", err));
  }

  useEffect(() => {
    async function componentsMount() {
      await beforeComponentLoaded();
      await sleep(1000);
      setReadyApp(true);
      await afterComponentLoaded();
    }
    componentsMount();
  }, []);

  const signInWithGoogleError = () => {
    window.localStorage.removeItem("siteAlreadyExists");
    const url = removeURLParameter(window.location.href, "errorCode");
    window.location.href = url;
  };
  const toggle = () => {
    setErrorMessage("");
    setShowPaymentError(false);
    window.localStorage.removeItem("selectedPlan");
    window.localStorage.removeItem("targetPlan");
  };
  async function enableAutoUpdate(request) {
    const reqbody = {
      apiStack: "",
      relativeUrl: "enableAutoUpdates",
      method: "POST",
      data: {
        enable_auto_update: request,
      },
    };
    await wpApiCall(reqbody);
    window.location.reload();
  }
  const handleGetPremium = (isAuthenticated) => {
    if (isAuthenticated === true) {
      history.push("/payment-braintree");
    } else {
      if (isInsideWpAdmin()) {
        history.push("/installation/cs/select-plan");
      } else {
        history.push("/installation/app/select-plan");
      }
    }
  };

  const onPressButton = (page, type = "navigate") => {
    if (type === "navigate") {
      history.push("/" + page);
    }
  };

  const getRefs = () => {
    return buttonsList.reduce((acc, value) => {
      acc[value.id] = createRef();
      return acc;
    }, {});
  };

  const performHandleQuickUpgradeClick = () => {
    if (!isInsideWpAdmin()) {
      alert("This feature works only inside wp-admin");
      return false;
    }

    const { history } = props;

    if (REACT_APP_AUTOGENERATE_USER_FOR_QUICK_WP_UPGRADE === "true") {
      alert(
        "Note: Rect app is running locally, so the test user will be automatically generated now."
      );
      history.push("/payment-braintree");
    } else {
      history.push("/installation/cs/select-plan");
    }
  };

  const handleClick = (id) => {
    window.scrollTo({
      top:
        sectionRefs[id].current &&
        topFixedBlockRef.current &&
        sectionRefs[id].current.offsetTop -
          topFixedBlockRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  const onDatesChange = async (startDate, endDate) => {
    props.setDateRange({ date: { startDate, endDate } });
    if (isGoogleApiAuthorized) {
      await props.getGoogleWebmasterData({
        isGoogleApiAuthorized: isGoogleAuthorized,
        siteUrl: props.activeSite && props.activeSite.domain,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
        rowLimit: 2000,
        startRow: 0,
        dimensions: ["page"],
      });
      await props.getGoogleAnalyticsData({
        isGoogleApiAuthorized: isGoogleApiAuthorized,
        siteUrl: props.activeSite && props.activeSite.domain,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });
    }
    const res = await Auth.currentAuthenticatedUser().catch((err) =>
      customLogger("not authenticated")
    );
    if (res !== null) {
      let bing = BingApiHelper.isAuthorized();
      if (bing) {
        const tokens = Storage.getItem(BING_TOKENS);
        if (tokens && tokens.access_token) {
          await props.getBingWebmasterData({
            isBingApiAuthorized: bing,
            site: props.activeSite && props.activeSite.domain,
            key: tokens.access_token,
            api: ["GetCrawlStats", "GetQueryStats"],
            selectedDate: {
              startDate: moment(startDate).format("YYYY-MM-DD"),
              endDate: moment(endDate).format("YYYY-MM-DD"),
            },
          });
        }
      }
    }
  };
  const closeNotify = () => {
    setNotifyClose(true);
  };

  const isPremium = subscriptionType === "premium"; // todo refactor to use enum
  let hasActivatedSite =
    activeSite == null
      ? false
      : activeSite.type !== undefined && activeSite.type == "non-registered"
      ? false
      : activeSite.status !== undefined && activeSite.status !== "Active"
      ? false
      : true;
  if (window.localStorage.getItem("createSiteError")) {
    setTimeout(() => {
      props.handleLogout();
      props.logout();
    }, 2000);
    setTimeout(() => {
      startLoadUserData();
    }, 7000);
  }
  let readyAppLoading = readyApp == false;
  let siteInfoLoaded =
    isInsideWpAdmin() === true && userData !== null && siteInfoLoading == false;
  let userDetailsLoaded =
    isInsideWpAdmin() === true &&
    userData !== null &&
    userDetailsLoading == true;
  if (!activeSite || !activeSite.type) {
    if (isInsideWpAdmin() === true) {
      return (
        <div className="App">
          <div className="fixed" ref={topFixedBlockRef}>
            <TopPanel
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              readyAppLoading={readyAppLoading}
              siteInfoLoaded={siteInfoLoaded}
              userDetailsLoaded={userDetailsLoaded}
            />
          </div>
          <div>{t("Site information loading... Please wait...")}</div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="fixed" ref={topFixedBlockRef}>
            <TopPanel
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              readyAppLoading={readyAppLoading}
              siteInfoLoaded={siteInfoLoaded}
              userDetailsLoaded={userDetailsLoaded}
            />
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="App">
        <div className="fixed" ref={topFixedBlockRef}>
          <TopPanel
            isAuthenticated={isAuthenticated}
            loading={readyAppLoading}
            handleLogout={handleLogout}
          />
          <AnchorBlock className="AnchorBlock" handleClick={handleClick}>
            {buttonsList.map((item, i) => {
              return (
                <button key={i} type="button">
                  {t(item.name)}
                </button>
              );
            })}
          </AnchorBlock>
          {isInsideWpAdmin() &&
            readyAppLoading == false &&
            (AIOSeoSMEnabled === true || yoastSMEnabled === true) && (
              <div className={`d-block w-100 plugin_list`}>
                <div
                  className="sgp--installation-status-notification__inner alert warning"
                  style={{ margin: " 10px 15px", display: "block" }}
                >
                  <div className={` w-100 ${styles["modal-footer-box"]}`}>
                    <IoMdAlert />
                    {t("There are other sitemap plugins available.")}{" "}
                    {t("Do you want to disable them?")}
                  </div>
                </div>
              </div>
            )}
          {isInsideWpAdmin() &&
            settingsData.autoUpdateBannerInteraction === 0 &&
            readyAppLoading == false && (
              <div className={`d-block w-100 plugin_list`}>
                <div
                  className="sgp--installation-status-notification__inner alert warning"
                  style={{ margin: " 10px 15px" }}
                >
                  <IoMdAlert />

                  <div className={` w-100 ${styles["modal-footer-box"]}`}>
                    {t(
                      "Auto-updates are not enabled for Sitemap Generator. Would you like to enable auto-updates to always have the best indexation features?"
                    )}
                  </div>
                  <button
                    className="btn btn-primary disable_em_all"
                    style={{ width: "180px", height: "45px" }}
                    onClick={() => enableAutoUpdate("yes")}
                  >
                    {t("Enable")}
                  </button>
                  <MdClose
                    className="cross_cancel"
                    style={{
                      cursor: "pointer",
                      marginLeft: "15px",
                      marginRight: "15px",
                    }}
                    onClick={() => enableAutoUpdate("no")}
                  />
                </div>
              </div>
            )}
          {isInsideWpAdmin() &&
            (window.localStorage.getItem("siteAlreadyExists") == "true" ||
              window.localStorage.getItem("siteAlreadyExists") == true) &&
            (window.localStorage.getItem("signInFromGoogle") == "true" ||
              window.localStorage.getItem("signInFromGoogle") == true) && (
              <div className={`d-block w-100 plugin_list`}>
                <div
                  className="sgp--installation-status-notification__inner alert danger"
                  style={{ margin: " 10px 15px" }}
                >
                  <IoMdAlert />

                  <div className={` w-100 ${styles["modal-footer-box"]}`}>
                    {t("Site attached with another user.")}
                  </div>

                  <MdClose
                    className="cross_cancel"
                    style={{
                      cursor: "pointer",
                      marginLeft: "15px",
                      marginRight: "15px",
                    }}
                    onClick={() => signInWithGoogleError()}
                  />
                </div>
              </div>
            )}
          {(payment.message !== "" || paymentBraintree.message !== "") &&
            showPaymentError &&
            !isPremium && (
              <div className={`d-block w-100 plugin_list`}>
                <div
                  className="sgp--installation-status-notification__inner alert danger"
                  style={{ margin: " 10px 15px" }}
                >
                  <IoMdAlert />

                  <div className={` w-100 ${styles["modal-footer-box"]}`}>
                    {t("Payment failed! please try again after some time.")}
                  </div>

                  <MdClose
                    className="cross_cancel"
                    style={{
                      cursor: "pointer",
                      marginLeft: "15px",
                      marginRight: "15px",
                    }}
                    onClick={() => toggle()}
                  />
                </div>
              </div>
            )}
          {robotsErrorMessage !== "" && robotsErrorMessage !== undefined && (
            <div className={`d-block w-100 plugin_list`}>
              <div
                className="sgp--installation-status-notification__inner alert warning"
                style={{ margin: " 10px 15px" }}
              >
                <IoMdAlert />

                <div className={` w-100 ${styles["modal-footer-box"]}`}>
                  {robotsErrorMessage}.{" "}
                  {t(
                    "We do not have Permission to update physical robots.txt file. Change sitemap url in robots.txt file by yourself."
                  )}
                </div>

                <MdClose
                  className="cross_cancel"
                  style={{
                    cursor: "pointer",
                    marginLeft: "15px",
                    marginRight: "15px",
                  }}
                  onClick={() => toggle()}
                />
              </div>
            </div>
          )}
        </div>

        <div className="section-wrapper">
          <WelcomeSection
            id="section-1"
            readyAppLoading={readyAppLoading}
            siteInfoLoaded={siteInfoLoaded}
            userDetailsLoaded={userDetailsLoaded}
            className="welcome-section-wrapper"
            ref={sectionRefs[0]}
            sitemapStatus={sitemapStatus}
            onSubmitGenerateSiteMap={(e) => onSubmitGenerateSiteMap(e)}
            action={handleGetPremium}
            onPressButton={onPressButton}
            user={user}
            userData={userData}
            onDatesChange={onDatesChange}
            isPremium={isPremium}
            selectedDate={selectedDate}
            isAuthenticated={isAuthenticated}
            isGoogleAuthorized={isGoogleAuthorized}
            isBingAuthorized={isBingAuthorized}
            onGenerateCloudSitemap={generateCloudSitemap}
            onGenerateCloudSitemapIndex={generateCloudSitemapIndex}
            onViewCloudSitemapIndex={onViewCloudSitemapIndex}
            onViewWpSitemapIndex={onViewWpSitemapIndex}
            S3SitemapIndexUrl={S3SitemapIndexUrl}
            activeSite={activeSite}
            close={notifyClose}
            notifyClose={closeNotify}
            hasActivatedSite={hasActivatedSite}
            performHandleQuickUpgradeClick={performHandleQuickUpgradeClick}
            history={props.history}
            onNotifySearchEnginesViaPings={notifySearchEnginesViaPings}
            loaderToNotifyEngines={loaderToNotifyEngines}
            pingResponse={pingResponse}
            settingsData={settingsData}
            onCheckCloudSitemapProgress={checkCloudSitemapProgress}
          />

          <GoogleAnalyticsSection
            readyAppLoading={readyAppLoading}
            siteInfoLoaded={siteInfoLoaded}
            userDetailsLoaded={userDetailsLoaded}
            id="section-2"
            isAuthenticated={isAuthenticated}
            handleGetPremium={handleGetPremium}
            ref={sectionRefs[1]}
            selectedDate={selectedDate}
            isPremium={isPremium}
            isGoogleAuthorized={isGoogleAuthorized}
            hasActivatedSite={hasActivatedSite}
          />

          <GoogleWebmasterSection
            readyAppLoading={readyAppLoading}
            siteInfoLoaded={siteInfoLoaded}
            userDetailsLoaded={userDetailsLoaded}
            isAuthenticated={isAuthenticated}
            handleGetPremium={handleGetPremium}
            selectedDate={selectedDate}
            isPremium={isPremium}
            isGoogleAuthorized={isGoogleAuthorized}
            hasActivatedSite={hasActivatedSite}
          />

          <BingWebmasterSection
            readyAppLoading={readyAppLoading}
            siteInfoLoaded={siteInfoLoaded}
            userDetailsLoaded={userDetailsLoaded}
            id="section-3"
            selectedDate={selectedDate}
            ref={sectionRefs[2]}
            hasActivatedSite={hasActivatedSite}
            isAuthenticated={isAuthenticated}
            handleGetPremium={handleGetPremium}
            isPremium={isPremium}
            isBingAuthorized={isBingAuthorized}
          />

          <SitemapStatusSection
            readyAppLoading={readyAppLoading}
            siteInfoLoaded={siteInfoLoaded}
            userDetailsLoaded={userDetailsLoaded}
            id="section-4"
            selectedDate={selectedDate}
            isAuthenticated={isAuthenticated}
            handleGetPremium={handleGetPremium}
            ref={sectionRefs[3]}
            isPremium={isPremium}
            isGoogleAuthorized={isGoogleAuthorized}
            hasActivatedSite={hasActivatedSite}
          />
        </div>
      </div>
    );
  }
};

export default withUser(withTranslation()(DashboardComponent));
