import GenericQuark from "../../../nav/GenericQuark.jsx";
import {Link} from "react-router-dom";
import useQuark from "../hooks/useQuark.js";
import {SidebarContext} from "../../../../contexts/SidebarContext.js";
import {useContext} from "react";

export default function Quark({id}) {
    const {data: quark, isLoading} = useQuark(id);
    const sidebars = useContext(SidebarContext);
    if(isLoading) return null;
    return <Link to={`/lq_${id}`} onClick={() => sidebars.setListOpen(true)}><GenericQuark icon={quark.iconUri} name={quark.name} /></Link>
}