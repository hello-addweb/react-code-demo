//@flow

import React, { Component } from "react";
import {
    SectionHeading,
    DataIsLoading,
    TableWebmaster,
    SeeMore,
    CompleteSetup,
} from "common/components";
import SectionHeader from "components/dashboard/fragments/sectionHeader/SectionHeader";
import { GoogleApiHelper } from "helpers/index";
import { AreaChart, ChartDropdown, ChartLegend, LineChart } from "common/components";
import { isEmpty } from "lodash";
import moment from "moment";
import { withTranslation } from "react-i18next";
import { customLogger } from 'logger';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

//styles
import "../../../../assets/scss/global.scss";
import styles from "./section.module.scss";
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';


const GoogleAnalyticsSectionComponent = props => {
    
    const state = useSelector(state=>state)
    const { hasActivatedSite, isAuthenticated, handleGetPremium,  isPremium, isGoogleAuthorized, t } = props;
    const {googleAnalyticsSection: { rowsData, headerData, chartData }} = state
    const {activeSite} = state.user
    const GoogleAnalytics = GoogleApiHelper.getWebmaster();

    let isGoogleApiAuthorized = props.isGoogleAuthorized;
    //  GoogleApiHelper.isAuthorized();
    const [selectedGraph, setSelectedGraph]= useState('')
    const [selectedDate, setSelectedDate] = useState()
    const [loading, setLoading] = useState(false) 
    const authorize = () => window.location.replace(GoogleApiHelper.getAuthUrl());

    useEffect(()=>{
        const willMount = async ()=>{
            await GoogleApiHelper.isAuthorized()
                .then(res => {
                    isGoogleApiAuthorized = res
                })
            getAnalytics();

        }
        function didMount(){
            setLoading(true)
            setSelectedDate(props.selectedDate)
            setSelectedGraph('Monthly')
        }
        willMount()
        didMount()
    },[])
    useEffect(()=>{

            customLogger('google analytics props',props)
            if (selectedDate?.startDate === props.selectedDate?.startDate && selectedDate?.endDate === props.selectedDate?.endDate) {
                customLogger('object')
            } else {
                setSelectedDate(props.selectedDate)
                getAnalytics();
            }
            
            if (props.googleAnalyticSectionisLoading == false) {
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            }
        },[props])
        useEffect(()=>{
            customLogger('props.googleAnalyticSection.isLoading',props.googleAnalyticSection.isLoading)
            if (props.googleAnalyticSection.isLoading == false) {
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            }

        },[props.googleAnalyticSection.isLoading])


    const getAnalytics = async () => {
        return props.getGoogleAnalyticsData({
            isGoogleApiAuthorized: await isGoogleApiAuthorized,
            siteUrl: props.activeSite.domain,
            startDate: moment(props.selectedDate.startDate).format('YYYY-MM-DD'),
            endDate: moment(props.selectedDate.endDate).format('YYYY-MM-DD'),
        });
    };

    const onSelectGraph = type => {
        setSelectedGraph(type)
    }

        const isAllowChart = isPremium && isAuthenticated && hasActivatedSite;
        const chartDropdownConfig = [
            { title: "Monthly" },
            { title: "Yearly" },
        ];
        customLogger('outside google analytics props',props)
      let propsLoading = (props.readyAppLoading || props.siteInfoLoaded || props.userDetailsLoaded)

        return (
            <div id={props.id} className={`${styles["section-wrapper"]} `} ref={props.myRef}>
                {propsLoading === true ?<Skeleton height={40} width='30%'/> : <SectionHeading title={t("Google Analytics")} />}
                {
                    propsLoading === true
                    ?
                    <div className={`${styles["section"]} ${styles["border-radius"]} bg-white with-shadow `}>
                        <div className={styles["section-content"]}>
                            <div className={`${styles["chart-wrapper"]} with-shadow `}>
                                <div className="d-flex  justify-content-between">
                                </div>
                                <Skeleton height={250} />
                            </div>
                        </div>
                    </div>
                    :
                
                <div className={`${styles["section"]} ${styles["border-radius"]}  bg-white with-shadow  ${isEmpty(chartData) && isGoogleAuthorized ? '' : "min-height-400"}`}>
                    <SectionHeader data={headerData} />
                    <div className={styles["section-content"]}>
                        <div className={`${styles["chart-wrapper"]}   with-shadow  `}>
                            <div className="d-flex justify-content-end" >
                                <ChartLegend
                                    title={'Unique Views'}
                                    active={true} />
                            </div>
                            {isAllowChart && !isGoogleAuthorized &&
                                <CompleteSetup
                                    authorize={authorize}
                                />
                            }
                            {isAllowChart && isGoogleAuthorized && loading == false && <LineChart name="googleAnalytics" selected={selectedGraph} chartData={chartData} />}

                            {isEmpty(chartData) && isGoogleAuthorized ? loading == true ? <DataIsLoading /> :
                                <div className="d-flex flex-column align-items-center" style={{ minHeight: '300px', justifyContent: 'center' }} >
                                    <p> {t("No data found")} </p>
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

export default withTranslation()(GoogleAnalyticsSectionComponent);
