import styles from "./BotTag.module.css"
import classnames from "classnames";
import {useTranslation} from "react-i18next";

export default function BotTag({name, isDiscord}) {
    const {t} = useTranslation();

    return <span className={classnames(styles.botTag, {[styles.discord]: isDiscord})}>
        {isDiscord ? t("DISCORD") : t("BOT")}
    </span>
}