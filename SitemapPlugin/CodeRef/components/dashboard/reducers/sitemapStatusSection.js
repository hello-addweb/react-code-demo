import * as actions from "../actions";
import { sitemapStatusHeaderConfig } from "../mockedData";

const initialState = {
    isLoading: true,
    loading: false,
    headerLoading: false,
    rowsLoading: false,
    chartLoading: false,
    message: null,
    headerMessage: null,
    rowsMessage: null,
    chartMessage: null,
    rowsData: [],
    headerData: sitemapStatusHeaderConfig,
    chartData: [],
    sitemapStatusTotal: null,
    sitemapStatusCheck: null
};

const sitemapStatusSection = (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_SITEMAP_DATA.FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                loading: false,
                message: action.error.message,
            });

        case actions.GET_SITEMAP_DATA.SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                rowsData: action.response.rowsData,
                headerData: action.response.headerData,
                chartData: action.response.chartData,
                loading: false,
                message: null,
            });

        case actions.GET_SITEMAP_DATA.SUCCESS_HEADER_DATA:
            return Object.assign({}, state, {
                isLoading: false,
                headerData: action.response.headerData,
                headerLoading: false,
                headerMessage: null,
            });

        case actions.GET_SITEMAP_DATA.SUCCESS_CHART_DATA:
            return Object.assign({}, state, {
                isLoading: false,
                chartData: action.response.chartData,
                chartLoading: false,
                chartMessage: null,
            });

        case actions.GET_SITEMAP_DATA.SUCCESS_ROWS_DATA:
            return Object.assign({}, state, {
                isLoading: false,
                rowsData: action.response.rowsData,
                rowsLoading: false,
                rowsMessage: null,
                sitemapStatusTotal: action.response.rowsData.length,
                sitemapStatusCheck: action.response.rowsData.reduce((sum, cur) => !cur.isPending && sum + 1, 0)
            });

        case actions.GET_SITEMAP_DATA.REQUEST:
            return Object.assign({}, state, {
                isLoading: true,
                loading: true,
                headerLoading: true,
                rowsLoading: true,
                chartLoading: true,
                message: null,
                headerMessage: null,
                rowsMessage: null,
                chartMessage: null,
                rowsData: [],
                headerData: sitemapStatusHeaderConfig,
                chartData: [],
            });

        default:
            return state;
    }
};

export default sitemapStatusSection;
