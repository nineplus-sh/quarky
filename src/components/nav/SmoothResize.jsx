import {Fragment, useEffect, useRef, useState} from "react";
import {CrossfadeContext} from "../../hooks/useCrossfade.js";

/**
 * Causes a smooth resizing effect. Useful if the div has dramatic size changes.
 * @param {Object} props
 * @param {boolean} props.autoCrossfade - By default, it is assumed that you want a crossfade whenever the size changes. If not, set this to false and useCrossfade.
 * @param {Object} props.wrapperProps - The props you want to give to the wrapper, i.e. the div that will have its size change with the child.
 * @param {Object} props.childProps - The props you want to give to the children's wrapper. Yes, it needs a wrapper too, for size calculation.
 * @param {Object} props.decorators - Drop any components you want to render between the wrapper and the children's wrapper here.
 */
export default function SmoothResize({autoCrossfade = true, children, wrapperProps, childProps, decorators}) {
    const [size, setSize] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                console.log(entry)
                setSize({width:entry.contentRect.width+"px", height:entry.contentRect.height+"px"});
                if(autoCrossfade) crossfade();
            })
        })

        if(ref.current) resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect();
    }, []);

    async function crossfade() {
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

    return <div {...wrapperProps} style={{...size, ...wrapperProps.style}}>
        {decorators}
        <div ref={ref} style={{width: "fit-content", position: "absolute", ...childProps.style}}>
            <CrossfadeContext.Provider value={crossfade}>
                {children}
            </CrossfadeContext.Provider>
        </div>
    </div>
}