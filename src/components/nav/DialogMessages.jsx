import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import LightquarkMessage from "../_services/lightquark/dialogs/LightquarkMessage.jsx";
import LQ from "../../util/LQ.js";

export default function DialogMessages({messages}) {
    let { quarkId, dialogId } = useParams();

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