import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {Outlet} from "react-router-dom";

export default function Quark() {
    const appContext = useContext(AppContext);

    return <Outlet />
}