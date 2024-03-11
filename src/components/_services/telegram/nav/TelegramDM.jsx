import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import styles from "./TelegramDM.module.css"
import {Link} from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";

/**
 * A Telegram DM.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramDM({name, photo, peer, message, id}) {
    const appContext = useContext(AppContext);
    const [messageText, setMessageText] = useState(message);
    useEffect(() => {
        let thisCache = appContext.messageCache[id];
        if(!thisCache) return;
        setMessageText(thisCache[thisCache.length-1].message)
    }, [appContext.messageCache])

    return (<Link to={`/telegram/${id}`}>
        <div className={styles.dm}>
            <TelegramProfilePicture photo={photo} peer={peer} />
            <span className={styles.info}> {name}<br/><span className={styles.message}>{messageText}</span></span>
        </div>
    </Link>)
}