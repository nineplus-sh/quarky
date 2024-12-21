import GenericQuark from "../../../nav/GenericQuark.jsx";
import {Link} from "react-router-dom";
import useQuark from "../hooks/useQuark.js";

export default function Quark({id}) {
    const {data: quark, isLoading} = useQuark(id);
    if(isLoading) return null;
    return <Link to={`/lq_${id}`}><GenericQuark icon={quark.iconUri} name={quark.name} /></Link>
}