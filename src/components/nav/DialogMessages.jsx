import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import TelegramMessage from "../telegram/dialogs/TelegramMessage.jsx";

export default function DialogMessages() {
    const appContext = useContext(AppContext);
    let { dialogId } = useParams();
    const [messages, setMessages] = useState([])

    useEffect(() => {
        (async () => {
            if(!appContext.messageCache[dialogId]) {
                const _messages = await appContext.telegram.getMessages(dialogId, {limit: 50});
                appContext.setMessageCache(previousValue => {
                    previousValue = { ...previousValue }
                    previousValue[dialogId] = _messages;
                    return previousValue;
                });
            }
        })()
    }, [dialogId])

    useEffect(() => {
        if(!appContext.messageCache[dialogId]) return setMessages([]);
        setMessages(appContext.messageCache[dialogId].sort((a, b) => a.date - b.date))
    }, [dialogId, appContext.messageCache])

    return messages.map((message) => {return <TelegramMessage message={message} key={message.id} />})
}