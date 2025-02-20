import SidebarItem from "../../../nav/SidebarItem.jsx";
import styles from "../../../settings/UserSettingsSidebar.module.css";

export default function QuarkSettingsSidebar({area, setArea, data}) {
    return <div className={styles.sidebarContents}>
        <SidebarItem baseI18n={"QUARK_SETTINGS"} area={"overview"} currentArea={area} setArea={setArea}/>
        <div className={styles.separator}/>
        <SidebarItem baseI18n={"QUARK_SETTINGS"} area={"delete"} currentArea={area} setArea={setArea}/>
    </div>
}