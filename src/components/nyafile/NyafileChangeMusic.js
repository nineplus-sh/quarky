import {AppContext} from "../../contexts/AppContext.js";
import {useContext, useEffect} from "react";

/**
 * A wrapper to change the background music that Quarky plays.
 * TODO: Allow for fading music, instead of sudden cutting.
 * @param musicPath
 */
export default function changeMusic(musicPath) {
    const appContext = useContext(AppContext);
    useEffect(() => {
        appContext.setMusic(appContext.nyafile.getCachedData(musicPath))
    }, []);
}