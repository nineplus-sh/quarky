import {useContext, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {AppContext, defaultSettings} from "../contexts/AppContext.js";
import LQ from "../util/LQ.js";
import useWebSocket from "react-use-websocket";
import localForage from "localforage";
import styles from "./ClientWrapper.module.css";
import Loader from "./Loader.jsx";
import useGateway from "../components/_services/lightquark/hooks/useGateway.js";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function ClientWrapper() {
    const [clientReady, setClientReady] = useState(false);
    const navigate = useNavigate();
    const {apiKeys, setApiKeys,
        settings, saveSettings,
        setQuarkCache, setQuarkList} = useContext(AppContext)
    const {pathname} = useLocation();
    const [loadingString, setLoadingString] = useState("LOADING_WEBSOCKET");

    const firstGateway = useGateway(apiKeys.gatewayURL, !!apiKeys.gatewayURL)
    //const secondGateway = useGateway(apiKeys.gatewayURL, !!apiKeys.gatewayURL)

    useEffect(() => {(async () => {
        if(pathname === "/") navigate("/lq_100000000000000000000000");

        if (!apiKeys.gatewayURL) {
            const network = await fetch(`${apiKeys.baseURL}/v4/network`).then(res => res.json());
            setApiKeys({...apiKeys, baseURL: network.baseUrl, gatewayURL: network.gateway})
        }

        setLoadingString("LOADING_SETTINGS");
        const grabbedSettings = (await LQ("user/me/preferences/quarky")).response.preferences;
        Object.entries(grabbedSettings).forEach(([key, value]) => {
            key = key.toUpperCase();
            if(typeof defaultSettings[key] === "object") value = JSON.parse(value);
            if(settings[key] !== value) saveSettings({
                [key]: value
            }, false)
        })

        setLoadingString("LOADING_QUARKS");
        const urQuarkList = (await LQ("quark")).response.quarks;
        setQuarkCache(Object.fromEntries(urQuarkList.map(quark => [quark._id, quark])));
        setQuarkList(urQuarkList.map(quark => quark._id));

        if(settings["GAME_ACTIVITY"] && window.hiddenside && window.hiddenside.hardcoreGaming && window.hiddenside.casualGaming) {
            setLoadingString("LOADING_GAMES");
            fetch("https://gameplus.nineplus.sh/api/games").then(res => res.json()).then(gameData => window.hiddenside.hardcoreGaming(gameData))

            // Not using state here since the value is only used inside this effect
            // A state would not update since no new render 
            let currentGameId = "BLELELELE"
            window.hiddenside.casualGaming((games) => {
                if(games.length !== 0 && games[0]._id !== currentGameId) {
                    console.log(`Now playing ${games[0].name} ${games[0]._id}`)
                    currentGameId = games[0]._id
                    const formData = new FormData();
                    formData.append("payload", JSON.stringify({
                        "type": "playing",
                        "primaryText": games[0].name,
                        "primaryImageUri": `https://gameplus.nineplus.sh/game/${games[0]._id}/icon`,
                        "startTime": new Date()
                    }));

                    LQ("user/me/status", "PUT", formData)
                } else if (games.length === 0 && currentGameId !== "BLELELELE") {
                    currentGameId = "BLELELELE"
                    LQ("user/me/status", "DELETE")
                }
            })
        }

        setClientReady(true);
    })()}, []);

    return (<>
        {clientReady ?
            <div className={styles.client}>
                <Outlet/>
            </div>
        : <Loader loadingString={loadingString}/>}
    </>)
}