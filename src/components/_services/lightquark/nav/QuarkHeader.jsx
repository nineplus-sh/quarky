import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";
import styles from "./QuarkHeader.module.css"
import {useTranslation} from "react-i18next";
import LQ from "../../../../util/LQ.js";
import NiceModal from "@ebay/nice-modal-react";
import SettingsView from "../../../../routes/SettingsView.jsx";
import QuarkSettingsSidebar from "../settings/QuarkSettingsSidebar.jsx";
import QuarkSettingsArea from "../settings/QuarkSettingsArea.jsx";
import useMe from "../hooks/useMe.js";
import Button from "../../../nav/Button.jsx";
import useQuarkLeave from "../hooks/useQuarkLeave.js";

export default function QuarkHeader({quark, interaction = true}) {
    const {quarkList, setQuarkList} = useContext(AppContext);
    const {quarkId} = useParams();
    const {t} = useTranslation();
    const navigate = useNavigate();

    const {data: userData, isLoading} = useMe();
    const quarkLeave = useQuarkLeave();

    async function leaveQuark() {
        if(confirm(t("LEAVE_QUARK_CONFIRM", {name: quark?.name}))) {
            await quarkLeave.mutateAsync(quarkId.split("lq_")[1]);
            navigate("/lq_100000000000000000000000");
        }
    }

    if(isLoading) return null;
    return <div className={styles.header}>
        <span>{quark?.name}</span>
        {interaction === false || quarkId === "lq_100000000000000000000000" ? null :
            quark?.owners.includes(userData._id) ?
            <Button onClick={() => NiceModal.show(SettingsView, {data:{quarkId:quark._id},Sidebar:QuarkSettingsSidebar,Area:QuarkSettingsArea,defaultArea:"overview"})}>{t("MANAGE_QUARK")}</Button> :
            <Button onClick={() => leaveQuark()}>{t("LEAVE_QUARK")}</Button>}
    </div>
}