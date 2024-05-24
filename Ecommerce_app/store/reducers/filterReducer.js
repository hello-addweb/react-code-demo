import { FILTER_CRITERIA, FILTER_DATA, FILTER_FAIL, FILTER_LOADING, FILTER_SUCCESS, FILTER_SELECTED_TAB, FILTER_UPDATE} from "../types";

const initialState = {
    isFilterLoading: false,
    filterList: [],
    filterData: {},
    filterListFail: '',
    filterCriteria:{},
    selectedTab:""
}

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILTER_LOADING:
            return { ...state, isFilterLoading: action.payload };

        case FILTER_SUCCESS:
            return {
                ...state,
                filterList: action.payload,
                filterData: {},
                filterListFail: '',
                selectedTab:action.payload[0].key
            };

        case FILTER_UPDATE:
            return {
                ...state,
                filterList: action.payload,
                filterListFail: '',
            };

        case FILTER_FAIL:
            return { 
                ...state, 
                filterListFail: action.payload,
                selectedTab:""
            };

        case FILTER_DATA:
            return {...state, filterData: action.payload};
        case FILTER_CRITERIA:
            return {...state, filterCriteria: action.payload};
        case FILTER_SELECTED_TAB:
                return {...state, selectedTab: action.payload};
        default:
            return state;
    }
}

export default filterReducer;
