import {useContext} from "react";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import styles from "./SettingsToggle.module.css"
import localForage from "localforage";
import {AppContext} from "../../contexts/AppContext.js";

export default function SettingsToggle({setting}) {
    const {settings, setSettings, nyafile} = useContext(AppContext);

    async function changeSetting() {
        setSettings({...settings, [setting]: !settings[setting]});
        new Audio(nyafile.getFileURL(`sfx/checkbox-${!settings[setting]}`)).play();

        const oldForage = await localForage.getItem("settings")
        await localForage.setItem("settings", {...oldForage, [setting]: !settings[setting]});
    }

    return <div className={styles.toggle} aria-checked={settings[setting]} onClick={changeSetting}>
        <NyafileImage className={styles.toggleSlider} src={`img/vukky${settings[setting] === true ? "" : "disabled"}`}/>
    </div>
}