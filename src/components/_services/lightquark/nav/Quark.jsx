import {Link} from "react-router-dom";

export default function Quark({quark}) {
    if(quark._id === "000000000000000000000000") return;
    return <Link to={`/lq_${quark.id}`}><img src={quark.iconUri} width={64} height={64}/></Link>
}