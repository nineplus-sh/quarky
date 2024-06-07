import {Outlet} from "react-router-dom";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./QuarkView.module.css";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";

export default function QuarkView() {
    return <>
        <div className={styles.quarkView}>
            <div className={styles.channelListWrap}>
                <LightquarkChannelList/>
                <Aviebox/>
            </div>
            <Outlet/>
        </div>
    </>
}