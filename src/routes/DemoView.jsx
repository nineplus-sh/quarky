import mainViewStyles from "./MainView.module.css";
import quarkViewStyles from "./QuarkView.module.css";
import QuarkHeader from "../components/_services/lightquark/nav/QuarkHeader.jsx";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";
import channelViewStyles from "./ChannelView.module.css";
import MessageInput from "../components/nav/MessageInput.jsx";
import clientStyles from "./ClientWrapper.module.css";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";
import Message from "../components/dialogs/Message.jsx";
import conversations from "../util/democonvos.json"
import {useTranslation} from "react-i18next";
import shuffle from "../util/shuffle.js";
import LightquarkAttachments from "../components/_services/lightquark/dialogs/LightquarkAttachments.jsx";

const fakeQuarks = [{
    _id: "9phq",
    iconUri: "https://pbs.twimg.com/profile_images/1773097531074891776/KjHzRCV4_400x400.png",
    name: "ninePLUS HQ",
    channels: [{
        _id: "9phq_lobby",
        name: "lobby"
    }]
}]

export default function DemoView() {
    const navigate = useNavigate();
    const { quarkId, channelId } = useParams();
    const [fakeMessages, setFakeMessages] = useState({});
    const {t} = useTranslation();

    useLayoutEffect(() => {
        document.querySelector("div[class^='_messages_']")?.lastChild?.scrollIntoView({"behavior": "smooth"});
    }, [fakeMessages]);

    useEffect(() => {
        if(!quarkId) navigate("/demo/9phq/9phq_lobby");
    }, []);
    const currentFakeQuark = fakeQuarks.find(quark => quark._id === quarkId);
    if(!currentFakeQuark) return null;

    return <div className={clientStyles.client}>
        <div className={mainViewStyles.quarkList}>
            <QuarkList demo={true} list={fakeQuarks}/>
        </div>
        <div className={quarkViewStyles.quarkView}>
            <div className={quarkViewStyles.channelListWrap}>
                <QuarkHeader interaction={false} quark={currentFakeQuark}/>
                <LightquarkChannelList demo={true} quark={currentFakeQuark}/>
                <Aviebox interaction={false} user={{
                    avatarUri: "https://google.com",
                    username: "You!"
                }}/>
            </div>
            <div className={channelViewStyles.messageArea}>
                <div className={channelViewStyles.messages}>
                    {fakeMessages[channelId]?.map((message, index) => <Message key={index} {...message} attachments={<LightquarkAttachments attachments={message.attachments}/>}/>)}
                </div>
                <MessageInput interaction={false}/>
            </div>
        </div>
    </div>
}