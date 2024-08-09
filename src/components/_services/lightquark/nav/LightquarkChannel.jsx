import {Link, useParams} from "react-router-dom";
import classnames from "classnames";
import styles from "./LightquarkChannel.module.css";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

export default function LightquarkChannel({channel, quarkId}) {
    const appContext = useContext(AppContext);
    const {dialogId} = useParams();

    return <Link to={`/lq_${quarkId}/${channel._id}`}
                 className={classnames(styles.channel, {[styles.active]: channel._id === dialogId})}
                 onMouseEnter={() => new Audio(appContext.nyafile.getCachedData("sfx/default-hover")).play()}
                 onClick={() => new Audio(appContext.nyafile.getCachedData("sfx/default-select")).play()}>
        {channel.name}
    </Link>
}