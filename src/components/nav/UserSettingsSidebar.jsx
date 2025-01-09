import SidebarItem from "./SidebarItem.jsx";
import {useTranslation} from "react-i18next";
import styles from "./UserSettingsSidebar.module.css";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {version, codename} from "../../../package.json";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import CreditsModal from "../modals/CreditsModal.jsx";
import localForage from "localforage";
import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";

export default function UserSettingsSidebar({area, setArea}) {
    const modal = useModal();
    const appContext = useContext(AppContext);
    const {t} = useTranslation();

    async function logOut() {
        modal.remove();

        await localForage.removeItem("lightquark");
        appContext.setApiKeys({});
    }

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
        <SidebarItem baseI18n={"SETTINGS"} area={"language"} currentArea={area} setArea={setArea}/>
        {window.hiddenside?.hardcoreGaming ? <SidebarItem baseI18n={"SETTINGS"} area={"playing"} currentArea={area} setArea={setArea}/> : null }

        <div className={styles.separator}/>

        <SidebarItem baseI18n={"CREDITS"} area={"BUTTON"} onClick={() => NiceModal.show(CreditsModal)}/>
        <SidebarItem baseI18n={"SUPPORT"} area={"BUTTON"} onClick={() => window.open("https://www.nineplus.sh/support.html", "_blank")}/>
        <SidebarItem baseI18n={"SETTINGS"} area={"netinfo"} currentArea={area} setArea={setArea}/>
        
        <div className={styles.separator}/>

        <SidebarItem baseI18n={"SIGN"} area={"OUT"} onClick={logOut}/>

        <div className={styles.separator}/>

        <div className={styles.version}>
            <p>{t("QUARKY_VERSION", {version, codename})}</p>
            <NyafileImage src={"img/nineball"} className={styles.nineplus}/>
        </div>
        <div className={styles.sns}>
            <a href={"https://bsky.app/profile/nineplus.sh"} target={"_blank"} rel="noreferrer"><NyafileImage src={"img/bluesky"} inlinesvg={true}/></a>
            <a href={"https://twitter.com/nineplus_sh"} target={"_blank"} rel="noreferrer"><NyafileImage src={"img/twitter"} inlinesvg={true}/></a>
            <a href={"https://tumblr.com/nineplus-sh"} target={"_blank"} rel="noreferrer"><NyafileImage src={"img/tumblr"} inlinesvg={true}/></a>
        </div>
    </div>
}