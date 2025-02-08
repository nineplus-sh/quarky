import NyafileImage from "../nyafile/NyafileImage.jsx";
import {useTranslation} from "react-i18next";
import styles from "./SettingsRadio.module.css";
import localForage from "localforage";
import {useContext} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import useSettings from "../_services/lightquark/hooks/useSettings.js";
import useSettingsSet from "../_services/lightquark/hooks/useSettingsSet.js";
import useSound from "../../hooks/useSound.js";

export default function SettingsRadio({setting, icon, externalIcon, value, text, leftDecor, rightDecor}) {
    const {t} = useTranslation();
    const {data: settings, isSuccess: settingsReady} = useSettings();
    const {mutate: setSetting} = useSettingsSet();

    const {play: hoverPlay} = useSound("sfx/default-hover");
    const {play: selectPlay} = useSound("sfx/default-select");

    if(!settingsReady) return null;
    return <div className={classnames(styles.radioSelector, {[styles.radioSelected]: settings[setting] === value})} onMouseEnter={hoverPlay} onClick={()=>{selectPlay();setSetting({key: setting, value})}}>
        {leftDecor ? <div className={styles.radioIconLeft}>{leftDecor}</div> : null}
        <span className={styles.radioName}>{text ? text : t(`SETTING_${setting.toUpperCase()}_${value.toUpperCase()}`)}</span>
        {rightDecor ? <div className={styles.radioIconRight}>{rightDecor}</div> : null}
    </div>
}