// @flow
import React from "react";
import { connect } from "react-redux";
import Component from "./BingWebmasterSectionComponent";
import * as actions from "components/dashboard/actions";
import type {
    BingWebmasterSectionComponentPropsTypes,
} from "./BingWebmasterSectionComponentTypes.js";
import { customLogger } from 'logger';

const mapStateToProps = state => {
    return {
        bingWebmasterSection: state.bingWebmasterSection,
        activeSite: state.user.activeSite,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getBingWebmasterData: data => {
            customLogger("data:::",data.isBingApiAuthorized);
            if (data.isBingApiAuthorized) {
                dispatch(actions.getBingWebmasterData.request(data));
            }
        }
    };
};

const ConnectedMyComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

export default React.forwardRef<BingWebmasterSectionComponentPropsTypes, ConnectedMyComponent>((props, ref) => {
    return <ConnectedMyComponent {...props} myRef={ref} />;
});
