import { useState } from "react";
import TelegramDMSelector from "../components/telegram/nav/TelegramDMSelector.jsx";
import {Outlet} from "react-router-dom";
import { ClientContext } from "../contexts/ClientContext.js";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Client() {
    let [avatarCache, setAvatarCache] = useState({});
    let [resolvedAvatarCache, setResolvedAvatarCache] = useState({});
    return (<>
        <ClientContext.Provider value={{
            avatarCache, setAvatarCache,
            resolvedAvatarCache, setResolvedAvatarCache
        }}>
            <Outlet />
            <TelegramDMSelector />
        </ClientContext.Provider>
    </>)
}