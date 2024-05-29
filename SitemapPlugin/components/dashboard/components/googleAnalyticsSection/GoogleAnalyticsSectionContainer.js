import React from "react";
import { connect } from "react-redux";
import Component from "./GoogleAnalyticsSectionComponent";
import * as actions from "components/dashboard/actions";

const mapStateToProps = state => {
    return {
        googleAnalyticSection: state.googleAnalyticsSection,
        activeSite: state.user.activeSite,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGoogleAnalyticsData: data => {
            if (data.isGoogleApiAuthorized) {
                dispatch(actions.getGoogleAnalyticsData.request(data));
            }
        }
    };
};

const ConnectedMyComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

export default React.forwardRef<ConnectedMyComponent>((props, ref) => {
    return <ConnectedMyComponent {...props} myRef={ref} />;
});
