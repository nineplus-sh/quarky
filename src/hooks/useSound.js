import {AppContext} from "../contexts/AppContext.js";
import {useCallback, useContext, useEffect, useMemo, useRef} from "react";
// Air conditioning for Quarky. Just kidding, it's the AudioContext, clearly.
const AC = new AudioContext();

/**
 * Play a sound! Loop it, too!
 * TODO: This is a rudimentary implementation. It acts quite weirdly.
 */
export default function useSound(name, {looping, autoplay} = {}) {
    const {nyafile} = useContext(AppContext);
    const loopingSource = useRef(null);
    const decodedAudio = useRef(null);
    const playOnLoad = useRef(false);

    useEffect(() => {
        if(!looping && loopingSource.current !== null) {
            loopingSource.current.disconnect(); loopingSource.current = null;
        }
    }, [looping]);

    const play = useCallback(function() {
        if(!decodedAudio.current) return playOnLoad.current = true;
        if(looping && loopingSource.current) return;

        const source = AC.createBufferSource();
        source.buffer = decodedAudio.current;
        source.loop = looping;
        source.connect(AC.destination);
        source.start();
        if(looping) loopingSource.current = source;
    }, [decodedAudio, looping])

    const stop = useCallback(function() {
        if(!looping || !loopingSource.current) return;
        loopingSource.current.disconnect();
        loopingSource.current = null;
    }, [looping])

    useEffect(() => {
        const loadAudio = async function() {
            const angryBird = await nyafile.getFileBuffer(name);
            decodedAudio.current = await AC.decodeAudioData(angryBird);
            if(playOnLoad.current || autoplay) {
                playOnLoad.current = false; play();
            }
        }; loadAudio();
    }, [autoplay, name, nyafile, play]);

    return {play, stop}
}