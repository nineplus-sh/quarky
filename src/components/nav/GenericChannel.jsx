import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import classnames from "classnames";
import styles from "./GenericChannel.module.css";

export default function GenericChannel({name, active, slim, onClick}) {
    const appContext = useContext(AppContext);

    return <div className={classnames(styles.channel, {[styles.active]: active, [styles.slim]: slim})}
                 onMouseEnter={() => new Audio(appContext.nyafile.getFileURL("sfx/default-hover")).play()}
                 onClick={() => {new Audio(appContext.nyafile.getFileURL("sfx/default-select")).play();if(onClick)onClick()}}>
        {name}
    </div>
}