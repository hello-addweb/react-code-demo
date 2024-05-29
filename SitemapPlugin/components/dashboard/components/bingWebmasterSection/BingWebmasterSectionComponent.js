//@flow

import React, { Component } from "react";
import {
    SectionHeading,
    DataIsLoading,
    CompleteSetup,
    SeeMore,
} from "common/components";
import { withTranslation } from "react-i18next";

//styles 
import "../../../../assets/scss/global.scss";
import "../../../../assets/scss/settings.scss";
import styles from "./../googleWebmasterSection/section.module.scss";
import { ChartDropdown, ChartLegend, LineChart } from "common/components";
import { API } from "aws-amplify/lib/index";
import { isEmpty } from "lodash";
import { BingApiHelper, Storage } from "helpers/index";
import SectionHeader from "components/dashboard/fragments/sectionHeader/SectionHeader";
import { BING_TOKENS } from "constants/index";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Skeleton from "react-loading-skeleton";

const BingWebmasterSectionComponent = props => {
    const state = useSelector(state=>state)
    const { hasActivatedSite, isAuthenticated, handleGetPremium, isPremium,  t } = props;
    const {bingWebmasterSection: { crawlState, loading, headerData }} = state
    const {activeSite} = state.user
    const [isBingAuthorized, setIsBingAuthorized] = useState( props.isBingAuthorized)
    const [selectedGraph, setSelectedGraph] = useState( 'Pages Crawled')
    const [selectedDate, setSelectedDate] = useState( props.selectedDate)
    const [rankAndTrafficStats, setRankAndTrafficStats] = useState( null)
    const onSelectGraph = type => {
        setSelectedGraph(type)
    }
    let propsLoading = (props.readyAppLoading || props.siteInfoLoaded || props.userDetailsLoaded)

    const authorize = () => window.location.replace(BingApiHelper.getAuthUrl());
    useEffect(()=>{

            try {
                if (props.isBingAuthorized) {
                    const tokens = Storage.getItem(BING_TOKENS);
                    props.getBingWebmasterData({
                        isBingApiAuthorized: isBingAuthorized,
                        site: "http://wp-dev-env-1545.space/",
                        key: tokens.access_token,
                        api: ["GetCrawlStats", "GetQueryStats"],
                        selectedDate: props.selectedDate
                    });
                    setIsBingAuthorized(true)
                } else {
                    setIsBingAuthorized(false)
                }
            } catch (error) {
                setIsBingAuthorized(false)
                console.warn("error:", error);
            } 
        
    },[])
        const isAllowChart = isPremium && isAuthenticated && hasActivatedSite;
        const chartDropdownConfig = [
            { title: t("Pages Crawled") },
            { title: t("Clicks") }
        ];
        return (
            <div id={props.id} className={`${styles["section-wrapper"]} bing-webmaster`} ref={props.myRef}>
                {propsLoading === true ? <Skeleton height={40} width='30%'/>: <SectionHeading title={t("Bing Webmaster")} />}
                { propsLoading === true ?
                <div className={`${styles["section"]} ${styles["border-radius"]} bg-white with-shadow bing-section `}>
                        <div className={styles["section-content"]}>
                            <div className={`${styles["chart-wrapper"]} with-shadow `}>
                                <div className="d-flex  justify-content-between">
                                </div>
                                    <Skeleton height={250} />
                            </div>
                        </div>
                </div>
                :
                <div className={`${styles["section"]} ${styles["border-radius"]} bg-white with-shadow bing-section `}>
                    <SectionHeader data={headerData} />
                    <div className={styles["section-content"]}>
                        <div className={`${styles["chart-wrapper"]} with-shadow `}>
                            <div className="d-flex  justify-content-between">
                                {isAllowChart && crawlState && crawlState.length > 0 && loading == false &&
                                    <ChartDropdown
                                        list={chartDropdownConfig}
                                        selected={selectedGraph}
                                        onSelect={type => onSelectGraph(type)} />
                                }

                                <ChartLegend
                                    title={selectedGraph}
                                    active={true} />
                            </div>
                            {isAllowChart && !isBingAuthorized &&
                                <CompleteSetup
                                    authorize={authorize}
                                    type="Bing"
                                />
                            }
                            {isAllowChart && isBingAuthorized && crawlState && crawlState.length > 0 && loading == false && <LineChart name="bingWebMaster" selected={selectedGraph} chartData={crawlState} />}
                            {isEmpty(crawlState) && isBingAuthorized ? loading == true ? <DataIsLoading /> :
                                <div className="d-flex flex-column align-items-center" style={{ minHeight: '300px', justifyContent: 'center' }} >
                                    <p>  {t("No data found")}. </p>
                                </div>
                                : null}
                        </div>
                    </div>
                    {
                        !isAllowChart &&
                        <SeeMore
                            handleGetPremium={handleGetPremium}
                            hasActivatedSite={hasActivatedSite}
                            isAuthenticated={isAuthenticated}
                        />
                    }
                </div>
                }
            </div>
        );
}

export default withTranslation()(BingWebmasterSectionComponent);
