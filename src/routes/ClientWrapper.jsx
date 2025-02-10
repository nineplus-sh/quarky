import {useContext, useEffect, useRef, useState} from "react";
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
import useStatusDelete from "../components/_services/lightquark/hooks/useStatusDelete.js";
import useStatusSet from "../components/_services/lightquark/hooks/useStatusSet.js";

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

    const gateway = useGateway(apiKeys.gatewayURL, !!apiKeys.gatewayURL);
    const {data: settings, refetch: refetchSettings} = useSettings();
    const gameID = useRef(null);
    const {mutate: setStatus} = useStatusSet();
    const {mutate: deleteStatus} = useStatusDelete();

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
        crossfadePlay();
    })

    useEffect(() => {
        if(!window.hiddenside || window.hiddenside.byeBaby) return;
        if(!settings?.GAME_ACTIVITY) return;

        fetch("https://gameplus.nineplus.sh/api/games").then(res => res.json()).then(gameData => window.hiddenside?.hardcoreGaming(gameData))

        const cleanupListener = window.hiddenside.casualGaming(async (games) => {
            if(games.length !== 0 && games[0]._id !== gameID.current) {
                gameID.current = games[0]._id
                setStatus({
                    "type": "playing",
                    "primaryText": games[0].name,
                    "primaryImageUri": `https://gameplus.nineplus.sh/game/${games[0]._id}/icon`,
                    "startTime": new Date()
                });
            } else if (games.length === 0 && gameID.current !== null) {
                await deleteStatus();
                gameID.current = null;
            }
        })

        return () => {
            cleanupListener();
            window.hiddenside?.hardcoreGaming(undefined);
        }
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