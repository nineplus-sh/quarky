import {Outlet} from "react-router-dom";
import LightquarkChannelList from "../_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./QuarkView.module.css";

export default function QuarkView() {
    return <>
        <div className={styles.channelList}>
            <LightquarkChannelList/>
        </div>
        <Outlet/>
    </>
}