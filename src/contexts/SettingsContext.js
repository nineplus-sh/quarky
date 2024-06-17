import {createContext} from "react";

export const defaultSettings = {
    "RICH_EMBEDS": true,
    "UWUSPEAK": false,
    "GAME_ACTIVITY": true,
    "PRIDE_FLAG": "trans"
}

export const SettingsContext = createContext({
    settings: defaultSettings,  setSettings: () => {}
});