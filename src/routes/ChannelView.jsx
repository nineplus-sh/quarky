import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useContext, useRef} from "react";
import {useParams} from "react-router-dom";
import useChannelMembers from "../components/_services/lightquark/hooks/useChannelMembers.js";
import useChannelMessages from "../components/_services/lightquark/hooks/useChannelMessages.js";
import {useTranslation} from "react-i18next";
import useChannel from "../components/_services/lightquark/hooks/useChannel.js";
import WhatsNew from "../components/nav/WhatsNew.jsx";
import classnames from "classnames";
import {SidebarContext} from "../contexts/SidebarContext.js";
import Button from "../components/nav/Button.jsx";

export default function ChannelView() {
    const {dialogId} = useParams();
    const {data: channel, isSuccess: isChannelSuccess} = useChannel(dialogId);
    const {data: members, isSuccess: isMembersSuccess} = useChannelMembers(dialogId);
    const {data: messages, isSuccess: isMessagesSuccess, isFetchingPreviousPage, fetchPreviousPage} = useChannelMessages(dialogId);
    const messageArea = useRef(null);
    const {t} = useTranslation();
    const sidebars = useContext(SidebarContext);

    return (<div className={styles.channelView}>
        <div className={styles.channelTopbar}>
            <Button className={styles.uncollapsers} onClick={() => sidebars.setListOpen((prev) => !prev)}>Channels</Button>
            {isChannelSuccess ? <>
                <span>
                    <b className={styles.channelName}>{channel.name}</b>
                    {channel.description ? <span className={styles.channelDesc}>{channel.description}</span> : null}
                </span>
            </> : "..."}
            <Button className={styles.uncollapsers} onClick={() => sidebars.setMembersOpen((prev) => !prev)}>Members</Button>
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
            <div className={classnames(styles.memberList, {[styles.closed]: !sidebars.membersOpen})}>
                {isMembersSuccess ? <LightquarkMemberList members={members}/> : null}
            </div>
        </div>
    </div>)
}