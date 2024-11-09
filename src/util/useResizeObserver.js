import {useEffect, useRef, useState} from "react";

export default function useResizeObserver({asCSS = true} = {}) {
    const [size, setSize] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                console.log(entry)
                setSize(asCSS ? {width:entry.contentRect.width+"px", height:entry.contentRect.height+"px"} : {width:entry.contentRect.width, height:entry.contentRect.height});
            })
        })

        if(ref.current) resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect();
    }, []);

    return [size, ref];
}