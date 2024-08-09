import {Link, useParams} from "react-router-dom";
import classnames from "classnames";
import styles from "./LightquarkChannel.module.css";

export default function LightquarkChannel({channel, quarkId}) {
    const {dialogId} = useParams();

    return <Link to={`/lq_${quarkId}/${channel._id}`} className={classnames(styles.channel, {[styles.active]: channel._id === dialogId})}>{channel.name}</Link>
}