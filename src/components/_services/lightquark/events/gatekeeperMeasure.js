import pingWebSocket from "../../../../util/pingWebSocket.js";

export default async function gatekeeperMeasureHandler(eventData, setApiKeys, gatewaySocket) {
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
}