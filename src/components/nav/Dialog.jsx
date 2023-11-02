import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import TelegramMessage from "../telegram/dialogs/TelegramMessage.jsx";
import MessageInput from "./MessageInput.jsx";

export default function Dialog() {
    const appContext = useContext(AppContext);
    let { dialogId } = useParams();
    const [messages, setMessages] = useState([])

    useEffect(() => {
        (async () => {
            const _messages = await appContext.telegram.getMessages(dialogId, {limit: 50})
            setMessages(_messages.reverse())
        })()
    }, [dialogId]);

    return (<>
        {messages.map((message) => <TelegramMessage message={message} key={message.date} />)}
        <MessageInput />
        <hr/>
    </>)
}