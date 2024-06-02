import MessageInput from "./MessageInput.jsx";
import DialogMessages from "./DialogMessages.jsx";
import styles from "./ChannelView.module.css";
import LightquarkMemberList from "../_services/lightquark/nav/LightquarkMemberList.jsx";

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