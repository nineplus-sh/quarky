import {useContext, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import localForage from "localforage";
import LQ from "../../../../util/LQ.js";
import {useUnleashContext} from "@unleash/proxy-client-react";
import NiceModal from "@ebay/nice-modal-react";
import NetworkUnsupportedModal from "../../../modals/NetworkUnsupportedModal.jsx";
import NetworkOfflineModal from "../../../modals/NetworkOfflineModal.jsx";

export default function LightquarkLogin({setDone}) {
    const appContext = useContext(AppContext)
    const updateContext = useUnleashContext();
    const [network, setNetwork] = useState('https://lightquark.network');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let localConfig = {};
    const setLocalConfig = async(_localConfig) => {
        if(localConfig === {}) {
            await localForage.removeItem("lightquark");
        } else {
            await localForage.setItem("lightquark", _localConfig);
        }
        localConfig = _localConfig
    }

    /*
    Sloppy way to have this check also be ran when the network field itself is changed.
    TODO: Clean up flow and modals to prevent unnecessary refetches
     */
    async function getConfig() {
        await setLocalConfig({
             network: {
                 baseUrl: network,
                 version: "v4"
             }
        })

        let NETWORKdata;
        try {
            NETWORKdata = await LQ("network", "GET", {}, true);
        } catch(e) {
            NiceModal.show(NetworkOfflineModal, {name: network});
            setLocalConfig({});
            return false;
        }

        if(!NETWORKdata.raw.cdnBaseUrl) {
            await localForage.removeItem("lightquark");
            NiceModal.show(NetworkUnsupportedModal, {
                name: `${NETWORKdata.raw.name} (${NETWORKdata.raw.linkBase})`,
                maintainer: NETWORKdata.raw.maintainer,
                signOut: false
            });
            setLocalConfig({});
            return false;
        }

        return true;
    }

    async function login(e) {
        e.preventDefault();
        new Audio(appContext.nyafile.getCachedData("sfx/button-select")).play();

        let thingieSuccessful = !!localConfig.network
        if(!thingieSuccessful) thingieSuccessful = await getConfig();
        if(!thingieSuccessful) return;

        const LQdata = await LQ("auth/token", "POST", {email, password}, true);
        if(LQdata.request.success === true) {
            await setLocalConfig({...localConfig, token: LQdata.response.access_token, refreshToken: LQdata.response.refresh_token});

            const LQuserdata = await LQ("user/me");
            appContext.setAccounts(prev => ({...prev, "lightquark": LQuserdata.response.user}))
            updateContext({lqId: LQuserdata.response.user._id})

            localStorage.setItem("USER_AUTHED", "bet");
            setDone(true);
        } else {
            new Audio(appContext.nyafile.getCachedData("sfx/error")).play();
            setTimeout(() => alert(LQdata.response.message), 5);
        }
    }

    return (<>
        <h1>Sign in with your Lightquark account</h1>
        <form onSubmit={login}>
            <input required type={"text"} value={network} onBlur={getConfig} onChange={e => setNetwork(e.target.value)}/>
            <input required type={"email"} placeholder={"hakase@litdevs.org"} onChange={e => setEmail(e.target.value)}/>
            <input required type={"password"} placeholder={"(password)"} onChange={e => setPassword(e.target.value)}/>
            <input type={"submit"} />
        </form>
    </>)
}