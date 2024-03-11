import {Link} from "react-router-dom";

export default function GenericQuark({link, icon}) {
    return <Link to={link}><img src={icon} width={64} height={64}/></Link>
}