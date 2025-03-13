import {createContext, useContext} from "react";

export const CrossfadeContext = createContext(() => {})
export const useCrossfade = () => useContext(CrossfadeContext);
export const useCrossfadeTrigger = (ref) => {
    return async function() {
        if (ref.current) {
            await ref.current.animate([{opacity: 1}, {opacity: 0}], {
                duration: 200,
                easing: "ease",
                fill: "forwards"
            }).finished;
            setTimeout(function () {
                ref.current.style.visibility = "visible";
                ref.current.animate([{opacity: 0}, {opacity: 1}], {
                    duration: 200,
                    easing: "ease",
                    fill: "forwards"
                })
            }, 300)
        }
    }
}