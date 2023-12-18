import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import changeMusic from "../components/nyafile/NyafileChangeMusic.js";
import TelegramQRCode from "../components/_services/telegram/login/TelegramQRCode.jsx";
import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import LightquarkLogin from "../components/_services/lightquark/login/LightquarkLogin.jsx";

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

    useEffect(() => {
        if(appContext.accounts[service]) setService("")
    }, [appContext.accounts]);

    if(Object.keys(appContext.accounts).length === 0 || (!done && !prevAuthed)) {
        return (<>
            <SpaceBackground />
            <Header title={"Welcome to Quarky~"} description={"Let's sign in to use it now!"}></Header>

            <div style={{color: "white"}}>
                <h2>Sign in with the services you want Quarky to use.</h2>

                {{ lightquark: <LightquarkLogin/>,
                    telegram: <TelegramQRCode/>
                }[service]}

                <button onClick={()=>setService("lightquark")} disabled={appContext.accounts.lightquark}>Lightquark</button>
                <button onClick={()=>setService("telegram")} disabled={appContext.accounts.telegram}>Telegram</button>
                <button onClick={()=>alert("Discord support not implemented yet ;~;")} disabled={appContext.accounts.discord}>Discord</button>

                <button onClick={function(){
                    if(Object.keys(appContext.accounts).length === 0) return alert("lol no");
                    localStorage.setItem("USER_AUTHED", "bet");
                    setDone(true);
                }}>I&apos;m done!</button>
            </div>
        </>)
    }
    return <Outlet />
}