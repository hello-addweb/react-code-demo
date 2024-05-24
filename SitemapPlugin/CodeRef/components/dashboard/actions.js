import { createRequestTypes } from "helpers/constants";

export const GENERATE_SITE_MAP = createRequestTypes("GENERATE_SITE_MAP");

export const GET_SITEMAP_DATA = createRequestTypes("GET_SITEMAP_DATA", {
    SUCCESS_HEADER_DATA: "SUCCESS_HEADER_DATA",
    SUCCESS_CHART_DATA: "SUCCESS_CHART_DATA",
    SUCCESS_ROWS_DATA: "SUCCESS_ROWS_DATA",
});


export const generateSiteMap = {
    request: request => ({ type: GENERATE_SITE_MAP.REQUEST, request }),
    success: response => ({ type: GENERATE_SITE_MAP.SUCCESS, response }),
    error:   error => ({ type: GENERATE_SITE_MAP.FAILURE, error })
};

export const getSitemapData = {
    request: request => ({ type: GET_SITEMAP_DATA.REQUEST, request }),
    success: response => ({ type: GET_SITEMAP_DATA.SUCCESS, response }),
    successHeaderData: response => ({ type: GET_SITEMAP_DATA.SUCCESS_HEADER_DATA, response }),
    successChartData: response => ({ type: GET_SITEMAP_DATA.SUCCESS_CHART_DATA, response }),
    successRowsData: response => ({ type: GET_SITEMAP_DATA.SUCCESS_ROWS_DATA, response }),
    error:   error => ({ type: GET_SITEMAP_DATA.FAILURE, error })
};

export const notifySearchEnginesViaPings = {
    request: request => ({ type: SET_NOTIFY_ENGINES.REQUEST, request }),
    success: response => ({ type: SET_NOTIFY_ENGINES.SUCCESS, response }),
    error:   error => ({ type: SET_NOTIFY_ENGINES.FAILURE, error })
};
