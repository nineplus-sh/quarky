import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import localForage from "localforage";
import LQ from "../../../../util/LQ.js";
import {useUnleashContext} from "@unleash/proxy-client-react";
import NiceModal from "@ebay/nice-modal-react";
import NetworkOfflineModal from "../../../modals/NetworkOfflineModal.jsx";
import {useTranslation} from "react-i18next";
import styles from "./LightquarkLogin.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

export default function LightquarkLogin({setDone}) {
    const appContext = useContext(AppContext);
    const updateContext = useUnleashContext();
    const [network, setNetwork] = useState('https://lightquark.network');
    const [oldNetwork, setOldNetwork] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();
    const [networkData, setNetworkData] = useState({});
    const [tab, switchTab] = useState("login");
    const [networkSwitch, setNetworkSwitch] = useState('');
    const [isSwitching, setSwitching] = useState(false);

    useEffect( () => {
        async function getNetworkInfo() {
            if(network === oldNetwork) return;
            setSwitching(true);

            try {
                const NETWORKdata = await LQ("network", "GET", {}, true, {
                    network: {
                        baseUrl: network,
                        version: "v4"
                    }
                })

                setOldNetwork(network);
                setNetworkData(NETWORKdata.raw);
                setNetworkSwitch("");
                setSwitching(false);
                if(tab === "network") switchTab("login");
            } catch(e) {
                NiceModal.show(NetworkOfflineModal, {name: network});
                setNetworkSwitch("");
                setSwitching(false);
                setNetwork(oldNetwork);
            }
        }
        getNetworkInfo();
    }, [network]);

    async function switchNetwork(e) {
        e.preventDefault();
        setOldNetwork(network);
        setNetwork(networkSwitch);
    }

    async function tokenByLogin(e) {
        e.preventDefault();
        setSwitching(true);

        const tokens = await LQ("auth/token", "POST", {email, password}, true, {
            network: {
                baseUrl: network,
                version: "v4"
            }
        })
        if(tokens.request.success === true) {
            finalizeLogin(tokens.response.access_token, tokens.response.refresh_token)
        } else {
            new Audio(appContext.nyafile.getCachedData("sfx/error")).play();
            setTimeout(() => alert(tokens.response.message), 5);
            setSwitching(false);
        }
    }

    async function finalizeLogin(accessToken, refreshToken) {
        await localForage.setItem("lightquark", {
            network: {
                baseUrl: network,
                version: "v4"
            },
            token: accessToken,
            refreshToken: refreshToken
        })

        const userInfos = (await LQ("user/me")).response.user;
        await updateContext({lqId: userInfos._id})
        appContext.setAccounts(prev => ({...prev, "lightquark": userInfos}));

        localStorage.setItem("USER_AUTHED", "bet");
        setSwitching(false);
        setDone(true);
    }

    // regarding escapeValue here: while it may seem like a hole for an XSS attack i tried and brackets are still escaped
    return (
        <>
            <div className={styles.networkInfoArea}>
                <div className={styles.networkInfo}>
                    <img className={styles.networkLogo} src={networkData.iconUrl}/>
                    <div className={styles.networkDetails}>
                        <p className={styles.networkName}>{networkData.name} <button onClick={() => switchTab("network")}>{t("LOGIN_SWITCH_NETWORKS")}</button></p>
                        <p className={styles.networkMetadata}>{t("LOGIN_NETWORK_BYLINE", {domain: networkData.linkBase, version: networkData.version, maintainer: networkData.maintainer, interpolation: { escapeValue: false }})}</p>
                    </div>
                </div>
                <Markdown className={styles.networkDescription} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {"target": "_blank", "rel": ["noreferrer", "noopener", "nofollow"]}]]}>{networkData.description}</Markdown>
            </div>

            {tab === "login" ? <>
                <p>Sign into {networkData.name} below:</p>
                <form onSubmit={tokenByLogin} className={styles.loginForm}>
                    <input className={styles.loginInput} required type="email" placeholder="hakase@litdevs.org" value={email} onChange={e => setEmail(e.target.value)} />
                    <input className={styles.loginInput} required type="password" placeholder="(password)" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className={`${styles.prettyButton} ${styles.otherButton}`} type="button" disabled={isSwitching} onClick={() => switchTab("create")}>{t("LOGIN_CREATE_ACCOUNT")}</button>
                    <input className={`${styles.prettyButton} ${styles.primaryButton}`} type="submit" disabled={isSwitching || Object.keys(networkData).length === 0} value={t(isSwitching ? "LOGIN_SIGNING_IN" : "GO")}/>
                </form>
            </> : tab === "network" ? <>
                <p>{t("LOGIN_SWITCH_NETWORKS_BODY", {name: networkData.name})}</p>
                <form onSubmit={switchNetwork} className={styles.loginForm}>
                    <input className={styles.loginInput} required disabled={isSwitching} type="text" placeholder={network} value={networkSwitch} onChange={e => setNetworkSwitch(e.target.value)}/>
                    <input className={`${styles.prettyButton} ${styles.otherButton}`} type="submit" disabled={isSwitching} value={t(isSwitching ? "LOGIN_SWITCHING_NETWORKS" : "LOGIN_SWITCH_NETWORKS")}/>
                    <button className={`${styles.prettyButton} ${styles.primaryButton}`} type="button" disabled={isSwitching} onClick={() => switchTab("login")}>{t("BACK")}</button>
                </form>
            </> : tab === "create" ? <>
                <p>Account creation is not yet available.</p>
                <form onSubmit={(e) => e.preventDefault()} className={styles.loginForm}>
                    <button className={`${styles.prettyButton} ${styles.otherButton}`} onClick={() => switchTab("login")}>{t("BACK")}</button>
                </form>
            </> : null}
        </>
    );
}
