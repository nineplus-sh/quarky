import styles from './Aviebox.module.css';
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import NiceModal from "@ebay/nice-modal-react";
import SettingsView from "../../../../routes/SettingsView.jsx";
import UserSettingsSidebar from "../../../nav/UserSettingsSidebar.jsx";
import UserSettingsArea from "../../../nav/UserSettingsArea.jsx";

export default function Aviebox({user, interaction = true}) {
    return (
        <div className={styles.aviebox}>
            <ProfilePicture src={user.avatarUri} px={32}/>
            <p className={styles.name}>{user.username}</p>
            {interaction === false ? null : <button className={styles.settings} onClick={() => NiceModal.show(SettingsView, {Sidebar: UserSettingsSidebar, Area: UserSettingsArea,defaultArea:"profile"})}>Settings</button>}
        </div>
    );
}