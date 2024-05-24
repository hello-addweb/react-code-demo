import { History } from "react-router-dom";
import type { UserNameType } from "common/components/topPanel/TopPanelType";
import type { SectionHeaderDataItem } from "components/dashboard/components/sitemapStatusSection/SitemapStatusSectionComponentTypes";

export type DashboardComponentPropsTypes = {
    getToken: ({
        username: string,
        password: string,
    }) => void,
    setGoogleAuthToken: ({
        code: string,
    }) => void,
    setDateRange: Function,
    generateSiteMap: ({
        site: string,
    }) => void,
    generateCloudSitemap: ({
        domain: string
    }),
    generateCloudSitemapIndex: ({
        domain: string
    }),
    onViewCloudSitemapIndex: ({
       domain: string
    }),
    activeSite: {
        domain: string,
        type: string,
    },
    isAuthenticated: boolean,
    history: History,
    dashboard: Object,
    // getBingWebmasterData: (data : {site: string}) => void,
    bingData: ?Array<{
        d: Array<{
            Url: string,
            Type: string,
            Submitted: string,
            UrlCount: string,
            Status: string,
            LastCrawled: string,
        }>
    }>,
    handleLogout: () => void,
    offsetTop: number,
    user: UserNameType,
    sitemapStatus:{
        sitemapStatusTotal?: number,
        sitemapStatusCheck?: number,
        headerData: Array<SectionHeaderDataItem>,
    },
    subscriptionType: string,
    installationStatus: string,
    installationFlow: string
}

export type DashboardComponentStateTypes = {
    siteInfo: ?{
        data: {
            sitemap: Array<*>
        },
    },
    sitesList: Array<SiteDataTypes>,
    sectionRefs: {
        [index: number] : CurrentRef,
    },
    isGoogleAuthorized : boolean,
    userAuthenticated : boolean,
    indexingData: * // TODO add Type
    readyApp:boolean
}

export type CurrentRef = {
    current: ?{
            offsetTop: number,
            clientHeight: number
    }
}

export type SiteDataTypes = {
    siteUrl: string,
    permissionLevel: string
};

export type AnalyticsListType = Array<{
    clicks: number | string,
    ctr: number | string,
    impressions: number | string,
    keys: Array<string>,
    position: number | string,
    types: number | string,
    processed: number | string,
    issues: number | string,
    submitted: number | string,
    indexed: number | string,
    path: number | string,
    contents: number | string,
}>
