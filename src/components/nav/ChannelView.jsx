import {Outlet, useParams} from "react-router-dom";
import LightquarkChannelList from "../_services/lightquark/nav/LightquarkChannelList.jsx";

export default function ChannelView() {
    let { quarkId } = useParams();

    if(quarkId !== "telegram") {
        return <><LightquarkChannelList /><Outlet /><hr/></>
    } else {
        return <Outlet />
    }
}