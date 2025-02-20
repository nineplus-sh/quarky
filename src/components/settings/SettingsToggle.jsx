import {useContext} from "react";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import styles from "./SettingsToggle.module.css"
import localForage from "localforage";
import {AppContext} from "../../contexts/AppContext.js";
import useSound from "../../hooks/useSound.js";
import useSettingsSet from "../_services/lightquark/hooks/useSettingsSet.js";
import useSettings from "../_services/lightquark/hooks/useSettings.js";

export default function SettingsToggle({setting}) {
    const {nyafile} = useContext(AppContext);

    const {play: checkboxEnabledPlay} = useSound("sfx/checkbox-true");
    const {play: checkboxDisabledPlay} = useSound("sfx/checkbox-false");
    const {data: settings, isSuccess: settingsReady} = useSettings();
    const {mutate: setSetting} = useSettingsSet();

    async function changeSetting() {
        setSetting({key: setting, value: !settings[setting]});
        !settings[setting] ? checkboxEnabledPlay() : checkboxDisabledPlay();
    }

    if(!settingsReady) return null;
    return <div className={styles.toggle} aria-checked={settings[setting]} onClick={changeSetting}>
        <NyafileImage className={styles.toggleSlider} src={`img/vukky${settings[setting] === true ? "" : "disabled"}`}/>
    </div>
}