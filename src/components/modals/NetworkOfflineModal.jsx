import GenericModal from "./GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

export default NiceModal.create(({ name }) =>{
    const modal = useModal();
    const { t } = useTranslation();

    return (<>
        <GenericModal modal={modal}>
            <h2 style={{margin: 0}}>{t("LQ_SERVER_OFFLINE_TITLE")}</h2>
            <p style={{margin: 0}}>{t("LQ_SERVER_OFFLINE_BODY", {name, interpolation: {escapeValue:false}})}</p>
            <button style={{float: "right"}} onClick={modal.hide}>{t("OKAY")}</button>
        </GenericModal>
    </>)
})