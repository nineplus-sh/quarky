import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import styles from "./TelegramMessage.module.css"

export default function TelegramMessage({message}) {
    if(message.action || (message.media && message.media.className !== "MessageMediaWebPage")) {
        return (<div className={styles.message}>
            <i>This version of Quarky does not support this message.</i>
        </div>)
    } else {
        return (<div className={styles.message}>
            <TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>
            <span className={styles.content}> <b>{message._sender.firstName || message.postAuthor}</b><br/>{message.message}</span>
        </div>)
    }
}