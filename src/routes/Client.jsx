import {useContext, useState} from "react";
import TelegramDMSelector from "../components/_services/telegram/nav/TelegramDMSelector.jsx";
import {Outlet} from "react-router-dom";
import { ClientContext } from "../contexts/ClientContext.js";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";
import {AppContext} from "../contexts/AppContext.js";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Client() {
    let [avatarCache, setAvatarCache] = useState({});
    let [resolvedAvatarCache, setResolvedAvatarCache] = useState({});
    const appContext = useContext(AppContext)

    return (<>
        <ClientContext.Provider value={{
            avatarCache, setAvatarCache,
            resolvedAvatarCache, setResolvedAvatarCache
        }}>
            <Outlet />
            {appContext.accounts.lightquark ? <QuarkList /> : null}
            {appContext.accounts.telegram ? <TelegramDMSelector /> : null}
        </ClientContext.Provider>
    </>)
}