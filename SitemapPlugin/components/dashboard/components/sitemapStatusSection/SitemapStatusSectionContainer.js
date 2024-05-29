// @flow

import React from "react";
import { connect } from "react-redux";
import Component from "./SitemapStatusSectionComponent";
import * as actions from "components/dashboard/actions";
import type {
    SitemapStatusSectionComponentPropsTypes,
} from "./SitemapStatusSectionComponentTypes.js";

const mapStateToProps = state => {
    return {
        sitemapStatusSection: state.sitemapStatusSection,
        activeSite: state.user.activeSite,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSitemapData: data => {
            if (data.isGoogleApiAuthorized) {
                dispatch(actions.getSitemapData.request(data));
            }
        }
    };
};

const ConnectedMyComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

export default React.forwardRef<SitemapStatusSectionComponentPropsTypes, ConnectedMyComponent>((props, ref) => {
    return <ConnectedMyComponent {...props} myRef={ref} />;
});
