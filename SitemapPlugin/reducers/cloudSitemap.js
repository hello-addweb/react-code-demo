import * as actions from "actions/cloudSitemap";

const initialState = {
    cloudSitemapCreated: false
};

/**
 * Cloud Sitemap State
 * @param state
 * @param action
 * @returns {({} & {isRegistered: boolean} & {userData: *, user: *})|{isRegistered: boolean}}
 */
const cloudSitemapState = (state = initialState, action) => {
    switch (action.type) {
        case actions.CLOUD_SITEMAP_BUILD.SUCCESS:
            return Object.assign({}, state, {
                cloudSitemapCreated: true
            });

        default:
            return state;
    }
};

export default cloudSitemapState;
