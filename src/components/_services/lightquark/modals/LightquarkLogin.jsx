import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import localForage from "localforage";
import LQ from "../../../../util/LQ.js";
import NiceModal from "@ebay/nice-modal-react";
import NetworkOfflineModal from "../../../modals/NetworkOfflineModal.jsx";
import {Trans, useTranslation} from "react-i18next";
import styles from "./LightquarkLogin.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

export default function LightquarkLogin() {
    const appContext = useContext(AppContext);
    const [network, setNetwork] = useState('https://lightquark.network');
    const [oldNetwork, setOldNetwork] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();
    const [networkData, setNetworkData] = useState({});
    const [tab, switchTab] = useState("login");
    const [networkSwitch, setNetworkSwitch] = useState('');
    const [isSwitching, setSwitching] = useState(true);

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

    async function tokenBySignup(e) {
        e.preventDefault();
        setSwitching(true);

        const tokens = await LQ("auth/register", "POST", {username, email, password}, true, {
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

        appContext.setApiKeys({
            baseURL: network,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    }

    // regarding escapeValue here: while it may seem like a hole for an XSS attack i tried and brackets are still escaped
    if(tab === "login" && isSwitching) return(
        <>
            <p>{t("LOGIN_NETWORK_FETCHING")}</p>
        </>
    )
    return (
        <>
            <div className={styles.networkInfoArea}>
                <div className={styles.networkInfo}>
                    <img className={styles.networkLogo} src={networkData.iconUrl}/>
                    <div className={styles.networkDetails}>
                        <p className={styles.networkName}>{networkData.name} <button disabled={isSwitching} onClick={() => switchTab("network")}>{t("LOGIN_SWITCH_NETWORKS")}</button></p>
                        <p className={styles.networkMetadata}>{t("LOGIN_NETWORK_BYLINE", {domain: networkData.linkBase, version: networkData.version, maintainer: networkData.maintainer, interpolation: { escapeValue: false }})}</p>
                    </div>
                </div>
                <Markdown className={styles.networkDescription} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {"target": "_blank", "rel": ["noreferrer", "noopener", "nofollow"]}]]}>{networkData.description}</Markdown>
            </div>

            {tab === "login" ? <>
                <p>{t("LOGIN_SIGN_IN_FORM", {name: networkData.name})}</p>
                <form onSubmit={tokenByLogin} className={styles.loginForm}>
                    <input className={styles.loginInput} required type="email" placeholder={t("LOGIN_EMAIL")} value={email} onChange={e => setEmail(e.target.value)} />
                    <input className={styles.loginInput} required type="password" placeholder={t("LOGIN_PASSWORD")} value={password} onChange={e => setPassword(e.target.value)} />
                    <input className={`${styles.prettyButton} ${styles.primaryButton}`} type="submit" disabled={isSwitching || Object.keys(networkData).length === 0} value={t(isSwitching ? "LOGIN_SIGNING_IN" : "GO")}/>
                </form>
            </> : tab === "network" ? <>
                <p><Trans i18nKey={"LOGIN_SWITCH_NETWORKS_BODY"} values={{name: networkData.name}} components={[<a href={"https://youtrack.litdevs.org/articles/LQ4-A-1"} target={"_blank"} rel={"noreferrer"}/>]}></Trans></p>
                <form onSubmit={switchNetwork} className={styles.loginForm}>
                    <input className={styles.loginInput} required disabled={isSwitching} type="text" placeholder={network} value={networkSwitch} onChange={e => setNetworkSwitch(e.target.value)}/>
                    <input className={`${styles.prettyButton} ${styles.otherButton}`} type="submit" disabled={isSwitching} value={t(isSwitching ? "LOGIN_SWITCHING_NETWORKS" : "LOGIN_SWITCH_NETWORKS")}/>
                    <button className={`${styles.prettyButton} ${styles.primaryButton}`} type="button" disabled={isSwitching} onClick={() => switchTab("login")}>{t("BACK")}</button>
                </form>
            </> : tab === "create" ? <>
                <p>{t("LOGIN_SIGN_UP_FORM", {name: networkData.name})}</p>
                <form onSubmit={tokenBySignup} className={styles.loginForm}>
                    <input className={styles.loginInput} required type="text" placeholder={t("LOGIN_USERNAME")}
                           value={username} onChange={e => setUsername(e.target.value)}/>
                    <input className={styles.loginInput} required type="email" placeholder={t("LOGIN_EMAIL")}
                           value={email} onChange={e => setEmail(e.target.value)}/>
                    <input className={styles.loginInput} required type="password" placeholder={t("LOGIN_PASSWORD")}
                           value={password} onChange={e => setPassword(e.target.value)}/>

                    <button className={`${styles.prettyButton} ${styles.otherButton}`} type="button"
                            onClick={() => switchTab("login")}>{t("BACK")}</button>
                    <input className={`${styles.prettyButton} ${styles.primaryButton}`} type="submit"
                           disabled={isSwitching || Object.keys(networkData).length === 0}
                           value={t(isSwitching ? "LOGIN_SIGNING_IN" : "GO")}/>
                </form>
            </> : null}
        </>
    );
}
