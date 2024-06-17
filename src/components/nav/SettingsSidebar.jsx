import SidebarItem from "./SidebarItem.jsx";
import {useTranslation} from "react-i18next";
import styles from "./SettingsSidebar.module.css";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {version, codename} from "../../../package.json";
import NiceModal from "@ebay/nice-modal-react";
import CreditsModal from "../modals/CreditsModal.jsx";

export default function SettingsSidebar({area, setArea}) {
    const {t} = useTranslation();

    return <div className={styles.sidebarContents}>
        <div className={styles.sidebarHeader}>
            <span>{t("SETTINGS_USERSETTINGS")}</span>
        </div>
        <SidebarItem baseI18n={"SETTINGS"} area={"profile"} currentArea={area} setArea={setArea}/>

        <div className={styles.separator}/>

        <div className={styles.sidebarHeader}>
            <span>{t("SETTINGS_APPSETTINGS")}</span>
        </div>
        <SidebarItem baseI18n={"SETTINGS"} area={"appearance"} currentArea={area} setArea={setArea}/>
        <SidebarItem baseI18n={"SETTINGS"} area={"chat"} currentArea={area} setArea={setArea}/>
        {window.hiddenside?.hardcoreGaming ? <SidebarItem baseI18n={"SETTINGS"} area={"playing"} currentArea={area} setArea={setArea}/> : null }

        <div className={styles.separator}/>
        <button onClick={() => NiceModal.show(CreditsModal)}>Credits</button>
        <div className={styles.separator}/>

        <div className={styles.version}>
            <p>{t("QUARKY_VERSION", {version, codename})}</p>
            <NyafileImage src={"img/nineball"} className={styles.nineplus}/>
        </div>
        <div className={styles.sns}>
            <a href={"https://twitter.com/nineplus_sh"} target={"_blank"} rel="noreferrer"><NyafileImage src={"img/twitter"} inlinesvg={true}/></a>
            <a href={"https://tumblr.com/nineplus-sh"} target={"_blank"} rel="noreferrer"><NyafileImage src={"img/tumblr"} inlinesvg={true}/></a>
        </div>
    </div>
}