import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import styles from "./TelegramDM.module.css"

/**
 * A Telegram DM.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramDM({name, photo, peer, message}) {
    return (<div className={styles.dm}>
        {photo && photo.className !== "ChatPhotoEmpty" ? <TelegramProfilePicture photo={photo} peer={peer} /> : ""}
        <span className={styles.info}> {name}<br/><span className={styles.message}>{message}</span></span>
    </div>)
}