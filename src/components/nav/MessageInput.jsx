import {useParams} from "react-router-dom";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import LQ from "../../util/LQ.js";

export default function MessageInput() {
    let { quarkId, dialogId } = useParams();
    let [message, setMessage] = useState("");
    const appContext = useContext(AppContext);

    return (<form onSubmit={async (e) => {
        e.preventDefault();
        if(quarkId === "telegram") {
            const newMessage = await appContext.telegram.sendMessage(dialogId, {message: message});
            let source = newMessage.chatId.value;
            appContext.setMessageCache(previousValue => {
                previousValue = { ...previousValue }
                if(!previousValue[source]) previousValue[source] = [];
                previousValue[source].push(newMessage)
                return previousValue;
            });
        } else {
            await LQ(`channel/${dialogId}/messages`, "POST", {content: message})
        }
        setMessage("")
    }}>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} />
        <input type={"submit"} />
    </form>)
}