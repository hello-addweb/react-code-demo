import React from "react";
import { HashRouter, Switch } from "react-router-dom";
import asyncComponent from "helpers/asyncComponent";
const Dashboard = asyncComponent(() => import("components/dashboard"));
import ProtectedRoute from "./protectedRoute";
import NotFoundRoute from "./notFoundRoute";
import { Layout, dashboardLayout } from "common/components";
import AppRoute from "./AppRoute";
import { isInsideWpAdmin } from "helpers/installationFlowHelper";
const Router = () => {
    return (
        <HashRouter>
            <Switch>
                {isInsideWpAdmin() ?
                    <AppRoute exact path="/dashboard" layout={dashboardLayout} component={Dashboard} />
                    :
                    <ProtectedRoute exact path="/dashboard" layout={dashboardLayout} component={Dashboard} />
                }
                <NotFoundRoute layout={Layout} component={() => <section className="section-fixed-top">not found</section>} />

            </Switch>
        </HashRouter>
    );
};

export default Router;

