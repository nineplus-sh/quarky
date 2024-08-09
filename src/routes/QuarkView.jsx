import {Outlet} from "react-router-dom";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./QuarkView.module.css";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";
import QuarkHeader from "../components/_services/lightquark/nav/QuarkHeader.jsx";

export default function QuarkView() {
    return <>
        <div className={styles.quarkView}>
            <div className={styles.channelListWrap}>
                <QuarkHeader/>
                <LightquarkChannelList/>
                <Aviebox/>
            </div>
            <Outlet/>
        </div>
    </>
}