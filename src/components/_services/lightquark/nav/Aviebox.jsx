import styles from './Aviebox.module.css';
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import NiceModal from "@ebay/nice-modal-react";
import SettingsView from "../../../../routes/SettingsView.jsx";
import UserSettingsSidebar from "../../../nav/UserSettingsSidebar.jsx";
import UserSettingsArea from "../../../nav/UserSettingsArea.jsx";
import Button from "../../../nav/Button.jsx";

export default function Aviebox({user, interaction = true}) {
    return (
        <div className={styles.aviebox}>
            <span>
                <ProfilePicture src={user.avatarUri} px={32}/>
                <p className={styles.name}>{user.username}</p>
            </span>
            {interaction === false ? null : <span>
                <Button className={styles.settings} onClick={() => NiceModal.show(SettingsView, {Sidebar: UserSettingsSidebar, Area: UserSettingsArea,defaultArea:"profile"})}>Settings</Button>
            </span>}
        </div>
    );
}