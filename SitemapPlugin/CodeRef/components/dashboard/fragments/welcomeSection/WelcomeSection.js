//@flow

import React from "react";
import { Heading, CardStatistic, ButtonPrimary } from "common/components";
import { GoogleIcon, BingIcon, CheckIcon, ExclamationIcon } from "../../../../assets/icons";
import moment from "moment";
import DateRangeComponent from "../../../../common/components/heading/DateRangeComponent/DateRange";
import { withTranslation } from "react-i18next";
import { customLogger } from 'logger';
import {
  isInsideWpAdmin
} from "../../../../helpers/installationFlowHelper";
import "../../../../assets/scss/global.scss";
import styles from "./welcomeSection.module.scss";
import InstallationStatusNotification from "../../../installation/installationStatusNotification";
import CloudSitemapStatusComponent from "../../../cloudSitemapStatus";
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton'


const WelcomeSection = props => {
  const state = useSelector(state=>state)
  const {
    user,
    history,
    onDatesChange,
    selectedDate,
    isGoogleAuthorized,
    onGenerateCloudSitemap,
    className,
    myRef,
    id,
    S3SitemapIndexUrl,
    performHandleQuickUpgradeClick,
    onNotifySearchEnginesViaPings,
    loaderToNotifyEngines,
    pingResponse,
    settingsData,
    onCheckCloudSitemapProgress,
    t
  } = props;
  let { activeSite, isPremium } = props
  const { domain = ""} = activeSite || {}
  let lastPingDuration = ""
  customLogger("activeSite.lastPing: ", activeSite?.lastPing)
  const userState = state.user
    // Let's not look out for last ping time when a notification ping is in progress
  if(loaderToNotifyEngines == false) { 
    if (pingResponse && pingResponse.response && pingResponse.response.lastPing && typeof pingResponse.response.lastPing!=='boolean' && pingResponse.response.lastPing!==0) {
      customLogger("!!OK pingResponse: ", pingResponse.response.lastPing);
      lastPingDuration = moment.unix(pingResponse.response.lastPing).fromNow()
    } else if (pingResponse && pingResponse.response && pingResponse.response.data && typeof pingResponse.response.data!=='boolean' && pingResponse.response.data!==0) {
      lastPingDuration = moment.unix(pingResponse.response.data).fromNow()
    } else if (typeof activeSite?.lastPing != "undefined" && typeof activeSite?.lastPing != "boolean" && activeSite?.lastPing!==0) {
      lastPingDuration = moment.unix(activeSite.lastPing).fromNow()
    } else if (settingsData && settingsData.data && settingsData.data.sm_i_lastping && typeof settingsData.data.sm_i_lastping != "boolean" && settingsData.data.sm_i_lastping!==0) {
      lastPingDuration = moment.unix(settingsData.data.sm_i_lastping).fromNow()
    }
  }
  
  customLogger("OK!! activeSite: ", activeSite);
  customLogger("OK!! pingResponse: ", pingResponse.response);
  customLogger("OK!! loaderToNotifyEngines: ", loaderToNotifyEngines);
  customLogger("OK!! lastPingDuration: ", lastPingDuration);
  customLogger("OK!! settingsData: ", settingsData);

  let smUrl = '';
  if ( settingsData?.s3SmUrl !== '' && settingsData?.s3SmUrl !== undefined && settingsData?.s3SmUrl !== false) {
    smUrl = settingsData?.s3SmUrl
  } else if(settingsData.data.sm_b_baseurl !== "") {
    smUrl = settingsData.data.sm_b_baseurl + `/${settingsData.data.sm_b_sitemap_name}.xml`
  } else if ( settingsData.prettyPermalinkUsed === true) {

    smUrl = activeSite.protocol + `://` + activeSite.domain + `/${settingsData.data.sm_b_sitemap_name}.xml`
  } else {
    smUrl = activeSite.protocol + `://` + activeSite.domain + `/sitemap.php?xml_sitemap=params=`
  }
  // I need to trigger an event which can be reused
  // First use case: Premium subscription has been purchased and user lands on dashboard. I want them to see sitemap building message and that should disappear by a set timeout event which will periodically check for changes in cloud sitemap status
  // Second use case: If someone changes the settings and lands on this page
  // Third use case: if someone taps build sitemaps button

  let cloudSitemapCheckIntervalId;

  if((user?.cloudSitemapStatus?.status != "completed" && user?.cloudSitemapStatus?.status != "unknown")) {
    cloudSitemapCheckIntervalId = setInterval(function() {
      customLogger("OK!!!!! domain", domain);

      customLogger("Lets trigger progress", user?.cloudSitemapStatus?.status);
      onCheckCloudSitemapProgress({domain: domain});
    }, 60000);
  }
  
  customLogger("user.cloudSitemapStatus.status", user?.cloudSitemapStatus?.status, cloudSitemapCheckIntervalId);
  
  if(user?.cloudSitemapStatus?.status == "completed" && user?.cloudSitemapStatus?.status != "unknown") {
    clearInterval(cloudSitemapCheckIntervalId);
  }

  let sitemapTotalEntries = 0
  let totalSitemaps = 0
  if(isInsideWpAdmin()){
    totalSitemaps = settingsData?.sitemapCounters && settingsData?.sitemapCounters
  } else {
    totalSitemaps = props.user.cloudSitemapStatus.sitemapUnitsCount
  }
  if(typeof settingsData.sitemapCounters != "undefined") {
    customLogger("OK!! settingsData.sitemapCounters: ", settingsData.sitemapCounters);
    sitemapTotalEntries = settingsData.sitemapCounters;
  }
  if (typeof activeSite.sitemapData != "undefined") {
    sitemapTotalEntries = activeSite.sitemapData.length
  }

  if (typeof user?.cloudSitemapStatus?.processedSitemapUnits != "undefined") {
    sitemapTotalEntries = user?.cloudSitemapStatus?.processedSitemapUnits < 0 ? 0 : user?.cloudSitemapStatus?.processedSitemapUnits
  }
  customLogger("OK!! isPremium: ", isPremium);

  
  let propsLoading = (props.readyAppLoading || props.siteInfoLoaded || props.userDetailsLoaded)
  return (
    <div className={className} id={id} ref={myRef}>
      <div className={` bg-white header-shadow  ${styles["welcome-top"]} ${styles["welcome-section"]}`}>
        {activeSite && activeSite.type == "community" && activeSite.isUserInformed !== undefined && activeSite.isUserInformed == true &&
          <div className="alert alert-danger">
            <div>
              {t("Your account is downgraded to community")}.
          </div>
            <div className="float-right" style={{ marginTop: '-28px' }}>
              <ButtonPrimary buttonText="Upgrade to premium" buttonSize="sm"
                action={() => history.push('/payment-braintree')} />
            </div>
          </div>
        }
        <div className={"sgp--custom-alert"}>
          <InstallationStatusNotification hide={false}
            performHandleQuickUpgradeClick={performHandleQuickUpgradeClick} />
        </div>
        {propsLoading === true
        ?
        <Skeleton width='90%' height={70} style={{marginLeft:'5%'}} /> 
        :
        <div className={` ${styles["overview-wrapper"]} d-flex align-items-center justify-content-between`}>
          <div>
            <div className={`  ${styles["overview-title"]} `}>
              <Heading
                title={t("Sitemap Overview")}
                onDatesChange={props.onDatesChange}
                selectedDate={selectedDate}
                isGoogleAuthorized={isGoogleAuthorized}
                page={"dashboard"}
                /></div>

              
            {isPremium && user && user.cloudSitemapStatus && user.cloudSitemapStatus.status == "completed" && (
              <p className={`  ${styles["sub-title"]}  `}>
                {t("Sitemap index file")}: <a id="sitemap-url-href" rel="noopener noreferrer" target="_blank" href={S3SitemapIndexUrl}>{S3SitemapIndexUrl}</a>
              </p>
            )}
            {isPremium && user && user.cloudSitemapStatus && user.cloudSitemapStatus.status != "completed" && user.cloudSitemapStatus.status != "unknown" && (
              <p className={`  ${styles["sub-title"]}  `}>
                {t('Your sitemap is building')}...
              </p>
            )}
            {!isPremium && (
              <p className={`  ${styles["sub-title"]}  `}>
                {t("Sitemap index file")}: <a id="sitemap-url-href" rel="noopener noreferrer" target="_blank" href={smUrl}>{smUrl}</a>
              </p>
            )}
          </div>
          {isPremium && window.localStorage.getItem('subscriptionCancelled') !== true && (
            <div
              className={` ${styles['content-right']}  d-flex justify-content-end float-right `}>
              {isGoogleAuthorized == true &&
                <div className="mr-3">
                  <DateRangeComponent
                    selectedDate={selectedDate}
                    onDatesChange={onDatesChange}
                  />
                </div>
              }
              <ButtonPrimary 
                disabled={isPremium && user && user.cloudSitemapStatus && user.cloudSitemapStatus.status != "completed" && user.cloudSitemapStatus.status != "unknown"}
                class={'build_sitemap_button'}
                buttonText={t("Build Sitemaps")} buttonSize="large" action={() => onGenerateCloudSitemap({ sitemapIndex : activeSite.protocol + `://` + activeSite.domain + `/sitemap.xml`, domain : activeSite.domain,userId:user.userData.username ,generatetype:'Build Sitemap Button Click'})} />
            </div>
          )}
        </div>
      }
        <div className={`${styles["statistic-list"]} statistic-list row row-with-4-col`}>
          {propsLoading === true ? 
          <div className={` col  statistic-item text-center `}>
            <Skeleton height={40} />
            </div>:
          <div className={` col  statistic-item text-center `}>
            <CardStatistic heading={lastPingDuration} subtitle={t("Last Ping")} />
            <a href='javascript:void(0)' id="ping_google" onClick={() => onNotifySearchEnginesViaPings(activeSite.type, activeSite.domain, S3SitemapIndexUrl)} >{loaderToNotifyEngines === true ? t("Notifying")+"..." : t("Notify Search Engines")}</a>
          </div>
          }
          {isPremium && activeSite.type != "non-registered" && (
             propsLoading === true 
             ?
             <div className={`col statistic-item text-center ${styles["active-icon"]}`} id="sitemap-count-wrapper">
               <Skeleton height={40} />
               </div>
               :
              (isPremium && user && user.cloudSitemapStatus && user.cloudSitemapStatus.status != "completed" && user.cloudSitemapStatus.status != "unknown") ?
              <div className={`col statistic-item text-center ${styles["active-icon"]}`} id="sitemap-count-wrapper">
              <CardStatistic heading={`${sitemapTotalEntries} / ${totalSitemaps}`} withIcon={true} subtitle={t('Cloud Sitemaps')} label={true} labelConfig="active" labelIcon={<CheckIcon />} />
              <CloudSitemapStatusComponent styles={styles} />
            </div>
              :
            <div className={`col statistic-item text-center ${styles["active-icon"]}`} id="sitemap-count-wrapper">
              <CardStatistic heading={`${sitemapTotalEntries}`} withIcon={true} subtitle={t('Cloud Sitemaps')} label={true} labelConfig="active" labelIcon={<CheckIcon />} />
              <CloudSitemapStatusComponent styles={styles} />
            </div>
          )}
          { (!isPremium || activeSite.type == "non-registered") && (
            propsLoading === true 
            ?
            <div className={`col statistic-item text-center ${styles["active-icon"]}`} id="sitemap-count-wrapper">
              <Skeleton height={40} />
              </div>
              :
            <div className={`col statistic-item text-center ${styles["active-icon"]}`} id="sitemap-count-wrapper">
              <CardStatistic heading={`${sitemapTotalEntries}`} withIcon={true} subtitle={t("Sitemaps")} label={true} labelConfig="active" labelIcon={<CheckIcon />} />
              <CloudSitemapStatusComponent styles={styles} />
            </div>
          )}

          {propsLoading === true
          ?
          <div className={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? `col statistic-item ${styles["active-icon"]} ` : `col statistic-item ${styles["exclamation-icon"]} `}>
            <Skeleton height={40} /></div>
            :
          <div className={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? `col statistic-item ${styles["active-icon"]} ` : `col statistic-item ${styles["exclamation-icon"]} `}>
            <CardStatistic heading={<GoogleIcon />} withIcon={true} subtitle={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? t("Google Notified") : t("Unable to Notify")} label={true} labelConfig="active" labelIcon={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? <CheckIcon /> : <ExclamationIcon />} />
          </div>
          }
          {propsLoading === true
          ?
          <div className={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? `col statistic-item ${styles["active-icon"]} ` : `col statistic-item ${styles["exclamation-icon"]} `}>
            <Skeleton height={40} />
            </div>
            :
          <div className={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? `col statistic-item ${styles["active-icon"]} ` : `col statistic-item ${styles["exclamation-icon"]} `}>
            <CardStatistic heading={<BingIcon />} withIcon={true} subtitle={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? t("Bing Notified") : t("Unable to Notify")} label={true} labelConfig="active" labelIcon={(typeof lastPingDuration != "undefined" && (typeof pingResponse.response.status == "undefined" || pingResponse.response.status == 1)) ? <CheckIcon /> : <ExclamationIcon />} />
          </div>
          }
        </div>
      </div>

      {
        (pingResponse['response'].status == 0 || pingResponse['response'] == null) && (
          <div className={` ${styles["warning-section"]}  `}>
            <div className={`  ${styles["warning-content"]} d-flex `}>
              <div className={`${styles["exclamation-icon"]} `}> <ExclamationIcon /></div>
              <div className={`  ${styles["warning-sub-content"]}`}>
                <h4>{t("There was a problem while notifiying Google and Bing.")}</h4>
                <p>{t("The section below should give you an idea of what is going on.")}</p>
                <strong>{t("Ping Test")}</strong>
                <p>{t("Trying to ping")}: <a rel="noopener noreferrer" href={`${pingResponse['response'].data.googleURL}`} target="_blank">{`${pingResponse['response'].data.googleURL}`}</a></p>
                <p>{t("Trying to ping")}: <a rel="noopener noreferrer" href={`${pingResponse['response'].data.bingURL}`} target="_blank">{`${pingResponse['response'].data.bingURL}`}</a></p>
                <strong>{t("Errors, Warnings Notices")}</strong>
                <p>{t("WP_DEBUG was set to false somewhere before. You might not see all debug information until you remove this declaration!")}</p>
                <strong>{t("Result (text only)")}</strong>
                <p>{t("Bad Request Bad Request Error 400")}</p>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default  withTranslation()(WelcomeSection);
