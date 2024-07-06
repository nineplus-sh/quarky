import GenericModal from "./GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import localForage from "localforage";

export default NiceModal.create(({ name, signOut }) =>{
    const modal = useModal();
    const { t } = useTranslation();

    async function logOut() {
        await localForage.removeItem("lightquark");
        document.location.reload();
    }

    return (<>
        <GenericModal modal={modal}>
            <h2 style={{margin: 0}}>{t("LQ_SERVER_OFFLINE_TITLE")}</h2>
            <p style={{margin: 0}}>{t("LQ_SERVER_OFFLINE_BODY", {name, interpolation: {escapeValue: false}})}</p>
            {signOut ? <button style={{float: "right"}} onClick={logOut}>{t("SIGN_OUT")}</button>  :
                <button style={{float: "right"}} onClick={modal.hide}>{t("OKAY")}</button>}
        </GenericModal>
    </>)
})