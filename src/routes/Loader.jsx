import styles from "./Loader.module.css"
import {version, author} from "../../package.json"
import {useTranslation} from "react-i18next";
import {useContext, useEffect} from "react";
import {AppContext} from "../contexts/AppContext.js";
import NyafileImage from "../components/nyafile/NyafileImage.jsx";

/**
 * The loading screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Loader({loadingString}) {
    const { t } = useTranslation();
    const { nyafile, holiday } = useContext(AppContext);

    /*return (<div className={styles.loaderWrap}>
        <div className={styles.loader}>
            <div className={styles.loaderText}>
                <p className={styles.loadingMain}><span className={styles.loaderSymbol}>☯</span> {t("LOADING_TITLE")}</p>
                <p className={styles.loadingSplashes}>
                    {t(`${holiday}_LINK`) !== `${holiday}_LINK` ?
                        <a target={"_blank"} rel={"noreferrer noopener"} href={t(`${holiday}_LINK`)}>{t(holiday)}</a>
                    : t(holiday)}
                </p>
                <div className={styles.loadingSubtitle}>{t(loadingString)}<br/>Quarky {version} &copy; {author}</div>
            </div>
        </div>
    </div>)*/

    return (<div id="superpreload">
        {nyafile ? <NyafileImage src={"logo"} id="preloadlogo"/> : <img src="/quarky.svg" id="preloadlogo"/>}
        <span id="preloadtext">
            {t(loadingString)}
            <br/>
            <i>{t(`${holiday}_LINK`) !== `${holiday}_LINK` ?
                <a target={"_blank"} rel={"noreferrer noopener"} href={t(`${holiday}_LINK`)}>{t(holiday)}</a>
                : t(holiday)}</i>
        </span>
    </div>)
}