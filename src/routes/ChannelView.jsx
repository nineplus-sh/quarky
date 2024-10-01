import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import useChannelMembers from "../components/_services/lightquark/hooks/useChannelMembers.js";
import useChannelMessages from "../components/_services/lightquark/hooks/useChannelMessages.js";
import {useTranslation} from "react-i18next";

export default function ChannelView() {
    const {dialogId} = useParams();
    const {data: members, isLoading: isMembersLoading} = useChannelMembers(dialogId);
    const {data: messages, isLoading: isMessagesLoading, isFetchingPreviousPage, fetchPreviousPage} = useChannelMessages(dialogId);
    const messageArea = useRef(null);
    const prevScrollHeight = useRef(null);
    const {t} = useTranslation();

    function scrollChecker() {
        prevScrollHeight.current = messageArea.current.scrollHeight;
        if(messageArea.current.scrollTop < 1000 && !isFetchingPreviousPage) fetchPreviousPage();
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
                {isMessagesLoading ? null : <>
                {isFetchingPreviousPage ? <p>{t("FETCHING_PREVIOUS_MESSAGES")}</p> : null}
                <DialogMessages messages={messages?.pages.flat(1).sort((a,b) => a.timestamp - b.timestamp)}/>
                </>}
            </div>
            <MessageInput/>
        </div>
        <div className={styles.memberList}>
            {isMembersLoading ? null : <LightquarkMemberList members={members}/>}
        </div>
    </>)
}