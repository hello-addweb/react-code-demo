import React from "react";
import { Route, Redirect } from "react-router-dom";
import withUser from "helpers/withUser";

class NotFoundRoute extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: null
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (
            props.isCognitAuthenticated() !== state.isAuthenticated
        ) {
            return {
                isAuthenticated: props.isCognitAuthenticated(),
            };
        }
        return null;
    }

    componentDidMount() {
        if (
            this.props.isCognitAuthenticated() !== this.state.isAuthenticated
        ) {
            this.setState( {
                isAuthenticated: this.props.isCognitAuthenticated(),
            });
        }
    }

    render() {

        const { component: Component, layout: Layout, ...rest } = this.props;
        return (
            <Route
                {...rest} render={props => {
                    if(this.state.isAuthenticated && this.props.activeSite) {
                        return (
                            <Redirect
                                to="/dashboard"
                            />
                        )
                        ;
                    } else if (this.state.isAuthenticated && !this.props.activeSite) {
                        return <Redirect
                            to="/sign-up/wp-verify"
                        />;
                    } else {
                        return <Layout><Component {...props} /></Layout>;
                    }
                }
                }
            />
        );
    }
}

export default withUser(NotFoundRoute);
