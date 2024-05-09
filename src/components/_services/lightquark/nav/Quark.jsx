import GenericQuark from "../../../nav/GenericQuark.jsx";
import {Link} from "react-router-dom";

export default function Quark({quark}) {
    return <Link to={`/lq_${quark._id}`}><GenericQuark icon={quark.iconUri} /></Link>
}