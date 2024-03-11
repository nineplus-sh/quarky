import {Outlet, useParams} from "react-router-dom";
import LightquarkChannelList from "../_services/lightquark/nav/LightquarkChannelList.jsx";
import TelegramDMSelector from "../_services/telegram/nav/TelegramDMSelector.jsx";
import styles from "./ChannelView.module.css";

export default function ChannelView() {
    let { quarkId } = useParams();

    if(quarkId !== "telegram") {
        return <><div className={styles.channelList}><LightquarkChannelList /></div><div className={styles.messageArea}><Outlet /></div></>
    } else {
        return <><div className={styles.channelList}><TelegramDMSelector /></div><div className={styles.messageArea}><Outlet/></div></>
    }
}