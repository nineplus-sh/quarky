import {useEffect, useLayoutEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import LightquarkMessage from "../_services/lightquark/dialogs/LightquarkMessage.jsx";
import useMe from "../_services/lightquark/hooks/useMe.js";
import {Virtuoso} from "react-virtuoso";

export default function DialogMessages({messages, moreMessages}) {
    let { quarkId, dialogId } = useParams();
    const {data: userData, isLoading} = useMe();

    const oldLength = useRef(null);
    const firstMessageId = useRef(null);
    const virtuoso = useRef(null);
    useEffect(() => {
        if(!virtuoso.current) return;
        if(!messages?.[0]?._id) return;

        console.log(oldLength.current, firstMessageId.current, messages.length, messages[0]._id)
        console.log(virtuoso.current.scrollTop)
        if(oldLength.current < messages.length && firstMessageId.current !== messages[0]._id) {
            virtuoso.current.scrollToIndex(oldLength.current - 1);
        }
        oldLength.current = messages.length;
        firstMessageId.current = messages[0]._id;
    }, [messages]);

    if(isLoading) return null;
    return <Virtuoso ref={virtuoso} data={messages} itemContent={(index, message) => {
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
        return <LightquarkMessage message={message} channel={dialogId} quark={quarkId.split("lq_")[1]} isContinuation={sameAuthor} isAuthored={message.author._id === userData._id} key={message._id} />
    }} startReached={moreMessages} initialTopMostItemIndex={messages.length-1} followOutput={"smooth"} logLevel={0} increaseViewportBy={200}/>
}