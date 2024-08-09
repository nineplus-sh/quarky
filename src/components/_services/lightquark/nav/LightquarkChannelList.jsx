import {useContext, useEffect, useState} from "react";
import LQ from "../../../../util/LQ.js";
import {useParams} from "react-router-dom";
import LightquarkChannel from "./LightquarkChannel.jsx";
import styles from "./LightquarkChannelList.module.css";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function LightquarkChannelList() {
    const {quarkCache} = useContext(AppContext);
    const {quarkId} = useParams();

    return <div className={styles.channelList}>
        {quarkCache[quarkId.split("lq_")[1]]?.channels.map((channel) => <LightquarkChannel channel={channel} quarkId={quarkId.split("lq_")[1]} key={channel._id} />)}
    </div>
}