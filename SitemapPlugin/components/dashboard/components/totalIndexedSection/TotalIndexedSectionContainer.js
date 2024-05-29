// @flow
import React from "react";
import { connect } from "react-redux";
import Component from "./TotalIndexedSectionComponent";

const mapStateToProps = () => {
    return {

    };
};

const mapDispatchToProps = () => {
    return {

    };
};

const ConnectedMyComponent = connect(mapStateToProps, mapDispatchToProps)(Component);

export default React.forwardRef<ConnectedMyComponent>((props, ref) => {
    return <ConnectedMyComponent {...props} myRef={ref} />;
});
