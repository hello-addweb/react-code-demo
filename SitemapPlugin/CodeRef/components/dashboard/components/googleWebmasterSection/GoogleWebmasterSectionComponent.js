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
import { GoogleApiHelper, Storage } from "helpers/index";
import { AreaChart, ChartDropdown, ChartLegend, LineChart } from "common/components";
import { isEmpty } from "lodash";
import moment from "moment";
import { customLogger } from 'logger';

import { withTranslation } from "react-i18next";

//styles
import "../../../../assets/scss/global.scss";
import styles from "./section.module.scss";
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';

//type
const GoogleWebmasterSectionComponent = props => {
    
    const { hasActivatedSite, isAuthenticated, handleGetPremium, isPremium, t } = props;
    const state = useSelector(state=>state)
    const {googleWebmasterSection: { rowsData, headerData, chartData }} = state
    const {activeSite} = state.user
    const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(props.isGoogleAuthorized)
    const [selectedGraph, setSelectedGraph] = useState('Average CTR')
    const [selectedDate, setSelectedDate] = useState(props.selectedDate)
    const [loading, setLoading] = useState(true)
    const googleWebMaster = GoogleApiHelper.getWebmaster();

    const authorize = () => window.location.replace(GoogleApiHelper.getAuthUrl());

    useEffect(()=>{
        getAnalytics();
    },[])

    const checkAuth = async () => {
        await GoogleApiHelper.isAuthorized()
            .then(res => {
                setIsGoogleAuthorized(res)
            }).catch(e => {
                setIsGoogleAuthorized(false)
            })
    }

   useEffect(()=>{

       
       if (!props.isGoogleAuthorized) {
           checkAuth()
        }
        if (props.isGoogleAuthorized !== isGoogleAuthorized) {
            setIsGoogleAuthorized(props.isGoogleAuthorized)
            getAnalytics(props.isGoogleAuthorized);
        }
        
        if (selectedDate?.startDate === props.selectedDate.startDate && selectedDate?.endDate === props.selectedDate.endDate) {
            customLogger('object')
        } else {
            setSelectedDate(props.selectedDate)
            getAnalytics();
        }
        if (props.googleWebmasterSection.isLoading == false) {
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }
    },[props])


    const getAnalytics = async (auth = false) => {
        return props.getGoogleWebmasterData({
            isGoogleApiAuthorized: auth ? auth : isGoogleAuthorized,
            siteUrl: props.activeSite.domain,
            startDate: moment(props.selectedDate.startDate).format('YYYY-MM-DD'),
            endDate: moment(props.selectedDate.endDate).format('YYYY-MM-DD'),
            rowLimit: 2000,
            startRow: 0,
            dimensions: [
                "page"
            ]
        });
    };

    const onSelectGraph = type => {
        setSelectedGraph(type)
    }

        const isAllowChart = isPremium && isAuthenticated && hasActivatedSite;
        const chartDropdownConfig = [
            { title: "Total Clicks" },
            { title: "Average Views" },
            { title: "Average CTR" },
            { title: "Average Position" }
        ];
    let propsLoading = (props.readyAppLoading || props.siteInfoLoaded || props.userDetailsLoaded)

        let GoogleToken = Storage.getItem('GOOGLE_TOKENS')
        return (
            <div id={props.id} className={styles["section-wrapper"]} ref={props.myRef}>
                {propsLoading === true ? <Skeleton height={40} width='30%'/> : <SectionHeading title={t("Google Webmaster")} />}
                { propsLoading === true ?
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
                <div className={`${styles["section"]} ${styles["border-radius"]} bg-white with-shadow `}>
                    <SectionHeader data={headerData} />
                    <div className={styles["section-content"]}>
                        <div className={`${styles["chart-wrapper"]} with-shadow `}>
                            <div className="d-flex  justify-content-between">
                                {isAllowChart && isGoogleAuthorized && chartData.length > 0 && loading == false &&

                                    <ChartDropdown
                                        list={chartDropdownConfig}
                                        selected={selectedGraph}
                                        onSelect={type => onSelectGraph(type)} />
                                }
                                <ChartLegend
                                    title={selectedGraph}
                                    active={true} />
                            </div>
                            {isAllowChart && !isGoogleAuthorized && !GoogleToken &&
                                <CompleteSetup
                                    authorize={authorize}
                                />
                            }
                            {isAllowChart && isGoogleAuthorized && chartData.length > 0 && loading == false && <LineChart name="googleWebMaster" selected={selectedGraph} chartData={chartData} />}
                            {isEmpty(chartData) && isGoogleAuthorized ? loading == true ? <DataIsLoading /> :
                                <div className="d-flex flex-column align-items-center" style={{ minHeight: '300px', justifyContent: 'center' }} >
                                    <p>  {t("No data found")}. </p>
                                </div>
                                : null}
                        </div>
                        <div className={styles["table-wrapper"]}>
                            <TableWebmaster
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

export default withTranslation()(GoogleWebmasterSectionComponent);
