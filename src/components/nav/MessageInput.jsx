import {useParams} from "react-router-dom";
import {useState} from "react";
import LQ from "../../util/LQ.js";
import styles from "./MessageInput.module.css"

export default function MessageInput() {
    let { dialogId } = useParams();
    let [message, setMessage] = useState("");

    return (<form className={styles.messageForm} onSubmit={async (e) => {
        e.preventDefault();
        let wantedMessage = message;
        setMessage("");

        const formData = new FormData();
        formData.append("payload", JSON.stringify({content: wantedMessage}));

        await LQ(`channel/${dialogId}/messages`, "POST", formData)
        setMessage("")
    }}>
        <button type="button" disabled>Games</button>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} className={styles.messageBox} />
        <button type="button">GIFs</button>
    </form>)
}