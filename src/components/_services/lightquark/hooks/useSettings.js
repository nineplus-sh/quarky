import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";
import {useContext, useEffect} from "react";
import {WebSocketContext} from "../../../../contexts/WebSocketContext.js";
import localForage from "localforage";

export const defaultSettings = {
    "RICH_EMBEDS": true,
    "UWUSPEAK": false,
    "GAME_ACTIVITY": true,
    "PRIDE_FLAG": "trans",
    "DRAFTS": {}
}

export default function useSettings() {
    const apiCall = useRPC();
    const {socket} = useContext(WebSocketContext);
    const queryClient = useQueryClient();

    return useQuery({
        queryFn: async () => {
            const forageSettings = queryClient.getQueryData(["settings","unauthed"]) || await localForage.getItem("settings");
            if(!forageSettings) return defaultSettings;

            let settings = {...defaultSettings, ...preprocessSettings(forageSettings)};

            if(!socket?.isAuthenticated) return settings;

            const globalSettings = await apiCall("user/me/preferences/global");
            settings = {...settings, ...preprocessSettings(globalSettings.preferences)};

            const quarkySettings = await apiCall("user/me/preferences/quarky");
            settings = {...settings, ...preprocessSettings(quarkySettings.preferences)};

            return settings;
        },
        queryKey: ["settings",socket?.isAuthenticated ? "authed" : "unauthed"]
    })
}

export function preprocessSettings(settingsObj) {
    let thing = {}
    Object.entries(settingsObj).forEach(([key, value]) => {
        key = key.toUpperCase();
        if(typeof defaultSettings[key] === "object" && typeof value === "string") value = JSON.parse(value);
        thing[key] = value;
    })
    return thing;
}