import React from "react";
import { Route } from "react-router-dom";
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => {
    if (rest.path == "/settings"||rest.path == "/accounts" || rest.path.indexOf("federated-login-for-cs")>0) {
        return (
            <Route {...rest} render={props => (

                <Component {...props} />

            )} />
        )
    } else {
        return (
            <Route {...rest} render={props => (
                <Layout>
                    <Component {...props} />
                </Layout>
            )} />
        )
    }

};

export default AppRoute;

