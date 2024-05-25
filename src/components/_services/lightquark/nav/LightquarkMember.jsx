import ProfilePicture from "../../../ProfilePicture.jsx";
import styles from "./LightquarkMember.module.css";
import {useContext} from "react";
import {ClientContext} from "../../../../contexts/ClientContext.js";
import NiceModal from "@ebay/nice-modal-react";
import UserPopoutModal from "../modals/UserPopoutModal.jsx";

export function LightquarkMember({member}) {
    const {userCache} = useContext(ClientContext)
    return (
        <div className={styles.member} onClick={() => NiceModal.show(UserPopoutModal, {user: userCache[member._id]})}>
            <ProfilePicture src={userCache[member._id].avatarUri} px={40}/>
            <p className={styles.memberName}>
                {userCache[member._id].username}
                {userCache[member._id].status ? <p className={styles.memberStatus}>⮡ {userCache[member._id].status.type} <i>{userCache[member._id].status.primaryText}</i></p> : null}
            </p>
        </div>
    )
}