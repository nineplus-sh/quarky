import styles from "./Loader.module.css"
import {version, author} from "../../package.json"
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../contexts/AppContext.js";
import NyafileImage from "../components/nyafile/NyafileImage.jsx";
import classnames from "classnames";

/**
 * The loading screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Loader({loadingString, progress, progressString}) {
    const { t } = useTranslation();
    const { nyafile, holiday } = useContext(AppContext);
    const [pippiDiedBigSadFrownyFace, setPippiDiedBigSadFrownyFace] = useState(false);

    return (<div id="superpreload">
        <img src="/quarky.svg" id="preloadlogo"/>
        <span id="preloadtext">
            {t(loadingString)}
            <br/>
            <i>{t(`${holiday}_LINK`) !== `${holiday}_LINK` ?
                <a target={"_blank"} rel={"noreferrer noopener"} href={t(`${holiday}_LINK`)}>{t(holiday)}</a>
                : t(holiday)}</i>
            {progress ? <><br/>
                <div className={classnames(styles.loadingBarWrapper, {[styles.pippiless]: pippiDiedBigSadFrownyFace})}>
                    <img className={styles.loadingBarImage} style={{left: `${progress}%`}}
                         src={"/loading.gif"}/>

                    <div className={styles.loadingBar} onMouseOver={() => setPippiDiedBigSadFrownyFace(true)}>
                        <div className={styles.loadingBarStretcher} style={{width: `${progress}%`}}></div>
                    </div>

                    <div className={styles.loadingBarText}>
                        {progressString}
                    </div>
                </div>
            </> : null}
        </span>
    </div>)
}