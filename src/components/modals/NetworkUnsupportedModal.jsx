import GenericModal from "./GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import localForage from "localforage";
import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";

export default NiceModal.create(({ name, maintainer, signOut }) =>{
    const modal = useModal();
    const { t } = useTranslation();
    const appContext = useContext(AppContext);

    async function logOut() {
        await localForage.removeItem("lightquark");
        appContext.setAccounts({});
        modal.hide();
    }

    return (<>
        <GenericModal modal={modal} allowNonEventClose={false}>
            <h2 style={{margin: 0}}>{t("LQ_SERVER_OUTDATED_TITLE")}</h2>
            <p style={{margin: 0}}>{t("LQ_SERVER_OUTDATED_BODY", {name, maintainer})}</p>
            {signOut ? <button style={{float: "right"}} onClick={logOut}>{t("SIGN_OUT")}</button>  :
                <button style={{float: "right"}} onClick={modal.hide}>{t("OKAY")}</button>}
        </GenericModal>
    </>)
})