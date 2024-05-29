//@flow

import React, { Component } from "react";
import { isEmpty } from "lodash";
import {
    SectionHeading,
    DataIsLoading,
    TableSitemap,
    SeeMore,
    CompleteSetup,
} from "common/components";
import {
    isInsideWpAdmin,
} from "helpers/installationFlowHelper";
import { GoogleApiHelper } from "helpers/index";
import SectionHeader from "components/dashboard/fragments/sectionHeader/SectionHeader";
import { BarChart } from "common/components";
import { withTranslation } from "react-i18next";

//styles
import "../../../../assets/scss/global.scss";
import styles from "./../googleWebmasterSection/section.module.scss";
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';


const SitemapStatusSectionComponent = props => {
    const { hasActivatedSite, isAuthenticated, handleGetPremium, isPremium, isGoogleAuthorized, t } = props;
    const state = useSelector(state=>state)
    const {sitemapStatusSection: { rowsData, headerData, chartData }} = state
    const {activeSite} = state.user
    const [loading, setLoading] = useState(false)
    let isGoogleApiAuthorized = props.isGoogleAuthorized;

    const authorize = () => window.location.replace(GoogleApiHelper.getAuthUrl());

    useEffect(()=>{
        setLoading(true)
        const didMount = async() =>{
            await GoogleApiHelper.isAuthorized()
            .then(res => {
                isGoogleApiAuthorized = res
            })
        getSitemapAnalytics();
        }
        didMount()
    },[])
    
    useEffect(()=>{
        if (props.sitemapStatusSection.isLoading == false) {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    
    },[props])

    const getSitemapAnalytics = () => {
        return props.getSitemapData({
            isGoogleApiAuthorized: isGoogleApiAuthorized,
            siteUrl: props.activeSite.domain,
            // sitemapIndex: `${this.props.activeSite && this.props.activeSite.domain}/web/sitemap/sitemapindex.xml`,
            sitemapIndex: ''
        });
    };

        let propsLoading = (props.readyAppLoading || props.siteInfoLoaded || props.userDetailsLoaded)
        const isAllowChart = isPremium && isAuthenticated && hasActivatedSite;
        return (
            <div id={props.id} className={styles["section-wrapper"]} ref={props.myRef}>
                {propsLoading === true ? <Skeleton height={40} width='30%'/> : <SectionHeading title={t("Sitemap Status")} />}
                { propsLoading === true
                ?
                <div className={`${styles["section"]} ${styles["border-radius"]} ${isInsideWpAdmin() !== true ? "dash-margin-bottom" : ""}  bg-white with-shadow `}>
                    {/* <Skeleton /> */}
                        <div className={styles["section-content"]}>
                            <div className={`${styles["chart-wrapper"]}  with-shadow `}>
                                <div className="d-flex justify-content-between">
                                </div>
                                <Skeleton height={250} enableAnimation={true}/>
                            </div>
                        </div>
                </div>
                :
                <div className={`${styles["section"]} ${styles["border-radius"]} ${isInsideWpAdmin() !== true ? "dash-margin-bottom" : ""}  bg-white with-shadow `}>
                    <SectionHeader data={headerData} />
                    <div className={styles["section-content"]}>
                        <div className={`${styles["chart-wrapper"]}  with-shadow `}>
                            <div className="d-flex justify-content-between">
                            </div>
                            {isAllowChart && !isGoogleAuthorized &&
                                <CompleteSetup
                                    authorize={authorize}
                                />
                            }

                            {isAllowChart && isGoogleAuthorized && chartData.length > 0 && loading == false && <BarChart chartData={chartData} />}
                            {isEmpty(chartData) && isGoogleAuthorized ? loading == true ? <DataIsLoading /> :
                                <div className="d-flex flex-column align-items-center" style={{ minHeight: '300px', justifyContent: 'center' }} >
                                    <p>  {t("No data found")}. </p>
                                </div>
                                : null}
                        </div>
                        <div className={styles["table-wrapper"]}>
                            <TableSitemap
                                data={rowsData}
                            />
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

export default withTranslation()(SitemapStatusSectionComponent);
