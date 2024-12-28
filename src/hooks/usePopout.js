import {useState} from "react";
import {autoUpdate, useClick, useFloating, useInteractions} from "@floating-ui/react";

export default function usePopout(floatingOptions) {
    const [isOpen, setOpen] = useState(false);
    const float = useFloating({
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        open: isOpen,
        onOpenChange: setOpen,
        ...floatingOptions
    });
    const click = useClick(float.context);
    const {getReferenceProps, getFloatingProps} = useInteractions([click]);

    return {
        open: isOpen,
        setOpen: setOpen,
        toggle: () => setOpen(prev => !prev),
        context: float.context,
        sourceProps: {
            ref: float.refs.setReference,
            ...getReferenceProps()
        },
        popoutProps: {
            ref: float.refs.setFloating,
            style: float.floatingStyles,
            ...getFloatingProps()
        }
    }
}