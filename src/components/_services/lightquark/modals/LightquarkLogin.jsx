import styles from "./LightquarkLogin.module.css";
import {useContext, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useCrossfade} from "../../../../hooks/useCrossfade.js";
import {Trans, useTranslation} from "react-i18next";
import Button from "../../../nav/Button.jsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import NyafileImage from "../../../nyafile/NyafileImage.jsx";
import {version} from "../../../../../package.json"
import localForage from "localforage";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function LightquarkLogin() {
    const {setApiKeys} = useContext(AppContext);
    const {t} = useTranslation();
    const [tab, _switchTab] = useState("splash");
    const crossfade = useCrossfade();

    async function switchTab(tab) {
        await crossfade();
        _switchTab(tab);
    }

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [code, setCode] = useState(null);

    const [networkUrl, setNetworkUrl] = useState("https://lightquark.network");
    const [lastNetworkUrl, setLastNetworkUrl] = useState(networkUrl);
    const [formNetworkUrl, setFormNetworkUrl] = useState("");

    const network = useQuery({
        queryFn: async () => {
            await crossfade();
            return LQ("network");
        },
        queryKey: ["network", networkUrl]
    })

    // Say hello to my little freak Lightquark 3 (the third iteration of the LQ function)
    function LQ(apiMethod, httpMethod = "GET", body) {
        return new Promise((resolve, reject) => {
            let requestBody;
            const headers = { "LQ-Agent": `Quarky/${version}` };

            if (httpMethod !== "GET") {
                requestBody = JSON.stringify(body);
                headers.Accept = "application/json";
                headers["Content-Type"] = "application/json";
            }

            fetch(`${networkUrl}/v4/${apiMethod}`, {
                method: httpMethod,
                headers,
                body: requestBody,
            }).then(async (res) => {
                const data = await res.json();

                if (!res.ok) return reject(data.response?.errors?.join(" ") || data.response?.message || `LightquarkLogin: Fetch ${apiMethod} failed!`);
                if(data.request?.error_code) data.error_code = data.request.error_code;
                resolve(apiMethod === "network" ? data : data.response);
            }).catch((error) => {
                reject(`LightquarkLogin: Fetch ${apiMethod} failed: ${error.message}`);
            });
        });
    }

    const requestCode = useMutation({
        mutationFn: () => LQ("auth/register", "POST", {username,email,password}),
        onSuccess: (data) => {
            switchTab("confirm");
            if(data.error_code === 10) loginByCode.mutate({code2: 1234567})
        }
    })
    const loginByCode = useMutation({
        mutationFn: ({code2} = {}) => LQ("auth/register/confirm", "POST", {email,code:code2||code}),
        onSuccess: (data) => finalizeLogin(data.access_token, data.refresh_token)
    })
    const loginByPassword = useMutation({
        mutationFn: () => LQ("auth/token", "POST", {email,password}),
        onSuccess: (data) => finalizeLogin(data.access_token, data.refresh_token)
    })

    async function finalizeLogin(accessToken, refreshToken) {
        await localForage.setItem("lightquark", {
            network: {
                baseUrl: networkUrl,
                version: "v4"
            },
            token: accessToken,
            refreshToken: refreshToken
        })

        setApiKeys(prevApiKeys => ({
            ...prevApiKeys,
            baseURL: networkUrl,
            accessToken: accessToken,
            refreshToken: refreshToken
        }))
    }

    useEffect(() => {
        if (network.isSuccess) {
            setLastNetworkUrl(networkUrl);
            setFormNetworkUrl("");
            _switchTab("splash");
        } else if (network.isError) {
            alert("Something went wrong, going back to the previous network")
            setNetworkUrl(lastNetworkUrl)
        }
    }, [network.isSuccess, network.isError, networkUrl]);
    if (!network.isSuccess) return <p>{t("LOGIN_NETWORK_FETCHING")}</p>

    function MicroNetworkHeader({string, back, backString}) {
        return <div className={styles.formHeader}>
            <span className={styles.formHeaderText}><img src={network.data.iconUrl} className={styles.microLogo}/> {t(string, {name: network.data.name})}</span>
            {back ? <Button onClick={back}>{t(backString || "BACK")}</Button> : null}
        </div>
    }

    return (<>
        {tab === "splash" || tab === "network" ? <div className={styles.networkInfoArea}>
            <div className={styles.networkInfo}>
                <img className={styles.networkLogo} src={network.data.iconUrl}/>
                <div className={styles.networkDetails}>
                    <p className={styles.networkName}>{network.data.name} <Button disabled={network.isLoading} onClick={() => switchTab("network")}>{t("LOGIN_SWITCH_NETWORKS")}</Button></p>
                    <p className={styles.networkMetadata}>{t("LOGIN_NETWORK_BYLINE", {domain: network.data.linkBase, version: network.data.version, maintainer: network.data.maintainer, interpolation: { escapeValue: false }})}</p>
                </div>
            </div>
            <Markdown className={styles.networkDescription} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {"target": "_blank", "rel": ["noreferrer", "noopener", "nofollow"]}]]}>{network.data.description}</Markdown>
        </div> : null}

        {tab === "splash" ? <div className={styles.routes}>
            <div role={"button"} aria-label={t("LOGIN_CREATE_ACCOUNT")} onClick={() => switchTab("create")} className={styles.route}>
                <NyafileImage src={"img/create_user"}/>
                <span>{t("LOGIN_CREATE_ACCOUNT")}</span>
            </div>
            <div className={styles.routeSplitter}>{t("OR")}</div>
            <div role={"button"} aria-label={t("SIGN_IN")} onClick={() => switchTab("login")} className={styles.route}>
                <NyafileImage src={"img/sign_in"}/>
                <span>{t("SIGN_IN")}</span>
            </div>
        </div> : tab === "login" ? <>
            <MicroNetworkHeader string={"LOGIN_SIGN_IN_FORM"} back={() => switchTab("splash")}/>

            <form onSubmit={(e) => {e.preventDefault();loginByPassword.mutate()}} className={styles.loginForm}>
                <input className={styles.loginInput} required type="email" placeholder={t("LOGIN_EMAIL")} value={email} onChange={e => setEmail(e.target.value)} />
                <input className={styles.loginInput} required type="password" placeholder={t("LOGIN_PASSWORD")} value={password} onChange={e => setPassword(e.target.value)} />
                <Button puffy primary type="submit" disabled={loginByPassword.isPending}>{t(loginByPassword.isPending ? "LOGIN_SIGNING_IN" : "GO")}</Button>
            </form>
        </> : tab === "network" ? <>
            <p>
                <Trans i18nKey={"LOGIN_SWITCH_NETWORKS_BODY"} values={{name: network.data.name}} components={[<a href={"https://youtrack.litdevs.org/articles/LQ4-A-1"} target={"_blank"} rel={"noreferrer"}/>]}></Trans>
            </p>

            <form onSubmit={(e) => {e.preventDefault();setNetworkUrl(formNetworkUrl)}} className={styles.loginForm}>
                <input className={styles.loginInput} required type="text" placeholder={networkUrl} value={formNetworkUrl} onChange={e => setFormNetworkUrl(e.target.value)}/>
                <Button puffy type="submit">{t( "LOGIN_SWITCH_NETWORKS")}</Button>
                <Button puffy primary type="button" onClick={() => switchTab("splash")}>{t("BACK")}</Button>
            </form>
        </> : tab === "create" ? <>
            <MicroNetworkHeader string={"LOGIN_SIGN_UP_FORM"} back={() => switchTab("splash")}/>

            <form onSubmit={(e) => {
                e.preventDefault();
                requestCode.mutate()
            }} className={styles.loginForm}>
                <input className={styles.loginInput} required type="text" placeholder={t("LOGIN_USERNAME")}
                       value={username} onChange={e => setUsername(e.target.value)}/>
                <input className={styles.loginInput} required type="email" placeholder={t("LOGIN_EMAIL")}
                       value={email} onChange={e => setEmail(e.target.value)}/>
                <input className={styles.loginInput} required type="password" placeholder={t("LOGIN_PASSWORD")}
                       value={password} onChange={e => setPassword(e.target.value)}/>
                <input className={styles.loginInput} required type="password" placeholder={t("LOGIN_PASSWORD_CONFIRM")}
                       value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}/>

                {requestCode.error ? requestCode.error : null}

                <Button puffy primary type="submit"
                        disabled={password !== passwordConfirm || requestCode.isPending}>{t(requestCode.isPending ? "GOING" : "GO")}</Button>
            </form>
        </> : tab === "confirm" ? <>
            <MicroNetworkHeader string={"LOGIN_SIGN_UP_FORM"} back={() => switchTab("create")} backString={"CANCEL"}/>

            <span>{t("LOGIN_SIGN_UP_CODE", {email})}</span>

            <form onSubmit={(e) => {e.preventDefault();loginByCode.mutate()}} className={styles.loginForm}>
                <input className={styles.loginInput} required type="number" placeholder={t("LOGIN_VERIFICATION_CODE")}
                       value={code} onChange={e => setCode(e.target.value)}/>

                {loginByCode.error ? loginByCode.error : null}

                <Button puffy primary type="submit" disabled={loginByCode.isPending}>{t(loginByCode.isPending ? "GOING" : "GO")}</Button>
            </form>
        </> : null}
    </>);
}