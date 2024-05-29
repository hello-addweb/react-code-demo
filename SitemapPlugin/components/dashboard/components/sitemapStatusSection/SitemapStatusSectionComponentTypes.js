//@flow

import type { AnalyticsListType } from "components/dashboard/DashboardComponentTypes";
import type { AreaChartItem } from "common/components/areaChart/AreaChartTypes";

export type SitemapStatusSectionComponentPropsTypes = {
    isAuthenticated: boolean,
    handleGetPremium: () => void,
    getSitemapData: ({
        isGoogleApiAuthorized: boolean,
        siteUrl: string,
        sitemapIndex: string
    }) => void,
    sitemapStatusSection: {
        rowsData: ?AnalyticsListType,
        headerData: Array<SectionHeaderDataItem>,
        chartData: Array<AreaChartItem>,
        loading: boolean,
        isLoading: false,
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
    loading: boolean
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
