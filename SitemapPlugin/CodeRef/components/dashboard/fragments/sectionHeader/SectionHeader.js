//@flow

import React from "react";
import {
    CardStatistic,
} from "common/components";

import "../../../../assets/scss/global.scss";
import styles from "./section.module.scss";
import { withTranslation } from "react-i18next";


const SectionHeader = (props) => {
    const { data,t } = props;
    return (
        <div className={`${styles["statistic-list"]} statistic-list row with-shadow`}>
            {
                data.map((item, index) => {
                    return (
                        <div className="col statistic-item" key={index}>
                            <CardStatistic
                                heading={item.value}
                                subtitle={t(item.title)}
                                label={item.type}
                                labelConfig={item.labelConfig}
                                labelIcon={item.iconComponent}
                                labelText={item.labelText}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
};

export default withTranslation()(SectionHeader);
