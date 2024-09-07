import {useContext, useEffect, useState} from "react";
import LQ from "../../../../util/LQ.js";
import {useParams} from "react-router-dom";
import LightquarkChannel from "./LightquarkChannel.jsx";
import styles from "./LightquarkChannelList.module.css";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function LightquarkChannelList({quark, demo}) {
    return <div className={styles.channelList}>
        {quark.channels.map((channel) => <LightquarkChannel demo={demo} channel={channel} quarkId={quark._id} key={channel._id} />)}
    </div>
}