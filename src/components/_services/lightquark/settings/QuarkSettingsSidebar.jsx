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
    return <div className={styles.sidebarContents}>
        <SidebarItem baseI18n={"QUARK_SETTINGS"} area={"overview"} currentArea={area} setArea={setArea}/>
        <div className={styles.separator}/>
        <SidebarItem baseI18n={"QUARK_SETTINGS"} area={"delete"} currentArea={area} setArea={setArea}/>
    </div>
}