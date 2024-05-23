import {useContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import { ClientContext } from "../contexts/ClientContext.js";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";
import {AppContext} from "../contexts/AppContext.js";
import LQ from "../util/LQ.js";
import useWebSocket from "react-use-websocket";
import localForage from "localforage";
import GenericQuark from "../components/nav/GenericQuark.jsx";
import styles from "./Client.module.css"
import NiceModal from "@ebay/nice-modal-react";
import NetworkUnsupportedModal from "../components/modals/NetworkUnsupportedModal.jsx";
import JoinQuark from "../components/_services/lightquark/nav/JoinQuark.jsx";
import Loader from "./Loader.jsx";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Client() {
    let [avatarCache, setAvatarCache] = useState({});
    let [resolvedAvatarCache, setResolvedAvatarCache] = useState({});
    const [clientReady, setClientReady] = useState(false);
    const [lqSockURL, setLqSockURL] = useState(null);
    const [lqSockToken, setLqSockToken] = useState(null);
    const [heartbeatMessage, setHeartbeatMessage] = useState("*gurgles*");
    const appContext = useContext(AppContext)

    const lqSock = useWebSocket(lqSockURL, {
        onMessage: (message) => {
            const eventData = JSON.parse(message.data);
            switch(eventData.event) {
                case "messageCreate":
                    appContext.setMessageCache(previousValue => {
                        previousValue = { ...previousValue }
                        if(!previousValue[eventData.channelId]) previousValue[eventData.channelId] = [];
                        previousValue[eventData.channelId].push(eventData.message)
                        return previousValue;
                    });
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
        if (appContext.accounts.lightquark && !lqSockURL) {
            const network = await LQ("network"); // TODO: Add NetworkOfflineModal here as well
            if(!network.raw.cdnBaseUrl) {
                return NiceModal.show(NetworkUnsupportedModal, { name: `${network.raw.name} (${network.raw.linkBase})`, maintainer: network.raw.maintainer, signOut: true });
            }
            setLqSockURL(network.raw.gateway)
        }

        if(window.hiddenside.hardcoreGaming && window.hiddenside.casualGaming) {
            const gameData = await fetch("https://gameplus.nineplus.sh/api/games").then(res => res.json());
            window.hiddenside.hardcoreGaming(gameData);

            window.hiddenside.casualGaming((games) => {
                /*if(games.length !== 0) {
                    LQ("user/me/status", "PUT", {
                        "type": "playing",
                        "name": games[0].name,
                        "primaryImage": `https://gameplus.nineplus.sh/game/${games[0]._id}/icon`
                    })
                }*/
            })
        }

        setClientReady(true);
    })()}, [appContext.accounts]);

    return (<>
        <ClientContext.Provider value={{
            avatarCache, setAvatarCache,
            resolvedAvatarCache, setResolvedAvatarCache
        }}>{clientReady ?
            <div className={styles.client}>
                <div className={styles.quarkList}>
                    <QuarkList/>
                    <JoinQuark/>
                </div>
                <Outlet/>
            </div>
        : <Loader/>}</ClientContext.Provider>
    </>)
}