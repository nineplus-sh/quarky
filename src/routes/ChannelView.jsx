import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";
import {useContext, useEffect, useState} from "react";
import LQ from "../util/LQ.js";
import {AppContext} from "../contexts/AppContext.js";
import {useParams} from "react-router-dom";

export default function ChannelView() {
    const [messages, setMessages] = useState([]);
    const appContext = useContext(AppContext);
    const {dialogId} = useParams();

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

    return (<>
        <div className={styles.messageArea}>
            <div className={styles.messages}><DialogMessages messages={messages}/></div>
            <MessageInput/>
        </div>
        <div className={styles.memberList}>
            <LightquarkMemberList/>
        </div>
    </>)
}