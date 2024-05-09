import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import LightquarkMessage from "../_services/lightquark/dialogs/LightquarkMessage.jsx";
import LQ from "../../util/LQ.js";

export default function DialogMessages() {
    const appContext = useContext(AppContext);
    let { dialogId } = useParams();
    const [messages, setMessages] = useState([])

    useEffect(() => {
        (async () => {
            if(!appContext.messageCache[dialogId]) {
                const _messages = (await LQ(`channel/${dialogId}/messages`)).response.messages

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
        setMessages(appContext.messageCache[dialogId].sort((a, b) => a.timestamp - b.timestamp))

        document.querySelector("div[class^='_messages_']").lastChild?.scrollIntoView({"behavior": "smooth"});
    }, [dialogId, appContext.messageCache])

    return messages.map((message) => <LightquarkMessage message={message} key={message.id} />)
}