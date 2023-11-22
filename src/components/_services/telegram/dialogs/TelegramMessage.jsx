import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import styles from "./TelegramMessage.module.css"
import TelegramSticker from "./TelegramSticker.jsx";

export default function TelegramMessage({message}) {
    if(
        !message.action &&
        (!message.media || message.media.className === "MessageMediaWebPage")
    ) {
        return (<div className={styles.message}>
            <TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>
            <span className={styles.content}> <b>{message._sender.firstName || message.postAuthor}</b><br/>{message.message}</span>
        </div>)
    } else if (
        message.media &&
        message.media.className === "MessageMediaDocument" &&
        message.media.document.attributes.find(attribute => attribute.className === "DocumentAttributeSticker")
    ) {
        return (<div className={styles.message}>
            <TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>
            <span className={styles.content}> <b>{message._sender.firstName || message.postAuthor}</b><br/><TelegramSticker media={message.media.document}/></span>
        </div>)
    } else {
        return (<div className={styles.message}>
            <i>This version of Quarky does not support this message.</i>
        </div>)
    }
}