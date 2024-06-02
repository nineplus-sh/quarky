import {useParams} from "react-router-dom";
import {useState} from "react";
import LQ from "../../util/LQ.js";

export default function MessageInput() {
    let { dialogId } = useParams();
    let [message, setMessage] = useState("");

    return (<form onSubmit={async (e) => {
        e.preventDefault();
        let wantedMessage = message;
        setMessage("");

        const formData = new FormData();
        formData.append("payload", JSON.stringify({content: wantedMessage}));

        await LQ(`channel/${dialogId}/messages`, "POST", formData)
        setMessage("")
    }}>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} />
        <input type={"submit"} />
    </form>)
}