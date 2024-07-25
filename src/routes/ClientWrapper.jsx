import {useContext, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {AppContext, defaultSettings} from "../contexts/AppContext.js";
import LQ from "../util/LQ.js";
import useWebSocket from "react-use-websocket";
import localForage from "localforage";
import styles from "./ClientWrapper.module.css";
import Loader from "./Loader.jsx";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function ClientWrapper() {
    const [clientReady, setClientReady] = useState(false);
    const [lqSockURL, setLqSockURL] = useState(null);
    const [heartbeatMessage] = useState("*gurgles*");
    const navigate = useNavigate();
    const {userCache, 
        setUserCache, 
        accounts, 
        setMessageCache,
        settings, saveSettings} = useContext(AppContext)
    const {pathname} = useLocation();
    const [loadingString, setLoadingString] = useState("LOADING_WEBSOCKET");

    const lqSock = useWebSocket(lqSockURL, {
        onMessage: (message) => {
            const eventData = JSON.parse(message.data);
            switch(eventData.event) {
                case "messageCreate":
                    setMessageCache(p => {
                        if(!p[eventData.channelId]) p[eventData.channelId] = [];
                        p[eventData.channelId].push(eventData.message)
                        return structuredClone(p);
                    });
                    break;
                case "userUpdate":
                    if (!userCache[eventData.user._id]) {
                        setUserCache(p => {
                            p[eventData.user._id] = eventData.user;
                            return p;
                        })
                    } else {
                        setUserCache(p => {
                            let status = p[eventData.user._id]?.status
                            p[eventData.user._id] = eventData.user;
                            p[eventData.user._id].status = status;
                            return structuredClone(p);
                        })
                    }
                    break;
                case "statusUpdate":
                    setUserCache(p => {
                        p[eventData.user._id] = eventData.user;
                        return structuredClone(p);
                    })
                    break;
                case "messageUpdate":
                    setMessageCache(p => {
                        if(!p[eventData.channelId]) {
                            p[eventData.channelId] = [];
                            p[eventData.channelId].push(eventData.message);
                        } else {
                            const old = p[eventData.channelId].findIndex((message) => eventData.message._id === message._id);
                            if(old) {
                                p[eventData.channelId][old] = eventData.message;
                            } else {
                                p[eventData.channelId].push(eventData.message);
                            }
                        }
                        return structuredClone(p);
                    });
                    break;
                case "preferenceUpdate":
                    if(eventData.preference.namespace !== "quarky") return;
                    saveSettings({[eventData.preference.key]:
                            eventData.preference.value ?
                                typeof defaultSettings[eventData.preference.key] === "object" ?
                                    JSON.parse(eventData.preference.value) :
                                        eventData.preference.value
                            : defaultSettings[eventData.preference.key]
                    }, false)
                    break;
                default:
                    //console.log("Well.. THAT just happened!", message.data)
            }
        },
        onOpen: async () => {
            lqSock.sendJsonMessage({event: "authenticate", "token": (await localForage.getItem("lightquark")).token});
        },
        heartbeat: { // Send heartbeat to gateway every 15 seconds
            message: JSON.stringify({event: "heartbeat", message: heartbeatMessage}),
            interval: 15000
        }
    })

    useEffect(() => {(async () => {
        if(pathname === "/") navigate("/lq_100000000000000000000000");

        if (accounts.lightquark && !lqSockURL) {
            const network = await LQ("network"); // TODO: Add NetworkOfflineModal here as well
            setLqSockURL(network.raw.gateway)
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
    })()}, [accounts]);

    return (<>
        {clientReady ?
            <div className={styles.client}>
                <Outlet/>
            </div>
        : <Loader loadingString={loadingString}/>}
    </>)
}