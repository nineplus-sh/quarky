import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import LightquarkMessage from "../_services/lightquark/dialogs/LightquarkMessage.jsx";
import LQ from "../../util/LQ.js";

export default function DialogMessages() {
    const appContext = useContext(AppContext);
    let { quarkId, dialogId } = useParams();
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
    }, [dialogId, appContext.messageCache])
    useLayoutEffect(() => {
        document.querySelector("div[class^='_messages_']").lastChild?.scrollIntoView({"behavior": "smooth"});
    }, [messages]);

    return messages.map((message, index) => {
        let sameAuthor = false;
        if(index > 0){
            const prevMessage = messages[index-1];
            const literalSameAuthor = prevMessage.author._id === message.author._id;

            const botMetadata = message.specialAttributes?.find(attr => attr.type === "botMessage");
            const prevBotMetadata = prevMessage.specialAttributes?.find(attr => attr.type === "botMessage");
            const irregularData = !!botMetadata !== !!prevBotMetadata;
            if(irregularData) {
                sameAuthor = false;
            } else if(botMetadata && prevBotMetadata) {
                sameAuthor = botMetadata.username === prevBotMetadata.username;
            } else {
                sameAuthor = literalSameAuthor;
            }
        }
        return <LightquarkMessage message={message} channel={dialogId} quark={quarkId.split("lq_")[1]} isContinuation={sameAuthor} key={message.id} />
    })
}