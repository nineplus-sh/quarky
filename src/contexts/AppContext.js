import {createContext} from "react";

export const defaultSettings = {
    "RICH_EMBEDS": true,
    "UWUSPEAK": false,
    "GAME_ACTIVITY": true,
    "PRIDE_FLAG": "trans",
    "DRAFTS": {}
}

/**
 * The app context.
 */
export const AppContext = createContext({
    /** @type {import("@litdevs/nyalib").default} **/
    nyafile: null,
    settings: defaultSettings,
    sidebarOpen: true
});