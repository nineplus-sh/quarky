import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState, useRef} from "react";
import {useTranslation} from "react-i18next"
import LoginModal from "../components/modals/LoginModal.jsx";
import NiceModal from "@ebay/nice-modal-react";
import FirstTimeModal from "../components/modals/FirstTimeModal.jsx";

/**
 * The authentication needed ("login") screen.
 * @returns {JSX.Element}
 * @constructor
 */

const prevAuthed = localStorage.getItem("USER_AUTHED");
const firstTime = localStorage.getItem("SEEN_DEVELOP_MODAL");

export default function AuthenticationNeeded() {
    const appContext = useContext(AppContext);
    const [done, setDone] = useState(false);
    const [playMusic, setPlayMusic] = useState(false);
    const musicTag = useRef(null);
    const { t } = useTranslation();

    const needsAuth = Object.keys(appContext.accounts).length === 0 || (!done && !prevAuthed);
    useEffect(() => {
        if(needsAuth && !firstTime) {
            NiceModal.show(FirstTimeModal, {playMusic: setPlayMusic});
        } else {
            setPlayMusic(true);
        }
    }, []);
    useEffect(() => {
        if(playMusic) {
            musicTag.current?.play();
        } else {
            musicTag.current?.pause();
        }
    }, [playMusic]);

    if(needsAuth) {
        return (<>
            <audio src={appContext.nyafile.getCachedData("music/login")} loop={true} ref={musicTag}/>

            <SpaceBackground />
            <Header title={t("HEADER_WELCOME")} description={t("HEADER_WELCOME_SUB")}></Header>

            <LoginModal setDone={setDone} />
        </>)
    }
    return <Outlet />
}