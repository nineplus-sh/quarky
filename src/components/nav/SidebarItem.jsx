import {useTranslation} from "react-i18next";
import styles from "./SidebarItem.module.css"
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import {useContext} from "react";
import useSound from "../../hooks/useSound.js";

export default function SidebarItem({baseI18n, area, setArea, currentArea, onClick}) {
    const {nyafile} = useContext(AppContext);
    const {t} = useTranslation();

    const {play: sidebarHoverPlay} = useSound("sfx/button-sidebar-hover");
    const {play: sidebarSelectPlay} = useSound("sfx/button-sidebar-select");

    function setAreaWithSound(area) {
        if(currentArea === area) return;
        sidebarSelectPlay();
        setArea(area);
    }

    return <div onClick={() => onClick ? onClick() : setAreaWithSound(area)} className={classnames(styles.sidebarItem, {[styles.active]: currentArea === area})}
                onMouseEnter={() => {
                    if(currentArea===area) return;
                    sidebarHoverPlay();
                }}>
        <span>{t(`${baseI18n.toUpperCase()}_${area.toUpperCase()}`)}</span>
    </div>
}