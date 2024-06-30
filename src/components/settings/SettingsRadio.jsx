import NyafileImage from "../nyafile/NyafileImage.jsx";
import {useTranslation} from "react-i18next";
import styles from "./SettingsRadio.module.css";
import localForage from "localforage";
import {useContext} from "react";
import {SettingsContext} from "../../contexts/SettingsContext.js";
import classnames from "classnames";

export default function SettingsRadio({setting, icon, externalIcon, value, text}) {
    const {t} = useTranslation();
    const {settings, setSettings} = useContext(SettingsContext);

    async function changeSetting() {
        setSettings({...settings, [setting]: value});

        const oldForage = await localForage.getItem("settings")
        await localForage.setItem("settings", {...oldForage, [setting]: value});
    }

    return <div className={classnames(styles.radioSelector, {[styles.radioSelected]: settings[setting] === value})} onClick={changeSetting}>
        <span className={styles.radioName}>{text ? text : t(`SETTING_${setting.toUpperCase()}_${value.toUpperCase()}`)}</span>
        {icon ? <NyafileImage src={icon} className={styles.radioIcon}/> : null}
        {externalIcon ? <img src={externalIcon} className={styles.radioIcon}/> : null}
    </div>
}