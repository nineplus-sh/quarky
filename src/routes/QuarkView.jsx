import {Outlet, useParams} from "react-router-dom";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import styles from "./QuarkView.module.css";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";
import QuarkHeader from "../components/_services/lightquark/nav/QuarkHeader.jsx";
import useQuark from "../util/useQuark.js";
import {AppContext} from "../contexts/AppContext.js";
import {useContext} from "react";

export default function QuarkView() {
    const {quarkId} = useParams();
    const {data, isLoading} = useQuark(quarkId.split("lq_")[1]);
    const {accounts} = useContext(AppContext);

    return <>
        <div className={styles.quarkView}>
            <div className={styles.channelListWrap}>
                {isLoading ? null : <><QuarkHeader quark={data}/>
                <LightquarkChannelList quark={data}/></>}

                <div className={styles.avieboxWrap}>
                    <Aviebox user={accounts.lightquark}/>
                </div>
            </div>
            <Outlet/>
        </div>
    </>
}