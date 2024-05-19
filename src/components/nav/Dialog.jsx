import MessageInput from "./MessageInput.jsx";
import DialogMessages from "./DialogMessages.jsx";
import styles from "./Dialog.module.css"

export default function Dialog() {
    return (<>
        <div className={styles.messages}><DialogMessages /></div>
        <MessageInput />
    </>)
}