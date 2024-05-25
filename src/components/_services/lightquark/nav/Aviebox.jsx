import styles from './Aviebox.module.css';
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import ProfilePicture from "../../../ProfilePicture.jsx";
import localForage from "localforage";

export default function Aviebox() {
    const appContext = useContext(AppContext);

    async function logOut() {
        await localForage.removeItem("lightquark");
        appContext.setAccounts({});
    }

    return (
        <div className={styles.aviebox}>
            <ProfilePicture src={appContext.accounts.lightquark.avatarUri} px={32}/>
            <p className={styles.name}>{appContext.accounts.lightquark.username}</p>
            <button className={styles.logout} onClick={logOut}>Log out</button>
        </div>
    );
}