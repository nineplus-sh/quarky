import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import classnames from "classnames";
import styles from "./GenericChannel.module.css";
import useSound from "../../hooks/useSound.js";

export default function GenericChannel({name, active, slim, onClick}) {
    const {play: hoverPlay} = useSound("sfx/default-hover");
    const {play: selectPlay} = useSound("sfx/default-select");

    return <div className={classnames(styles.channel, {[styles.active]: active, [styles.slim]: slim})}
                 onMouseEnter={hoverPlay}
                 onClick={() => {selectPlay();if(onClick)onClick()}}>
        {name}
    </div>
}