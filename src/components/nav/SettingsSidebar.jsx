import SidebarItem from "./SidebarItem.jsx";
import {useTranslation} from "react-i18next";
import styles from "./SettingsSidebar.module.css";
import NyafileImage from "../nyafile/NyafileImage.jsx";

export default function SettingsSidebar({area, setArea}) {
    const {t} = useTranslation();

    return <div className={styles.sidebarContents}>
        <div className={styles.sidebarHeader}>
            <span>{t("SETTINGS_USERSETTINGS")}</span>
            <NyafileImage src={"img/vukkyicon"} inlineSvg={true} className={styles.sidebarHeaderIcon}/>
        </div>
        <SidebarItem baseI18n={"SETTINGS"} area={"profile"} currentArea={area} setArea={setArea} />
    </div>
}