import LightquarkChannel from "./LightquarkChannel.jsx";
import styles from "./LightquarkChannelList.module.css";

export default function LightquarkChannelList({quark, demo}) {
    return <div className={styles.channelList}>
        {quark.channels.map((channel) => <LightquarkChannel demo={demo} channel={channel} quarkId={quark._id} key={channel._id} />)}
    </div>
}