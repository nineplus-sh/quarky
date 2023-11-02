import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import styles from "./TelegramMessage.module.css"

export default function TelegramMessage({message}) {
    console.log(message)

    return (<div className={styles.message}>
        <TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>
        <span className={styles.content}> <b>{message._sender.firstName}</b><br/>{message.message}</span>
    </div>)
}