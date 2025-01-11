import {Link} from "react-router-dom";
import styles from "./GenericQuark.module.css";
import {useContext, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import {
    autoUpdate,
    useClick,
    useClientPoint,
    useFloating,
    useHover,
    useInteractions,
    useTransitionStyles
} from "@floating-ui/react";
import Tooltip from "./Tooltip.jsx";

export default function GenericQuark({link, icon, name}) {
    const [isStretching, stretchIt] = useState(false);
    const appContext = useContext(AppContext);

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipFloat = useFloating({
        placement: "right-middle",
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        open: tooltipOpen,
        onOpenChange: setTooltipOpen
    });
    const tooltipHover = useHover(tooltipFloat.context);
    const clientPoint = useClientPoint(tooltipFloat.context, {
        axis: "y"
    });
    const transStyles = useTransitionStyles(tooltipFloat.context, {
        duration: 350,
        initial: {
            transform: "scale(0)",
        },
        open: {
            transformOrigin: "center left",
            transform: "scale(1) rotateX(360deg)"
        },
        close: {
            transformOrigin: "center left",
            transform: "scale(0) rotateX(0deg)"
        },
    });
    const tooltipInteractions = useInteractions([tooltipHover, clientPoint]);

    return <><span className={classnames(styles.quark, {[styles.stretch]: isStretching})}  onAnimationEnd={() => stretchIt(false)} onClick={() => {
        stretchIt(false);
        setTimeout(function() {
            stretchIt(true);
            new Audio(appContext.nyafile.getFileURL("sfx/default-select")).play();
        }, 9)
    }} onMouseEnter={() => new Audio(appContext.nyafile.getFileURL("sfx/default-hover")).play()}>
        <img src={icon} width={64} height={64} className={styles.icon} ref={tooltipFloat.refs.setReference}/>
    </span>
        {transStyles.isMounted ? <Tooltip floatRef={tooltipFloat.refs.setFloating} floatStyles={tooltipFloat.floatingStyles} transStyles={transStyles.styles} floatProps={tooltipInteractions.getFloatingProps()}>{name}</Tooltip> : null}
    </>
}