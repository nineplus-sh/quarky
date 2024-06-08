import styles from './Aviebox.module.css';
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import ProfilePicture from "../../../ProfilePicture.jsx";
import localForage from "localforage";
import {useNavigate} from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import JoinQuarkModal from "../../../modals/JoinQuarkModal.jsx";
import SettingsView from "../../../../routes/SettingsView.jsx";

export default function Aviebox() {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className={styles.aviebox}>
            <ProfilePicture src={appContext.accounts.lightquark.avatarUri} px={32}/>
            <p className={styles.name}>{appContext.accounts.lightquark.username}</p>
            <button className={styles.settings} onClick={() => NiceModal.show(SettingsView)}>Settings</button>
        </div>
    );
}