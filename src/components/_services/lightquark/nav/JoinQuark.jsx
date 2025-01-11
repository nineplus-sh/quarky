import GenericQuark from "../../../nav/GenericQuark.jsx";
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import JoinQuarkModal from "../../../modals/JoinQuarkModal.jsx";
import NiceModal from "@ebay/nice-modal-react";
import {useTranslation} from "react-i18next";

export default function JoinQuark() {
    const appContext = useContext(AppContext);
    const {t} = useTranslation();
    return <span onClick={() => NiceModal.show(JoinQuarkModal)}><GenericQuark name={t("JOIN_QUARK")} icon={appContext.nyafile.getFileURL("img/quark_join")} /></span>
}