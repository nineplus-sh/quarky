import {Link} from "react-router-dom";
import styles from "./GenericQuark.module.css";
import {useContext, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import {
    autoUpdate, offset,
    useClick,
    useClientPoint,
    useFloating,
    useHover,
    useInteractions,
    useTransitionStyles
} from "@floating-ui/react";
import Tooltip from "./Tooltip.jsx";
import useSound from "../../hooks/useSound.js";

export default function GenericQuark({link, icon, name}) {
    const [isStretching, stretchIt] = useState(false);
    const appContext = useContext(AppContext);

    const {play: hoverPlay} = useSound("sfx/button-sidebar-hover");
    const {play: selectPlay} = useSound("sfx/button-sidebar-select");

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipFloat = useFloating({
        placement: "right-middle",
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        open: tooltipOpen,
        onOpenChange: setTooltipOpen,
        middleware:  [offset(15)]
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
            transform: "scale(0)"
        },
    });
    const tooltipInteractions = useInteractions([tooltipHover, clientPoint]);

    return <><div className={classnames(styles.quark, {[styles.stretch]: isStretching})}  onAnimationEnd={() => stretchIt(false)} onClick={() => {
        stretchIt(false);
        setTimeout(function() {
            stretchIt(true);
            selectPlay();
        }, 9)
    }} onMouseEnter={hoverPlay} ref={tooltipFloat.refs.setReference}>
        <img src={icon} width={64} height={64} className={styles.icon}/>
    </div>
        {transStyles.isMounted ? <Tooltip floatRef={tooltipFloat.refs.setFloating} floatStyles={tooltipFloat.floatingStyles} transStyles={transStyles.styles} floatProps={tooltipInteractions.getFloatingProps()}>{name}</Tooltip> : null}
    </>
}