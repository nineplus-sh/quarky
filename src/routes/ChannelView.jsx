import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import LQ from "../util/LQ.js";
import {AppContext} from "../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import useChannelMembers from "../components/_services/lightquark/hooks/useChannelMembers.js";
import useChannelMessages from "../components/_services/lightquark/hooks/useChannelMessages.js";
import {flushSync} from "react-dom";

export default function ChannelView() {
    const {dialogId} = useParams();
    const {data: members, isLoading: isMembersLoading} = useChannelMembers(dialogId);
    const {data: messages, isLoading: isMessagesLoading, fetchPreviousPage} = useChannelMessages(dialogId);
    const messageArea = useRef(null);
    const prevScrollHeight = useRef(null);

    function scrollChecker() {
        prevScrollHeight.current = messageArea.current.scrollHeight;
        if(messageArea.current.scrollTop === 0) fetchPreviousPage();
    }
    useEffect(() => {
        if(Math.abs(prevScrollHeight.current - messageArea.current.scrollTop - messageArea.current.clientHeight) < 1) {
            messageArea.current.lastChild?.scrollIntoView({ behavior: "smooth" });
        } else {
            messageArea.current.scrollTop += messageArea.current.scrollHeight - prevScrollHeight.current;
        }
    }, [messages]);

    return (<>
        <div className={styles.messageArea}>
            <div className={styles.messages} onScroll={scrollChecker} ref={messageArea}>
                {isMessagesLoading ? null : <DialogMessages messages={messages?.pages.flat(1).sort((a,b) => a.timestamp - b.timestamp)}/>}
            </div>
            <MessageInput/>
        </div>
        <div className={styles.memberList}>
            {isMembersLoading ? null : <LightquarkMemberList members={members}/>}
        </div>
    </>)
}