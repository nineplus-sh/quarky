import {Outlet, useParams} from "react-router-dom";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./QuarkView.module.css";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";
import QuarkHeader from "../components/_services/lightquark/nav/QuarkHeader.jsx";
import useQuark from "../components/_services/lightquark/hooks/useQuark.js";
import useMe from "../components/_services/lightquark/hooks/useMe.js";
import {SidebarContext} from "../contexts/SidebarContext.js";
import {useContext} from "react";
import classnames from "classnames";

export default function QuarkView() {
    const {quarkId} = useParams();
    const {data: quarkData, isSuccess: isQuarkSuccess} = useQuark(quarkId.split("lq_")[1]);
    const {data: meData, isSuccess: isMeSuccess} = useMe();
    const sidebars = useContext(SidebarContext);

    return <>
        <div className={styles.quarkView}>
            <div className={classnames(styles.channelListWrap, {[styles.closed]: !sidebars.listOpen})}>
                {isQuarkSuccess ? <><QuarkHeader quark={quarkData}/>
                    <LightquarkChannelList quark={quarkData}/></> : null}

                {isMeSuccess ? <div className={styles.avieboxWrap}>
                    <Aviebox user={meData}/>
                </div> : null}
            </div>
            <Outlet/>
        </div>
    </>
}