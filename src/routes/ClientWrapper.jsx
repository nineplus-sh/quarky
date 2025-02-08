import {useContext, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {AppContext, defaultSettings} from "../contexts/AppContext.js";
import LQ from "../util/LQ.js";
import styles from "./ClientWrapper.module.css";
import Loader from "./Loader.jsx";
import useGateway from "../components/_services/lightquark/hooks/useGateway.js";
import {WebSocketContext} from "../contexts/WebSocketContext.js";
import useRPC from "../components/_services/lightquark/hooks/useRPC.js";
import useOnceWhen from "../util/useOnceWhen.js";
import {flushSync} from "react-dom";
import useSound from "../hooks/useSound.js";
import useSettings from "../components/_services/lightquark/hooks/useSettings.js";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function ClientWrapper() {
    const [clientReady, setClientReady] = useState(false);
    const navigate = useNavigate();
    const {apiKeys, setApiKeys, refreshOverHTTP} = useContext(AppContext);
    const {setSocket} = useContext(WebSocketContext);
    const {pathname} = useLocation();
    const [loadingString, setLoadingString] = useState("LOADING_WEBSOCKET");
    const apiCall = useRPC();

    const gateway = useGateway(apiKeys.gatewayURL, !!apiKeys.gatewayURL);
    const {data: settings, refetch: refetchSettings, isSuccess: settingsReady} = useSettings();

    const {play: crossfadePlay} = useSound("sfx/crossfade");

    useEffect(() => {(async () => {
        if(pathname === "/") navigate("/lq_100000000000000000000000");

        await refreshOverHTTP();

        if (!apiKeys.gatewayURL) {
            const network = await fetch(`${apiKeys.baseURL}/v4/network`).then(res => res.json());
            setApiKeys(prevApiKeys => ({...prevApiKeys, baseURL: network.baseUrl, gatewayURL: network.gateway, cdnURL: network.cdnBaseUrl}));
            setSocket(gateway);
        }
    })()}, []);

    useEffect(() => {
        if (gateway) {
            setTimeout(() => {
                flushSync(() => {
                    setSocket(gateway);
                });
            }, 0);
        }
    }, [gateway, setSocket]);

    useOnceWhen(gateway.isAuthenticated, true, async () => {
        setLoadingString("LOADING_SETTINGS");
        await refetchSettings();
        setLoadingString("HEADER_WELCOME");
        setClientReady(true);
    })

    useEffect(() => {
        let currentGameId = "BLELELELE"
        function gamesDetected(games) {
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
        }

        if(settings && settings.GAME_ACTIVITY && window.hiddenside && window.hiddenside.hardcoreGaming && window.hiddenside.casualGaming) {
            fetch("https://gameplus.nineplus.sh/api/games").then(res => res.json()).then(gameData => window.hiddenside.hardcoreGaming(gameData))
            window.hiddenside.casualGaming(gamesDetected);
        }
        return () => window.hiddenside?.stompOnCasuals(gamesDetected);
    }, [settings?.GAME_ACTIVITY]);

    return (<>
        {clientReady ? <>
            <Loader loadingString={loadingString} crossfade={true}/>
            <div className={styles.client}>
                <Outlet/>
            </div>
        </> : <Loader loadingString={loadingString}/>}
    </>)
}