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

        await LQ(`channel/${dialogId}/messages`, "POST", {content: wantedMessage})
        setMessage("")
    }}>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} />
        <input type={"submit"} />
    </form>)
}