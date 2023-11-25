import { useState } from "react";
import TelegramDMSelector from "../components/_services/telegram/nav/TelegramDMSelector.jsx";
import {Outlet} from "react-router-dom";
import { ClientContext } from "../contexts/ClientContext.js";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";

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
            <QuarkList />
            <TelegramDMSelector />
        </ClientContext.Provider>
    </>)
}