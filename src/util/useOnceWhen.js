import {useEffect, useRef} from "react";

export default function useOnceWhen(variable, value, callback, enabled = true) {
    const hasRun = useRef(false);

    useEffect(() => {
        if (enabled === false) return;
        if (!hasRun.current && variable === value) {
            hasRun.current = true;
            callback();
        }
    }, [variable, value, callback, enabled]);
}
