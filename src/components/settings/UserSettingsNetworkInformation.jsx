import {AppContext} from "../../contexts/AppContext.js";
import {useContext, useState} from "react";
import useNetwork from "../_services/lightquark/hooks/useNetwork.js";
import ProfilePicture from "../dialogs/ProfilePicture.jsx";
import IDstyles from "../_services/lightquark/settings/SettingsID.module.css";
import styles from "./UserSettingsNetworkInformation.module.css";
import {useTranslation} from "react-i18next";
import Button from "../nav/Button.jsx";
import {testServerLatencies} from "../_services/lightquark/events/gatekeeperMeasure.js";
import classnames from "classnames";

export default function UserSettingsNetworkInformation() {
    const {apiKeys} = useContext(AppContext);
    const {data: network, isSuccess} = useNetwork();
    const {t} = useTranslation();

    const [isTesting, setTesting] = useState(false);
    const [latencies, setLatencies] = useState(null);
    async function testLatencies(){
        setTesting(true);
        setLatencies(await testServerLatencies({appServers: network.availableAppServers, gateways: network.availableGateways}));
        setTesting(false);
    }

    if(!isSuccess) return null;

    const appServer = network.availableAppServers.filter(appServer => appServer.baseUrl === apiKeys.baseURL)?.[0].instanceId;
    const gateway = network.availableGateways.filter(gateway => gateway.gateway === apiKeys.gatewayURL)?.[0].instanceId;

    return <>
        <div className={styles.infoPanelWrap}>
            <div className={IDstyles.userInfoWrap}>
                <ProfilePicture src={network.iconUrl} px={80}/>
                <div className={IDstyles.userNameWrap}>
                    <div className={IDstyles.userName}>{network.name}</div>
                    <div className={IDstyles.userJoinTime}>{t("LOGIN_NETWORK_BYLINE", {
                        domain: network.linkBase,
                        version: network.version,
                        maintainer: network.maintainer,
                        interpolation: {escapeValue: false}
                    })}</div>
                </div>
            </div>
            <br/>
            <div className={styles.servers}>
                <div className={IDstyles.userInfoWrap}>
                    <ProfilePicture src={apiKeys.cdnURL + "/instance/" + appServer} px={64} isPurring={isTesting}/>
                    <div className={IDstyles.userNameWrap}>
                        <div className={IDstyles.userName} title={apiKeys.baseURL}>{appServer}</div>
                        <div className={IDstyles.userJoinTime}>app server</div>
                    </div>
                </div>
                <div className={IDstyles.userInfoWrap}>
                    <ProfilePicture src={apiKeys.cdnURL + "/instance/" + gateway} px={64} isPurring={isTesting}/>
                    <div className={IDstyles.userNameWrap}>
                        <div className={IDstyles.userName} title={apiKeys.gatewayURL}>{gateway}</div>
                        <div className={IDstyles.userJoinTime}>gateway</div>
                    </div>
                </div>
            </div>

            <br/><Button onClick={testLatencies} disabled={isTesting}>Test pings</Button><br/>
            {latencies ? <div className={styles.latencies}>
                <span className={styles.latencyType}>
                    {latencies.appServers.sort((a,b) => a.latency - b.latency).map((server, index) => <LatencyItem key={server.instanceId} name={server.instanceId} latency={server.latency} current={server.instanceId === appServer}/>)}
                </span>
                <span className={styles.latencyType}>
                    {latencies.gateways.sort((a,b) => a.latency - b.latency).map((server, index) => <LatencyItem key={server.instanceId} name={server.instanceId} latency={server.latency} current={server.instanceId === gateway}/>)}
                </span>
            </div>: null}
        </div>
    </>
}

function LatencyItem({name, latency, current}) {
    return <span className={classnames({[styles.current]: current})}>{name}: {Math.floor(latency)}</span>
}