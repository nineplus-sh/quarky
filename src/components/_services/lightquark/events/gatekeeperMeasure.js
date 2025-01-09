import pingWebSocket from "../../../../util/pingWebSocket.js";
import median from "../../../../util/median.js";

export default async function gatekeeperMeasureHandler(eventData, setApiKeys, gatewaySocket) {
    setApiKeys(prevApiKeys => ({...prevApiKeys, gatekeeperSession: eventData.sessionId}))

    gatewaySocket.sendJsonMessage({
        event: "gatekeeperMeasure",
        ...(await testServerLatencies(eventData))
    });
}

const pingPerThing = 5;
export async function testServerLatencies({appServers, gateways}) {
    const finalMeasurement = {gateways: [], appServers: []}
    for (const appServer of appServers) {
        const pings = [];
        for(let i = 0; i < pingPerThing; i++) {
            let startTime = performance.now();
            await fetch(`${appServer.baseUrl}/v4/ping`);
            let requestTime = performance.now() - startTime;
            pings.push(requestTime);
        }
        finalMeasurement.appServers.push({instanceId: appServer.instanceId, latency: median(pings)})
    }
    for (const gateway of gateways) {
        const pings = [];
        for(let i = 0; i < pingPerThing; i++) {
            const requestTime = await pingWebSocket(gateway.gateway);
            pings.push(requestTime);
        }
        finalMeasurement.gateways.push({instanceId: gateway.instanceId, latency: median(pings)})
    }

    return finalMeasurement;
}