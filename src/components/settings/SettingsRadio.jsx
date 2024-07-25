import NyafileImage from "../nyafile/NyafileImage.jsx";
import {useTranslation} from "react-i18next";
import styles from "./SettingsRadio.module.css";
import localForage from "localforage";
import {useContext} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";

export default function SettingsRadio({setting, icon, externalIcon, value, text}) {
    const {t} = useTranslation();
    const {settings, saveSettings} = useContext(AppContext);

    return <div className={classnames(styles.radioSelector, {[styles.radioSelected]: settings[setting] === value})} onClick={()=>saveSettings({[setting]: value})}>
        <span className={styles.radioName}>{text ? text : t(`SETTING_${setting.toUpperCase()}_${value.toUpperCase()}`)}</span>
        {icon ? <NyafileImage src={icon} className={styles.radioIcon}/> : null}
        {externalIcon ? <img src={externalIcon} className={styles.radioIcon}/> : null}
    </div>
}