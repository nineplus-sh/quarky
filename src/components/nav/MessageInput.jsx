import {useParams} from "react-router-dom";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";

export default function MessageInput() {
    let { dialogId } = useParams();
    let [message, setMessage] = useState("");
    const appContext = useContext(AppContext);

    return (<form onSubmit={async (e) => {
        e.preventDefault();
        const newMessage = await appContext.telegram.sendMessage(dialogId, {message: message});
        let source = newMessage.chatId.value;
        appContext.setMessageCache(previousValue => {
            previousValue = { ...previousValue }
            if(!previousValue[source]) previousValue[source] = [];
            previousValue[source].push(newMessage)
            return previousValue;
        });
        setMessage("")
    }}>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} />
        <input type={"submit"} />
    </form>)
}