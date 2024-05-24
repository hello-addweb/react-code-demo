//@flow
import type { UserNameType } from "common/components/topPanel/TopPanelType";
import type { SectionHeaderDataItem } from "components/dashboard/components/sitemapStatusSection/SitemapStatusSectionComponentTypes";

export type WelcomeSectionTypes = {
    onSubmitGenerateSiteMap: SyntheticEvent<HTMLButtonElement> => void,
    action: () => void,
    user: UserNameType,
    isAuthenticated: boolean,
    sitemapStatus: {
        sitemapStatusTotal?: number,
        sitemapStatusCheck?: number,
        headerData: Array<SectionHeaderDataItem>,
    },
    isPremium: boolean,
    selectedDate: Object,
    onDatesChange: Function,
    onPressButton: Function,
    isGoogleAuthorized: boolean,
    generateCloudSitemap: Function,
    generateCloudSitemapIndex: Function,
    onViewCloudSitemapIndex: Function,
    onViewWpSitemapIndex: Function,
    activeSite: Object,
    close: boolean,
    notifySearchEnginesViaPings: Function
};
