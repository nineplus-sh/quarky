import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import changeMusic from "../components/nyafile/NyafileChangeMusic.js";
import TelegramQRCode from "../components/_services/telegram/login/TelegramQRCode.jsx";
import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext} from "react";
import LightquarkLogin from "../components/_services/lightquark/login/LightquarkLogin.jsx";

/**
 * The authentication needed ("login") screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function AuthenticationNeeded() {
    const appContext = useContext(AppContext);
    if(Object.keys(appContext.accounts).length < 2) {
        changeMusic("music/login");
        return (<>
            <SpaceBackground />
            <Header title={"Welcome to Quarky~"} description={"Let's sign in to use it now!"}></Header>

            <div style={{color: "white"}}>
                {appContext.accounts.telegram ? <LightquarkLogin /> : <TelegramQRCode />}
            </div>
        </>)
    }
    return <Outlet />
}