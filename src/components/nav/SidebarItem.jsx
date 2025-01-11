import {useTranslation} from "react-i18next";
import styles from "./SidebarItem.module.css"
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import {useContext} from "react";

export default function SidebarItem({baseI18n, area, setArea, currentArea, onClick}) {
    const {nyafile} = useContext(AppContext);
    const {t} = useTranslation();

    function setAreaWithSound(area) {
        if(currentArea === area) return;
        new Audio(nyafile.getFileURL("sfx/button-sidebar-select")).play();
        setArea(area);
    }

    return <div onClick={() => onClick ? onClick() : setAreaWithSound(area)} className={classnames(styles.sidebarItem, {[styles.active]: currentArea === area})}
                onMouseEnter={() => {
                    if(currentArea===area) return;
                    new Audio(nyafile.getFileURL("sfx/button-sidebar-hover")).play();
                }}>
        <span>{t(`${baseI18n.toUpperCase()}_${area.toUpperCase()}`)}</span>
    </div>
}