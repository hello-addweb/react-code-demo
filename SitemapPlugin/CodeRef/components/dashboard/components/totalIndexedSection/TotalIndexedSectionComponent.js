//@flow

import React from "react";
import {
    SectionHeading,
} from "common/components";

//styles
import "../../../../assets/scss/global.scss";
import styles from "./../googleWebmasterSection/section.module.scss";

const TotalIndexedSectionComponent = props => {
        const { t } = props;
        return (
            <div id={props.id} className={styles["section-wrapper"]} ref={props.myRef}>
                <SectionHeading title={t("Total Indexed")} />
                <div style={{ height: 100 }} className={`${styles["section"]} ${styles["border-radius"]} bg-white with-shadow `}>
                    <div className={styles["section-content"]}>
                        {t("Section content")}
                    </div>
                </div>
            </div>
        );
}

export default withTranslation()(TotalIndexedSectionComponent);
