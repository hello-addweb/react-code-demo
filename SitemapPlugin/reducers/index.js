import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import auth from "components/dashboard/reducers";
import messages from "./messages";
import user from "./user";
import cloudSitemap from "./cloudSitemap";

const reducers = Object.assign(
    {
        form: formReducer,
        router: routerReducer,
    },
    auth,
    { user },
    { messages },
    { cloudSitemap },
);

export default combineReducers( reducers );
