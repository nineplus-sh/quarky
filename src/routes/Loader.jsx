import styles from "./Loader.module.css"
import {version, author} from "../../package.json"
import {useTranslation} from "react-i18next";

/**
 * The loading screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Loader({loadingString}) {
    const { t } = useTranslation();

    return (<div className={styles.loaderWrap}>
        <div className={styles.loader}>
            <p className={styles.loaderText}>
                <span className={styles.loaderSymbol}>☯</span> {t("LOADING_TITLE")}<br/>
                <small><small>{t(loadingString)}<br/>Quarky {version} (c) {author}</small></small>
            </p>
        </div>
    </div>)
}