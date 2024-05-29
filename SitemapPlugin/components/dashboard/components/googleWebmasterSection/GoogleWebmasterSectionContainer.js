import React from "react";
import { connect } from "react-redux";
import Component from "./GoogleWebmasterSectionComponent";
import * as actions from "components/dashboard/actions";

const mapStateToProps = state => {
    return {
        googleWebmasterSection: state.googleWebmasterSection,
        activeSite: state.user.activeSite,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGoogleWebmasterData: data => {
            if (data.isGoogleApiAuthorized) {
                dispatch(actions.getGoogleWebmasterData.request(data));
            }
        }
    };
};

const ConnectedMyComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

export default React.forwardRef<ConnectedMyComponent>((props, ref) => {
    return <ConnectedMyComponent {...props} myRef={ref} />;
});
