import MessageInput from "../components/nav/MessageInput.jsx";
import DialogMessages from "../components/nav/DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../components/_services/lightquark/nav/LightquarkMemberList.jsx";

export default function ChannelView() {
    return (<>
        <div className={styles.messageArea}>
            <div className={styles.messages}><DialogMessages/></div>
            <MessageInput/>
        </div>
        <div className={styles.memberList}>
            <LightquarkMemberList/>
        </div>
    </>)
}