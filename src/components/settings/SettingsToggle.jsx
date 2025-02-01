import {useContext} from "react";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import styles from "./SettingsToggle.module.css"
import localForage from "localforage";
import {AppContext} from "../../contexts/AppContext.js";
import useSound from "../../hooks/useSound.js";

export default function SettingsToggle({setting}) {
    const {settings, setSettings, nyafile} = useContext(AppContext);

    const {play: checkboxEnabledPlay} = useSound("sfx/checkbox-true");
    const {play: checkboxDisabledPlay} = useSound("sfx/checkbox-false");

    async function changeSetting() {
        setSettings({...settings, [setting]: !settings[setting]});
        !settings[setting] ? checkboxEnabledPlay() : checkboxDisabledPlay();

        const oldForage = await localForage.getItem("settings")
        await localForage.setItem("settings", {...oldForage, [setting]: !settings[setting]});
    }

    return <div className={styles.toggle} aria-checked={settings[setting]} onClick={changeSetting}>
        <NyafileImage className={styles.toggleSlider} src={`img/vukky${settings[setting] === true ? "" : "disabled"}`}/>
    </div>
}