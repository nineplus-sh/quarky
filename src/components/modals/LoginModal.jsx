import LightquarkLogin from "../_services/lightquark/login/LightquarkLogin.jsx";
import TelegramQRCode from "../_services/telegram/login/TelegramQRCode.jsx";
import {AppContext} from "../../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import {t} from "i18next";
import styles from "./LoginModal.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";

/**
 * The login modal of the authentication needed screen.
 * This shit is absolutely not a modal but I don't know what to call it so it's a modal
 * @returns {JSX.Element}
 * @constructor
 */
export default function LoginModal({setDone}) {
    const appContext = useContext(AppContext);
    const [service, setService] = useState("");

    useEffect(() => {
        if(appContext.accounts[service]) setService("")
    }, [appContext.accounts]);

    return <div className={styles.centerwrap}>
        <NyafileImage src={"img/loginheadervukky"} className={styles.planet}/>

        <div className={styles.orbs}>
            <span className={styles.orbwrap}><img src={"https://logo.litdevs.org/api/vukky/bg"} className={styles.orb}/></span>
            <span className={styles.orbwrap}><NyafileImage src={"img/orb_2"} className={styles.orb}/></span>
            <span className={styles.orbwrap}><NyafileImage src={"img/orb_3"} className={styles.orb}/></span>
            <span className={styles.orbwrap}><NyafileImage src={"img/orb_4"} className={styles.orb}/></span>
            <span className={styles.orbwrap}><NyafileImage src={"img/orb_5"} className={styles.orb}/></span>
        </div>

        <div className={styles.login}>
            {{
                lightquark: <LightquarkLogin/>,
                telegram: <TelegramQRCode/>
            }[service] || <h2>{t("HEADER_SERVICE_LOGIN")}</h2>}

            <button onClick={function() {
                new Audio(appContext.nyafile.getCachedData("sfx/button-select")).play();
                setService("lightquark");
            }} disabled={appContext.accounts.lightquark}>Lightquark
            </button>
            <button onClick={function() {
                new Audio(appContext.nyafile.getCachedData("sfx/button-select")).play();
                setService("telegram");
            }}  disabled={appContext.accounts.telegram}>Telegram</button>

            <button disabled={Object.keys(appContext.accounts).length === 0} onClick={function () {
                localStorage.setItem("USER_AUTHED", "bet");
                setDone(true);
            }}>{t("DONE")}</button>
        </div>
    </div>
}