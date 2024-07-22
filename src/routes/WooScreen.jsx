import {Trans, useTranslation} from "react-i18next";
import * as Sentry from "@sentry/react";
import styles from "./WooScreen.module.css";

export default function WooScreen({error}) {
    const {t} = useTranslation();

    return <div className={styles.wrapper}>
        <img src="/wooscreen.svg" role="presentation" width="128"/>
        <span className={styles.title}>{t("WOOSCREEN_TITLE")}</span>
        <span className={styles.stopped}>{t("WOOSCREEN_SUB")}</span>

        <span/><span/>

        <span>{t("WOOSCREEN_FEEDBACK_PWEASE")}</span>
        <span className={styles.buttons}>
            <button onClick={() => Sentry.showReportDialog({
                title: t("WOOSCREEN_FEEDBACK_TITLE"),
                subtitle: "",
                subtitle2: "",
                onClose() {document.location.reload()}
            })}>{t("WOOSCREEN_FEEDBACK_YIPPEE")}</button>
            <button onClick={() => document.location.reload()}>{t("WOOSCREEN_FEEDBACK_AW")}</button>
        </span>
    </div>
}