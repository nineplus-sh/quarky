import GenericQuark from "../../../nav/GenericQuark.jsx";
import {Link} from "react-router-dom";

export default function Quark({quark, demo}) {
    return <Link to={demo ? `/demo/${quark._id}` : `/lq_${quark._id}`}><GenericQuark icon={quark.iconUri} name={quark.name} /></Link>
}