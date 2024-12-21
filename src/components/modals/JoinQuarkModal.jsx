import GenericModal from "./GenericModal.jsx";
import {Trans, useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import NyafileImage from "../nyafile/NyafileImage.jsx";

import styles from "./JoinQuarkModal.module.css";
import LQ from "../../util/LQ.js";
import useQuarkJoin from "../_services/lightquark/hooks/useQuarkJoin.js";
import {useNavigate} from "react-router-dom";
import useQuarkCreate from "../_services/lightquark/hooks/useQuarkCreate.js";
import {router} from "../../index.jsx";

export default NiceModal.create(() =>{
    const modal = useModal();
    const { t } = useTranslation();
    const [inviteCode, setInviteCode] = useState("");
    const [tab, switchTab] = useState("join");
    const [createName, setCreateName] = useState("");
    const [createCode, setCreateCode] = useState("");
    const quarkJoin = useQuarkJoin();
    const quarkCreate = useQuarkCreate();

    async function handleCall(e, create){
        e.preventDefault();
        let quark;
        if(create) {
            quark = await quarkCreate.mutateAsync(createName, createCode);
        } else {
            quark = await quarkJoin.mutateAsync(inviteCode);
        }
        console.log(quark)
        router.navigate(`/lq_${quark._id}`);
        modal.hide();
    }

    return (<>
        <GenericModal modal={modal}>
            <div className={styles.modal}>
                <div>
                    <NyafileImage src={"img/modal_join_quark"} className={styles.modalImage}/>
                </div>
                <div>
                    {tab === "join" ? <>
                        <h2 style={{margin: 0}}>{t("JOIN_QUARK")}</h2>
                        <p style={{marginTop: 0}}>{t("JOIN_QUARK_BODY")}</p>

                        <form onSubmit={(e) => handleCall(e,false)}><fieldset disabled={quarkJoin.isPending}>
                                <input type={"text"} required placeholder={t("JOIN_QUARK_CODE")} value={inviteCode} onChange={e => setInviteCode(e.target.value)}/>
                                <input type={"submit"}/>
                            {quarkJoin.isError ? <span><br/>{quarkJoin.error.response.message}</span> : null}
                        </fieldset></form>

                        <p style={{marginBottom: 0}}>
                            <Trans i18nKey="JOIN_QUARK_CREATE" components={[<button
                                onClick={() => switchTab("create")}/>]}/>
                        </p>
                    </> : tab === "create" ? <>
                        <h2 style={{marginTop: 0}}>{t("CREATE_QUARK")}</h2>

                        <form onSubmit={(e) => handleCall(e,true)}>
                            <fieldset disabled={false}>
                                <input type={"text"} required placeholder={t("CREATE_QUARK_NAME")} value={createName}
                                       onChange={e => setCreateName(e.target.value)}/>
                                <input type={"text"} placeholder={t("CREATE_QUARK_CODE")} value={createCode}
                                       onChange={e => setCreateCode(e.target.value)}/>
                                <input type={"submit"}/>
                            </fieldset>
                        </form>

                        <p style={{marginBottom: 0}}>
                            <Trans i18nKey="CREATE_QUARK_JOIN" components={[<button
                                onClick={() => switchTab("join")}/>]}/>
                        </p>
                    </> : <p>{t("WOOSCREEN_TITLE")}</p>}
                </div>
            </div>
        </GenericModal>
    </>)
})