import useWebSocket from "react-use-websocket";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import pingWebSocket from "../../../../util/pingWebSocket.js";
import {heartbeats} from "../../../../util/heartbeats.js";
import gatekeeperMeasureHandler from "../events/gatekeeperMeasure.js";
import {useQueryClient} from "@tanstack/react-query";
import messageCreateHandler from "../events/messageCreate.js";
import messageDeleteHandler from "../events/messageDelete.js";
import messageUpdateHandler from "../events/messageUpdate.js";

export default function useGateway(url, enabled) {
    const {apiKeys, setApiKeys} = useContext(AppContext);
    const heartbeat = useRef(-1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const queryClient = useQueryClient();

    const gatewaySocket = useWebSocket(url, {
        onMessage: async (message) => {
            const eventData = JSON.parse(message.data);
            switch(eventData.event) {
                case "authenticate":
                    setIsAuthenticated(true);
                    break;
                case "gatekeeperMeasure": {
                    gatekeeperMeasureHandler(eventData, setApiKeys, gatewaySocket)
                    break;
                }
                case "gatekeeperSelection":
                    setApiKeys(prevApiKeys => ({...prevApiKeys, baseURL: eventData.appServer, gatewayURL: eventData.gateway}));
                    break;

                case "messageCreate":
                    messageCreateHandler(eventData, queryClient);
                    break;
                case "messageUpdate":
                    messageUpdateHandler(eventData, queryClient);
                    break;
                case "messageDelete":
                    messageDeleteHandler(eventData, queryClient);
                    break;
            }
        },
        onOpen: async () => {
            setIsAuthenticated(false);
            console.warn("USEGATEWAY OPENED")
            gatewaySocket.sendJsonMessage({
                event: "authenticate", "token": apiKeys.accessToken,
                ...(apiKeys.gatekeeperSession ? { gatekeeperSession: apiKeys.gatekeeperSession } : {})
            });
        },
        onClose: async () => {
            console.warn("USEGATEWAY DEAUTHENTICATION")
            setIsAuthenticated(false);
        },
        heartbeat: {
            message: () => {
                heartbeat.current += 1;
                if(heartbeat.current > heartbeats.length) heartbeat.current = 0;

                return JSON.stringify({event: "heartbeat", message: heartbeats[heartbeat.current]})
            },
            interval: 15000
        }
    }, enabled)

    useEffect(() => {
        console.warn("Wow look at this kawaii message;", gatewaySocket.lastJsonMessage)
    }, [gatewaySocket.lastJsonMessage]);

    return useMemo(() => ({
        ...gatewaySocket,
        isAuthenticated,
    }), [url, gatewaySocket.lastMessage, gatewaySocket.readyState, isAuthenticated]);
}