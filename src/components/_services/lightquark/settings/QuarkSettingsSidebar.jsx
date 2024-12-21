import SidebarItem from "../../../nav/SidebarItem.jsx";
import styles from "../../../nav/UserSettingsSidebar.module.css";
import LQ from "../../../../util/LQ.js";
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import {router} from "../../../../index.jsx";
import {useTranslation} from "react-i18next";
import {useModal} from "@ebay/nice-modal-react";
import useQuark from "../hooks/useQuark.js";

export default function QuarkSettingsSidebar({area, setArea, data}) {
    const {nyafile} = useContext(AppContext);
    const {data: quark, isLoading} = useQuark(data.quarkId);
    const {t} = useTranslation();
    const modal = useModal();

    async function deleteQuark() {
        new Audio(nyafile.getCachedData("sfx/dialog-pop-in")).play();
        setTimeout(async function() {
            const letsPurge = confirm(t("DELETE_QUARK_CONFIRM", {name: quark.name.toUpperCase()}));
            if(letsPurge) {
                new Audio(nyafile.getCachedData("sfx/dialog-dangerous-select")).play();
                router.navigate("/lq_100000000000000000000000");
                const leave = await LQ(`quark/${quark._id}`, "DELETE");

                if(leave.statusCode !== 200) {
                    router.navigate(-1);
                    alert("Could not delete the quark.");
                } else {
                    setQuarkList(quarkList.filter(item => item !== quark._id));
                    modal.hide();
                }
            } else {
                new Audio(nyafile.getCachedData("sfx/dialog-cancel-select")).play();
            }
        }, 20)
    }

    if (isLoading) return null;
    return <div className={styles.sidebarContents}>
        <SidebarItem baseI18n={"QUARK_SETTINGS"} area={"overview"} currentArea={area} setArea={setArea}/>
        <div className={styles.separator}/>
        <SidebarItem baseI18n={"QUARK_SETTINGS"} area={"delete"} currentArea={area} setArea={setArea}/>
    </div>
}