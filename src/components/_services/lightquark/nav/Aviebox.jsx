import styles from './Aviebox.module.css';
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import localForage from "localforage";
import {useNavigate} from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import JoinQuarkModal from "../../../modals/JoinQuarkModal.jsx";
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