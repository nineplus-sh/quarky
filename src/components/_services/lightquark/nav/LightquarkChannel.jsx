import {Link, useParams} from "react-router-dom";
import GenericChannel from "../../../nav/GenericChannel.jsx";
import {SidebarContext} from "../../../../contexts/SidebarContext.js";
import {useContext} from "react";

export default function LightquarkChannel({demo, channel, quarkId}) {
    const {dialogId} = useParams();
    const sidebars = useContext(SidebarContext);

    return <Link to={demo ? `/demo/${quarkId}/${channel._id}` : `/lq_${quarkId}/${channel._id}`}
                 onClick={() => sidebars.setListOpen(false)}
                 style={{textDecoration:'none'}}>
        <GenericChannel name={"# " + channel.name} active={channel._id === dialogId} />
    </Link>
}