//@flow

import type { AnalyticsListType } from "components/dashboard/DashboardComponentTypes";
import type { AreaChartItem } from "common/components/areaChart/AreaChartTypes";

export type GoogleAnalyticsSectionComponentPropsTypes = {
    isAuthenticated: boolean,
    handleGetPremium: () => void,
    getGoogleAnalyticsData: ({
        isGoogleApiAuthorized: boolean,
        siteUrl: string,
        startDate: string,
        endDate: string,
    }) => void,
    googleAnalyticSection: {
        rowsData: ?AnalyticsListType,
        headerData: Array<SectionHeaderDataItem>,
        chartData: Array<AreaChartItem>,
        loading: boolean,
        isLoading:boolean,
    },
    activeSite: {
        domain: string,
    },
    myRef: {
        current: React$ElementRef<'div'> | null
    },
    isPremium: boolean,
    id: String,
    selectedDate: Object,
    isGoogleAuthorized: boolean

};

export type ComponentStateTypes = {
    selectedGraph: string,
    selectedDate:Object,
    loading:boolean
}

export type SectionHeaderDataItem = {
    type: string,
    title: string,
    value: string | number,
    iconComponent: null | ?React$Element<any>,
    colClass: string,
    labelConfig: string,
    labelText: string,
}
