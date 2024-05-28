import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import changeMusic from "../components/nyafile/NyafileChangeMusic.js";
import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next"
import LoginModal from "../components/modals/LoginModal.jsx";

/**
 * The authentication needed ("login") screen.
 * @returns {JSX.Element}
 * @constructor
 */

const prevAuthed = localStorage.getItem("USER_AUTHED");

export default function AuthenticationNeeded() {
    const appContext = useContext(AppContext);
    const [done, setDone] = useState(false);
    const { t } = useTranslation();

    if(Object.keys(appContext.accounts).length === 0 || (!done && !prevAuthed)) {
        return (<>
            <audio src={appContext.nyafile.getCachedData("music/login")} autoPlay={true} loop={true}/>

            <SpaceBackground />
            <Header title={t("HEADER_WELCOME")} description={t("HEADER_WELCOME_SUB")}></Header>

            <LoginModal setDone={setDone} />
        </>)
    }
    return <Outlet />
}