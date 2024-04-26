import {useContext, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import localForage from "localforage";
import LQ from "../../../../util/LQ.js";
import {useUnleashContext} from "@unleash/proxy-client-react";

export default function LightquarkLogin({setDone}) {
    const appContext = useContext(AppContext)
    const updateContext = useUnleashContext();
    const [network, setNetwork] = useState('https://lightquark.network');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function login(e) {
        e.preventDefault();
        const localConfig = await localForage.getItem("lightquark") || {}
        localConfig.network = localConfig.network || {}
        localConfig.network.baseUrl = network;
        localConfig.network.version = "v2";
        await localForage.setItem("lightquark", localConfig);

        const LQdata = await LQ("auth/token", "POST", {email, password}, true);
        if(LQdata.fetchSuccess === true) {
            localConfig.token = LQdata.response.access_token;
            await localForage.setItem("lightquark", localConfig);

            const LQuserdata = await LQ("user/me");
            appContext.setAccounts(prev => ({...prev, "lightquark": LQuserdata}))
            updateContext({lqId: LQuserdata.response.jwtData._id})

            localStorage.setItem("USER_AUTHED", "bet");
            setDone(true);
        } else {
            alert("Lightquark login failed :(")
        }
    }

    return (<>
        <h1>Sign in with your Lightquark account</h1>
        <form onSubmit={login}>
            <input type={"text"} value={network} onChange={e => setNetwork(e.target.value)}/>
            <input type={"email"} placeholder={"hakase@litdevs.org"} onChange={e => setEmail(e.target.value)}/>
            <input type={"password"} placeholder={"(password)"} onChange={e => setPassword(e.target.value)}/>
            <input type={"submit"} />
        </form>
    </>)
}