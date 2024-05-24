import * as actions from "../actions";
import moment from "moment";

const initialState = {
    loading: false,
    loadingToken:false,
    message: "",
    cognitoToken:"",
    selectedDate: {
        startDate: moment().subtract(90, 'days'),
        endDate: moment(),
    },
    loaderToNotifyEngines: false,
    pingResponse: {
        "response": {}
    }
};

const dashboard = (state = initialState, action) => {
    switch (action.type) {

        case actions.GENERATE_SITE_MAP.FAILURE:
            return Object.assign({}, state, {
                loading: false,
                message: action.error.message,
            });

        case actions.SET_DATE_RANGE.SUCCESS:
            return Object.assign({}, state, {
                selectedDate: action.response.date,
            });

        case actions.GENERATE_SITE_MAP.SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                message: "Site Map successfully generated!",
            });

        case actions.GENERATE_SITE_MAP.REQUEST:
            return Object.assign({}, state, {
                loading: true,
                message: "",
            });

        default:
            return state;
    }
};

export default dashboard;
