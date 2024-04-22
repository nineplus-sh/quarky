import {Link} from "react-router-dom";
import styles from "./GenericQuark.module.css";
import {useContext, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";

export default function GenericQuark({link, icon}) {
    const [isStretching, stretchIt] = useState(false);
    const appContext = useContext(AppContext);

    return <Link to={link} className={classnames(styles.quark, {[styles.stretch]: isStretching})}  onAnimationEnd={() => stretchIt(false)} onClick={() => {
        stretchIt(false);
        setTimeout(function() {
            stretchIt(true);
            new Audio(appContext.nyafile.getCachedData("sfx/default-select")).play();
        }, 9)
    }} onMouseEnter={() => new Audio(appContext.nyafile.getCachedData("sfx/default-hover")).play()}>
        <img src={icon} width={64} height={64} className={styles.icon}/>
    </Link>
}