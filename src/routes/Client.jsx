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

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Client() {
    let [avatarCache, setAvatarCache] = useState({});
    let [resolvedAvatarCache, setResolvedAvatarCache] = useState({});
    const [lqSockURL, setLqSockURL] = useState(null);
    const [lqSockToken, setLqSockToken] = useState(null);
    const [heartbeatMessage, setHeartbeatMessage] = useState("*gurgles*");
    const [quarks, setQuarks] = useState(undefined);
    const appContext = useContext(AppContext)

    const lqSock = useWebSocket(lqSockURL, {
        protocols: lqSockToken,
        onMessage: (message) => {
            const eventData = JSON.parse(message.data);
            switch(eventData.eventId) {
                case "messageCreate":
                    appContext.setMessageCache(previousValue => {
                        previousValue = { ...previousValue }
                        if(!previousValue[eventData.message.channelId]) previousValue[eventData.message.channelId] = [];
                        previousValue[eventData.message.channelId].push(eventData)
                        return previousValue;
                    });
                    break;
                default:
                    //console.log("Well.. THAT just happened!", message.data)
            }
        },
        onOpen: () => {
            quarks.forEach(function(quark) {
                lqSock.sendJsonMessage({event: "subscribe", "message": `quark_${quark._id}`})
                quark.channels.forEach(channel => lqSock.sendJsonMessage({event: "subscribe", "message": `channel_${channel._id}`}))
            })
        },
        heartbeat: { // Send heartbeat to gateway every 15 seconds
            message: JSON.stringify({event: "heartbeat", message: heartbeatMessage}),
            interval: 15000
        }
    })

    useEffect(() => {(async () => {
        if (appContext.accounts.lightquark && !lqSockURL) {
            const network = await LQ("network");
            const quarks = await LQ("quark/me");
            setQuarks(quarks.response.quarks);
            setLqSockToken((await localForage.getItem("lightquark")).token)
            setLqSockURL(network.raw.gateway)
        }
    })()}, [appContext.accounts]);

    return (<>
        <ClientContext.Provider value={{
            avatarCache, setAvatarCache,
            resolvedAvatarCache, setResolvedAvatarCache
        }}>
            <div className={styles.client}>
                {appContext.accounts.lightquark ? <div className={styles.quarkList}>
                    {appContext.accounts.telegram ? <GenericQuark link={"/telegram"} icon={appContext.nyafile.getCachedData("img/telegram_quark")}/> : null}
                    {appContext.accounts.lightquark ? <QuarkList/> : null}
                </div> : null}
                <Outlet/>
            </div>
        </ClientContext.Provider>
    </>)
}