import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import styles from "./TelegramDM.module.css"
import {Link} from "react-router-dom";

/**
 * A Telegram DM.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramDM({name, photo, peer, message, id}) {
    return (<Link to={`/telegram/${id}`}>
        <div className={styles.dm}>
            {photo && photo.className !== "ChatPhotoEmpty" ? <TelegramProfilePicture photo={photo} peer={peer} /> : ""}
            <span className={styles.info}> {name}<br/><span className={styles.message}>{message}</span></span>
        </div>
    </Link>)
}