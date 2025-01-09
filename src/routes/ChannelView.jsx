import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useRef} from "react";
import {useParams} from "react-router-dom";
import useChannelMembers from "../components/_services/lightquark/hooks/useChannelMembers.js";
import useChannelMessages from "../components/_services/lightquark/hooks/useChannelMessages.js";
import {useTranslation} from "react-i18next";
import useChannel from "../components/_services/lightquark/hooks/useChannel.js";
import WhatsNew from "../components/nav/WhatsNew.jsx";

export default function ChannelView() {
    const {dialogId} = useParams();
    const {data: channel, isSuccess: isChannelSuccess} = useChannel(dialogId);
    const {data: members, isSuccess: isMembersSuccess} = useChannelMembers(dialogId);
    const {data: messages, isSuccess: isMessagesSuccess, isFetchingPreviousPage, fetchPreviousPage} = useChannelMessages(dialogId);
    const messageArea = useRef(null);
    const {t} = useTranslation();

    return (<div className={styles.channelView}>
        <div className={styles.channelTopbar}>
            {isChannelSuccess ? <>
                <b className={styles.channelName}>{channel.name}</b>
                <span className={styles.channelDesc}>{channel.description}</span>
            </> : "..."}
            <span style={{marginLeft: "auto"}}><WhatsNew/></span>
        </div>
        <div className={styles.channelContents}>
            <div className={styles.messageArea}>
                <div className={styles.messages} ref={messageArea}>
                    {isMessagesSuccess ? <>
                        <DialogMessages messages={messages?.pages.flat(1).sort((a, b) => a.timestamp - b.timestamp)}
                                        moreMessages={fetchPreviousPage}/>
                    </> : null}
                </div>
                <MessageInput/>
            </div>
            <div className={styles.memberList}>
                {isMembersSuccess ? <LightquarkMemberList members={members}/> : null}
            </div>
        </div>
    </div>)
}