import usePopout from "./usePopout.js";
import {useEffect, useMemo, useRef, useState} from "react";
import {useInteractions, useListNavigation} from "@floating-ui/react";
import Fuse from "fuse.js";
import useSound from "./useSound.js";

export default function useAutocompletePopout({data, search, popoutOptions, fuseOptions, invertControls}) {
    const popout = usePopout(popoutOptions);

    const {play: sidebarHoverPlay} = useSound("sfx/button-sidebar-hover");

    const listRef = useRef([]);
    const virtualItemRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigator = useListNavigation(popout.context, {
        listRef,
        virtualItemRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        focusItemOnOpen: true,
        loop: true
    })

    if(invertControls) {
        const oldKeyDown = navigator.reference.onKeyDown;
        navigator.reference.onKeyDown = function(event) {
            if(event.key === "ArrowUp") {
                event.key = "ArrowDown";
            } else if (event.key === "ArrowDown") {
                event.key = "ArrowUp";
            }
            oldKeyDown(event);
        }
    }

    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([navigator])

    const fuse = useMemo(() => data ? new Fuse(data, fuseOptions) : null, [data, fuseOptions])
    const results = useMemo(() => fuse && search && popout.open ? fuse.search(search, fuseOptions) : null, [fuse, search, fuseOptions])
    useEffect(() => {
        setActiveIndex(0);
        popout.setOpen(!!search);
    }, [search]);

    function enterHandler(event) {
        if(event.key === 'Enter') listRef.current[activeIndex]?.click();
    }
    useEffect(() => {
        if(activeIndex !== 0) sidebarHoverPlay();
        document.addEventListener("keydown", enterHandler);
        return () => document.removeEventListener('keydown', enterHandler);
    }, [activeIndex]);


    return {
        ...popout,
        sourceProps: {ref: popout.sourceProps.ref, ...getReferenceProps()},
        popoutProps: {ref: popout.popoutProps.ref, style: popout.popoutProps.style, ...getFloatingProps()},
        itemProps: {...getItemProps()},
        search, activeIndex, listRef, results
    }
}