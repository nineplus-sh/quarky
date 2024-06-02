import {Link} from "react-router-dom";

export default function LightquarkChannel({channel, quarkId}) {
    return <div><Link to={`/lq_${quarkId}/${channel._id}`}>{channel.name}</Link></div>
}