import SettingsSidebar from "../components/nav/SettingsSidebar.jsx";
import SettingsArea from "../components/nav/SettingsArea.jsx";
import styles from "./SettingsView.module.css"
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import {useState} from "react";

export default NiceModal.create(() => {
    const modal = useModal();
    const [area, setArea] = useState("profile")

    return <div className={styles.settingsPopout}>
        <div className={styles.settingsSidebar}>
            <SettingsSidebar area={area} setArea={setArea}/>
        </div>
        <div className={styles.settingsAreaWrap}>
            <div className={styles.settingsArea}>
                <SettingsArea area={area}/>
            </div>
            <button onClick={modal.remove}>Close</button>
        </div>
    </div>
})