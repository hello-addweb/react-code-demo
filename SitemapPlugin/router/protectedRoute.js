import React from "react";
import { Route, Redirect } from "react-router-dom";
import withUser from "helpers/withUser";
import { isInsideWpAdmin } from "helpers/installationFlowHelper";

const ProtectedRoute = ({ component: Component, layout: Layout, ...rest }) => {
    if (rest.path == "/settings"||rest.path == "/accounts") {
        if(rest.path == "/settings" && isInsideWpAdmin()){
            return (
                <Route {...rest} render={props => (
                        <Component {...props} />
                )} />
            )
        }else{
            return (
                <Route {...rest} render={props =>  {
                    return (
                        rest.isAuthenticated
                            ? <Component {...rest} />
                            : <Redirect
                                to="/sign-in"
                            />
                    );

                }} />
            )
        }
    } else {
        return (
            <Route
                {...rest} render={() => {
                    return (
                        rest.isAuthenticated
                            ? <Layout><Component {...rest} /></Layout>
                            : <Redirect
                                to={{
                                    pathname:"/sign-in",
                                    state: {
                                        from : rest.location
                                    }
                                }}
                            />
                    );
    
                }}
            />
        );
    }
};

export default withUser(ProtectedRoute);
