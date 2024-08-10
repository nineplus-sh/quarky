import GenericModal from "./GenericModal.jsx";
import {Trans, useTranslation} from "react-i18next";
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
    const [tab, switchTab] = useState("join");
    const [createName, setCreateName] = useState("");
    const [createCode, setCreateCode] = useState("");
    const {quarkCache, setQuarkCache, quarkList, setQuarkList} = useContext(AppContext);

    async function joinQuark(e) {
        e.preventDefault();
        setIsJoining(true);

        const join = await LQ(`quark/${inviteCode}/join`, "POST", {"invite": inviteCode});
        if(join.statusCode === 200) {
            setQuarkCache({
                ...quarkCache,
                [join.response.quark._id]: join.response.quark
            })
            setQuarkList([...quarkList, join.response.quark._id])
        } else {
            alert("Failed to join the quark.")
        }
        modal.hide();
    }

    async function createQuark(e) {
        e.preventDefault();
        setIsJoining(true);

        const created = await LQ("quark", "POST", {name: createName, ...(createCode && { invite: createCode })});
        if(created.statusCode === 201) {
            setQuarkCache({
                ...quarkCache,
                [created.response.quark._id]: created.response.quark
            })
            setQuarkList([...quarkList, created.response.quark._id])
        } else {
            alert("Failed to create the quark.")
        }
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

                        <form onSubmit={(e) => joinQuark(e)}><fieldset disabled={isJoining}>
                                <input type={"text"} required placeholder={t("JOIN_QUARK_CODE")} value={inviteCode} onChange={e => setInviteCode(e.target.value)}/>
                                <input type={"submit"}/>
                        </fieldset></form>

                        <p style={{marginBottom: 0}}>
                            <Trans i18nKey="JOIN_QUARK_CREATE" components={[<button
                                onClick={() => switchTab("create")}/>]}/>
                        </p>
                    </> : tab === "create" ? <>
                        <h2 style={{marginTop: 0}}>{t("CREATE_QUARK")}</h2>

                        <form onSubmit={(e) => createQuark(e)}>
                            <fieldset disabled={isJoining}>
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