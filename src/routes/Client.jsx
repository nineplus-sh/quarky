import {useContext, useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";
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
    let [userCache, setUserCache] = useState({})
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const {quarkId} = useParams();

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
                            return p
                        })
                    }
                    break;
                case "statusUpdate":
                    console.log(`Status of ${eventData.user.username} changed!`, eventData.user?.status)
                    setUserCache(p => {
                        p[eventData.user._id] = eventData.user;
                        return p;
                    })
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
        if(!quarkId) navigate("/lq_100000000000000000000000");

        if (appContext.accounts.lightquark && !lqSockURL) {
            const network = await LQ("network"); // TODO: Add NetworkOfflineModal here as well
            if(!network.raw.cdnBaseUrl) {
                return NiceModal.show(NetworkUnsupportedModal, { name: `${network.raw.name} (${network.raw.linkBase})`, maintainer: network.raw.maintainer, signOut: true });
            }
            setLqSockURL(network.raw.gateway)
        }

        if(window.hiddenside && window.hiddenside.hardcoreGaming && window.hiddenside.casualGaming) {
            const gameData = await fetch("https://gameplus.nineplus.sh/api/games").then(res => res.json());
            window.hiddenside.hardcoreGaming(gameData);

            // Not using state here since the value is only used inside this effect
            // A state would not update since no new render 
            let currentGameId = "BLELELELE"
            window.hiddenside.casualGaming((games) => {
                console.log(games, currentGameId)
                if(games.length !== 0 && games[0]._id !== currentGameId) {
                    console.log(`Now playing ${games[0].name} ${games[0]._id}`)
                    currentGameId = games[0]._id
                    const formData = new FormData();
                    formData.append("payload", JSON.stringify({
                        "type": "playing",
                        "primaryText": games[0].name,
                        "primaryImageUri": `https://gameplus.nineplus.sh/game/${games[0]._id}/icon`
                    }));

                    LQ("user/me/status", "PUT", formData)
                } else if (games.length === 0 && currentGameId !== "BLELELELE") {
                    currentGameId = "BLELELELE"
                    LQ("user/me/status", "DELETE")
                }
            })
        }

        setClientReady(true);
    })()}, [appContext.accounts]);

    return (<>
        <ClientContext.Provider value={{
            avatarCache, setAvatarCache,
            resolvedAvatarCache, setResolvedAvatarCache,
            userCache, setUserCache
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