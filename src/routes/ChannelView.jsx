import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useRef} from "react";
import {useParams} from "react-router-dom";
import useChannelMembers from "../components/_services/lightquark/hooks/useChannelMembers.js";
import useChannelMessages from "../components/_services/lightquark/hooks/useChannelMessages.js";
import {useTranslation} from "react-i18next";

export default function ChannelView() {
    const {dialogId} = useParams();
    const {data: members, isLoading: isMembersLoading} = useChannelMembers(dialogId);
    const {data: messages, isLoading: isMessagesLoading, isFetchingPreviousPage, fetchPreviousPage} = useChannelMessages(dialogId);
    const messageArea = useRef(null);
    const {t} = useTranslation();

    return (<>
        <div className={styles.messageArea}>
            {isFetchingPreviousPage ? <p>{t("FETCHING_PREVIOUS_MESSAGES")}</p> : null}
            <div className={styles.messages} ref={messageArea}>
                {isMessagesLoading ? <p>{t("FETCHING_PREVIOUS_MESSAGES")}</p> : <>
                    <DialogMessages moreMessages={fetchPreviousPage}
                                    messages={messages?.pages.flat(1).sort((a, b) => a.timestamp - b.timestamp)}/>
                </>}
            </div>
            <MessageInput/>
        </div>
        <div className={styles.memberList}>
            {isMembersLoading ? null : <LightquarkMemberList members={members}/>}
        </div>
    </>)
}