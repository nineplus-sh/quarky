import {createContext} from "react";

/**
 * Used to pass around the web socket for easy access by Tanstack Query.
 * @type {React.Context<import("react-use-websocket").default>}
 */
export const WebSocketContext = createContext(null);