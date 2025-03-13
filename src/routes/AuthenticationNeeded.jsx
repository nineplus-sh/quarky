import Footer from "../components/nav/Footer.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState, useRef, useCallback} from "react";
import {useTranslation} from "react-i18next"
import LoginModal from "../components/modals/LoginModal.jsx";
import NiceModal from "@ebay/nice-modal-react";
import FirstTimeModal from "../components/modals/FirstTimeModal.jsx";
import useMe from "../components/_services/lightquark/hooks/useMe.js";
import Loader from "./Loader.jsx";
import DevBuildBanner from "../components/modals/DevBuildBanner.jsx";

/**
 * The authentication needed ("login") screen.
 * @returns {JSX.Element}
 * @constructor
 */

const firstTime = localStorage.getItem("SEEN_DEVELOP_MODAL");

export default function AuthenticationNeeded() {
    const appContext = useContext(AppContext);
    const [playMusic, setPlayMusic] = useState(false);
    const musicTag = useCallback(node => {
        if(node == null) return;
        playMusic ? node.play() : node.pause()
    }, [playMusic])
    const { t } = useTranslation();

    useEffect(() => {
        if(!appContext.apiKeys.accessToken && !firstTime) {
            NiceModal.show(FirstTimeModal, {playMusic: setPlayMusic});
        } else {
            setPlayMusic(true);
        }
    }, []);

    if(!appContext.apiKeys.accessToken) {
        return (<>
            {import.meta.env.VITE_GIT_BRANCH && import.meta.env.VITE_GIT_BRANCH !== "senpai" ? <DevBuildBanner/> : null}
            <audio src={appContext.nyafile.getFileURL("music/login")} loop={true} ref={musicTag}/>

            <SpaceBackground />
            <LoginModal />

            <Footer title={t("HEADER_WELCOME")} description={t("HEADER_WELCOME_SUB")}></Footer>
        </>)
    }
    return <Outlet />
}