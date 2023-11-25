import {Link} from "react-router-dom";

export default function LightquarkChannel({channel}) {
    return <div><Link to={`/lq_${channel.quark}/${channel._id}`}>{channel.name}</Link></div>
}