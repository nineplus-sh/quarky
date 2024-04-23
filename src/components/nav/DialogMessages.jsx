import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import TelegramMessage from "../_services/telegram/dialogs/TelegramMessage.jsx";
import LightquarkMessage from "../_services/lightquark/dialogs/LightquarkMessage.jsx";
import LQ from "../../util/LQ.js";

export default function DialogMessages() {
    const appContext = useContext(AppContext);
    let { quarkId, dialogId } = useParams();
    const [messages, setMessages] = useState([])

    useEffect(() => {
        (async () => {
            if(!appContext.messageCache[dialogId]) {
                let _messages;

                if(quarkId !== "telegram") {
                    _messages = (await LQ(`channel/${dialogId}/messages`)).response.messages
                    console.log(_messages)
                } else {
                    _messages = await appContext.telegram.getMessages(dialogId, {limit: 50})
                }

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
        if(quarkId === "telegram") {
            setMessages(appContext.messageCache[dialogId].sort((a, b) => a.date - b.date))
        } else {
            setMessages(appContext.messageCache[dialogId].sort((a, b) => a.message.timestamp - b.message.timestamp))
        }

        document.querySelector("div[class^='_messages_']").lastChild?.scrollIntoView({"behavior": "smooth"});
    }, [dialogId, appContext.messageCache])

    const MessageType = quarkId !== "telegram" ? LightquarkMessage : TelegramMessage;
    return messages.map((message) => <MessageType message={message} key={message.id} />)
}