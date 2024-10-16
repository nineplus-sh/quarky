import Header from "../components/nav/Header.jsx";
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

    const {data, isLoading} = useMe();
    const needsAuth = !isLoading && data == null;

    useEffect(() => {
        if(needsAuth && !firstTime) {
            NiceModal.show(FirstTimeModal, {playMusic: setPlayMusic});
        } else {
            setPlayMusic(true);
        }
    }, []);

    if(isLoading) return <Loader loadingString={"LOADING_WEBSOCKET"} />;
    if(needsAuth) {
        return (<>
            <audio src={appContext.nyafile.getCachedData("music/login")} loop={true} ref={musicTag}/>

            <SpaceBackground />
            <Header title={t("HEADER_WELCOME")} description={t("HEADER_WELCOME_SUB")}></Header>

            <LoginModal />
        </>)
    }
    return <Outlet />
}