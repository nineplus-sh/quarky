import {useLayoutEffect} from "react";
import {useParams} from "react-router-dom";
import LightquarkMessage from "../_services/lightquark/dialogs/LightquarkMessage.jsx";
import useMe from "../_services/lightquark/hooks/useMe.js";

export default function DialogMessages({messages}) {
    let { quarkId, dialogId } = useParams();
    const {data: userData, isLoading} = useMe();

    if(isLoading) return null;
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
        return <LightquarkMessage message={message} channel={dialogId} quark={quarkId.split("lq_")[1]} isContinuation={sameAuthor} isAuthored={message.author._id === userData._id} key={message.id} />
    })
}