import { connect } from "react-redux";
import React from "react";
import { Route } from "react-router-dom";
import { Heading } from "common/components";
import "assets/scss/global.scss";
import "assets/css/Innerglobal.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AuthRoute = (
    { component: Component, layout: Layout, activeSite: activeSite, ...rest }
    ) => {
        const { t } = useTranslation();

    const plans = useSelector(state=>state.plans.plansData.plans)
    let plantype  = window.location.hash
    let discount = 0, grossPay = 0
    if(plantype.includes('premium')){
    const selectedPlan = plans.filter(planInfo => planInfo.id === window.localStorage.getItem('selectedPlan'))
        if(selectedPlan[0].hasOwnProperty('discounts') && selectedPlan[0].discounts.length > 0) {
            selectedPlan[0].discounts.map(disc=> discount += parseFloat(disc.amount) )
        }
        if(discount!==0) {
            grossPay = parseFloat(localStorage.planPrice) - parseFloat(discount)
        }
    }


    return (
        <Route
            {...rest} render={props => {
                let link = window.location.search == "" ? `${window.location.origin}${window.location.pathname}#/sign-in` : `${window.location.origin}${window.location.pathname}${window.location.search}#/sign-in`;
                let URL = window.location.href.split('/');
                let loginLink = URL[URL.length - 1] == "sign-up" ? true : URL[URL.length - 2] == "sign-up" && URL[URL.length - 1] == "" ? true : false;

                let { targetPlan = null } = props.match && props.match.params ? props.match.params : {};

                let title1 ;
                let subtitle;
                if (targetPlan === "community") {
                    title1 = t("Get started absolutely free.");
                    subtitle = t("Free forever. No credit card needed.");
                } else if (targetPlan === "premium") {
                    title1 = t("Get started with the Premium plan.");
                    subtitle = discount!==0 ?  `$${grossPay}/year. ` + t("No contracts, cancel anytime.") : `$${localStorage.planPrice}/year. ` + t("No contracts, cancel anytime.");
                } else {
                    title1 = "";
                    subtitle = "";
                }
                return (
                    <Layout>
                        <section className={`section-fixed-top section ${loginLink == true ? 'signup-section' : ''}`}>
                            <Heading
                                title={title1}
                                subtitle={subtitle}
                                align="center"
                                className={`top-space`}
                            />
                            <div className="section-body">
                                <div className="bg-white with-shadow sign-up-form">
                                    <Component {...props} />
                                </div>
                            </div>
                        </section>
                        {(/sign-up/.test(window.location.href) && !(/code-verify/.test(window.location.href))) && (
                            <div className="text-middle">
                                <span>{t("Already have an account?")}</span>
                                <a href={link}>{t("Login here.")}</a>
                            </div>
                        )}
                    </Layout>
                )
            }
            }
        />
    );
};

export default connect()(AuthRoute);
