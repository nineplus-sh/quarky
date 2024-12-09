import {createContext, useContext} from "react";

export const CrossfadeContext = createContext(() => {})
export const useCrossfade = () => useContext(CrossfadeContext);