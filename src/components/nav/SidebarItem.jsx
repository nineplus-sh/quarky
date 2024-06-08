import {Link, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./SidebarItem.module.css"
import classnames from "classnames";

export default function SidebarItem({baseI18n, area, setArea, currentArea, onClick}) {
    const {t} = useTranslation();

    return <div onClick={() => onClick() || setArea(area)} className={classnames(styles.sidebarItem, {[styles.active]: currentArea === area})}>
        {t(`${baseI18n.toUpperCase()}_${area.toUpperCase()}`)}
    </div>
}