import GenericQuark from "../../../nav/GenericQuark.jsx";
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import JoinQuarkModal from "../../../modals/JoinQuarkModal.jsx";
import NiceModal from "@ebay/nice-modal-react";

export default function JoinQuark() {
    const appContext = useContext(AppContext);
    return <span onClick={() => NiceModal.show(JoinQuarkModal)}><GenericQuark icon={appContext.nyafile.getCachedData("img/quark_join")} /></span>
}