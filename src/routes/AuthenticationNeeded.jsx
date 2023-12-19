import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import changeMusic from "../components/nyafile/NyafileChangeMusic.js";
import TelegramQRCode from "../components/_services/telegram/login/TelegramQRCode.jsx";
import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import LightquarkLogin from "../components/_services/lightquark/login/LightquarkLogin.jsx";
import {useTranslation} from "react-i18next"

/**
 * The authentication needed ("login") screen.
 * @returns {JSX.Element}
 * @constructor
 */

const prevAuthed = localStorage.getItem("USER_AUTHED");

export default function AuthenticationNeeded() {
    const appContext = useContext(AppContext);
    const [service, setService] = useState("");
    const [done, setDone] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if(appContext.accounts[service]) setService("")
    }, [appContext.accounts]);

    if(Object.keys(appContext.accounts).length === 0 || (!done && !prevAuthed)) {
        return (<>
            <SpaceBackground />
            <Header title={t("HEADER_WELCOME")} description={t("HEADER_WELCOME_SUB")}></Header>

            <div style={{color: "white"}}>
                {{
                    lightquark: <LightquarkLogin/>,
                    telegram: <TelegramQRCode/>
                }[service] || <h2>{t("HEADER_SERVICE_LOGIN")}</h2>}

                <button onClick={() => setService("lightquark")} disabled={appContext.accounts.lightquark}>Lightquark</button>
                <button onClick={()=>setService("telegram")} disabled={appContext.accounts.telegram}>Telegram</button>

                <button disabled={Object.keys(appContext.accounts).length === 0} onClick={function(){
                    localStorage.setItem("USER_AUTHED", "bet");
                    setDone(true);
                }}>{t("DONE")}</button>
            </div>
        </>)
    }
    return <Outlet />
}