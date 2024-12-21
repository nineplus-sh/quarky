import {Link, useParams} from "react-router-dom";
import GenericChannel from "../../../nav/GenericChannel.jsx";

export default function LightquarkChannel({demo, channel, quarkId}) {
    const {dialogId} = useParams();

    return <Link to={demo ? `/demo/${quarkId}/${channel._id}` : `/lq_${quarkId}/${channel._id}`} style={{textDecoration:'none'}}>
        <GenericChannel name={"# " + channel.name} active={channel._id === dialogId} />
    </Link>
}