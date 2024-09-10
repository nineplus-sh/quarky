import {Outlet, useParams} from "react-router-dom";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./QuarkView.module.css";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";
import QuarkHeader from "../components/_services/lightquark/nav/QuarkHeader.jsx";
import useQuark from "../components/_services/lightquark/hooks/useQuark.js";
import {AppContext} from "../contexts/AppContext.js";
import {useContext} from "react";
import useMe from "../components/_services/lightquark/hooks/useMe.js";

export default function QuarkView() {
    const {quarkId} = useParams();
    const {data: quarkData, isLoading: isQuarkLoading} = useQuark(quarkId.split("lq_")[1]);
    const {data: meData, isLoading: isMeLoading} = useMe();

    return <>
        <div className={styles.quarkView}>
            <div className={styles.channelListWrap}>
                {isQuarkLoading ? null : <><QuarkHeader quark={quarkData}/>
                <LightquarkChannelList quark={quarkData}/></>}

                {isMeLoading ? null : <div className={styles.avieboxWrap}>
                    <Aviebox user={meData}/>
                </div>}
            </div>
            <Outlet/>
        </div>
    </>
}