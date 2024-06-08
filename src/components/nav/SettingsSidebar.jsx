import SidebarItem from "./SidebarItem.jsx";
import {useTranslation} from "react-i18next";

export default function SettingsSidebar({area, setArea}) {
    const {t} = useTranslation();

    return <>
        <span>{t("SETTINGS_USERSETTINGS")}</span>
        <SidebarItem baseI18n={"SETTINGS"} area={"profile"} currentArea={area} setArea={setArea} />
    </>
}