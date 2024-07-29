import GenericModal from "./GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import localForage from "localforage";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import NyafileImage from "../nyafile/NyafileImage.jsx";

import styles from "./JoinQuarkModal.module.css";
import LQ from "../../util/LQ.js";

export default NiceModal.create(() =>{
    const modal = useModal();
    const { t } = useTranslation();
    const [inviteCode, setInviteCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    async function joinQuark(e) {
        e.preventDefault();
        setIsJoining(true);

        await LQ(`quark/${inviteCode}/join`, "POST", {"invite": inviteCode});
        modal.hide();
    }

    return (<>
        <GenericModal modal={modal}>
            <div className={styles.modal}>
                <div>
                    <NyafileImage src={"img/modal_join_quark"} className={styles.modalImage}/>
                </div>
                <div>
                    <h2 style={{margin: 0}}>{t("JOIN_QUARK")}</h2>
                    <p style={{marginTop: 0}}>{t("JOIN_QUARK_BODY")}</p>

                    <form onSubmit={(e) => joinQuark(e)}><fieldset disabled={isJoining}>
                            <input type={"text"} required placeholder={"litdevs"} value={inviteCode} onChange={e => setInviteCode(e.target.value)}/>
                            <input type={"submit"}/>
                    </fieldset></form>
                </div>
            </div>
        </GenericModal>
    </>)
})