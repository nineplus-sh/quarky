import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useContext, useEffect, useState} from "react";
import LQ from "../util/LQ.js";
import {AppContext} from "../contexts/AppContext.js";
import {useParams} from "react-router-dom";
import useChannelMembers from "../components/_services/lightquark/hooks/useChannelMembers.js";
import useChannelMessages from "../components/_services/lightquark/hooks/useChannelMessages.js";

export default function ChannelView() {
    const {dialogId} = useParams();
    const {data: members, isLoading: isMembersLoading} = useChannelMembers(dialogId);
    const {data: messages, isLoading: isMessagesLoading} = useChannelMessages(dialogId);

    return (<>
        <div className={styles.messageArea}>
            <div className={styles.messages}>
                {isMessagesLoading ? null : <DialogMessages messages={messages?.pages.flat(1)}/>}
            </div>
            <MessageInput/>
        </div>
        <div className={styles.memberList}>
            {isMembersLoading ? null : <LightquarkMemberList members={members}/>}
        </div>
    </>)
}