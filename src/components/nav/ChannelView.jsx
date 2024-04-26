import {Outlet} from "react-router-dom";
import LightquarkChannelList from "../_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./ChannelView.module.css";

export default function ChannelView() {
    return <>
        <div className={styles.channelList}>
            <LightquarkChannelList />
        </div>
        <div className={styles.messageArea}>
            <Outlet />
        </div>
    </>
}