import {Link} from "react-router-dom";
import styles from "./GenericQuark.module.css";
import {useContext, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import {autoUpdate, useClick, useFloating, useHover, useInteractions} from "@floating-ui/react";
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
    const tooltipInteractions = useInteractions([tooltipHover]);

    return <><span className={classnames(styles.quark, {[styles.stretch]: isStretching})}  onAnimationEnd={() => stretchIt(false)} onClick={() => {
        stretchIt(false);
        setTimeout(function() {
            stretchIt(true);
            new Audio(appContext.nyafile.getCachedData("sfx/default-select")).play();
        }, 9)
    }} onMouseEnter={() => new Audio(appContext.nyafile.getCachedData("sfx/default-hover")).play()}>
        <img src={icon} width={64} height={64} className={styles.icon} ref={tooltipFloat.refs.setReference}/>
    </span>
        {tooltipOpen ? <Tooltip floatRef={tooltipFloat.refs.setFloating} floatStyles={tooltipFloat.floatingStyles} floatProps={tooltipInteractions.getFloatingProps()}>{name}</Tooltip> : null}
    </>
}