import useWebSocket from "react-use-websocket";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import pingWebSocket from "../../../../util/pingWebSocket.js";
import {heartbeats} from "../../../../util/heartbeats.js";

export default function useGateway(url, enabled) {
    const {apiKeys, setApiKeys} = useContext(AppContext);
    const heartbeat = useRef(-1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const gatewaySocket = useWebSocket(url, {
        onMessage: async (message) => {
            const eventData = JSON.parse(message.data);
            switch(eventData.event) {
                case "authenticate":
                    setIsAuthenticated(true);
                    break;
                case "gatekeeperMeasure": {
                    setApiKeys(prevApiKeys => ({...prevApiKeys, gatekeeperSession: eventData.sessionId}))

                    const finalMeasurement = {"event": "gatekeeperMeasure", "gateways": [], "appServers": []};
                    for (const appServer of eventData.appServers) {
                        let startTime = performance.now();
                        await fetch(`${appServer.baseUrl}/v4/ping`);
                        let requestTime = performance.now() - startTime;
                        finalMeasurement.appServers.push({instanceId: appServer.instanceId, latency: requestTime})
                    }
                    for (const gateway of eventData.gateways) {
                        const requestTime = await pingWebSocket(gateway.gateway);
                        finalMeasurement.gateways.push({instanceId: gateway.instanceId, latency: requestTime})
                    }

                    gatewaySocket.sendJsonMessage(finalMeasurement);
                    break;
                }
                case "gatekeeperSelection":
                    setApiKeys(prevApiKeys => ({...prevApiKeys, baseURL: eventData.appServer, gatewayURL: eventData.gateway}));
                    break;
            }
        },
        onOpen: async () => {
            setIsAuthenticated(false);
            gatewaySocket.sendJsonMessage({
                event: "authenticate", "token": apiKeys.accessToken,
                ...(apiKeys.gatekeeperSession ? { gatekeeperSession: apiKeys.gatekeeperSession } : {})
            });
        },
        onClose: async () => {
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

    return useMemo(() => ({
        ...gatewaySocket,
        isAuthenticated,
    }), [gatewaySocket.lastMessage, gatewaySocket.readyState, isAuthenticated]);
}