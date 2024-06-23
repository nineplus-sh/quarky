import ProfilePicture from "../../../ProfilePicture.jsx";
import styles from "./LightquarkMember.module.css";
import {useContext} from "react";
import NiceModal from "@ebay/nice-modal-react";
import UserPopoutModal from "../modals/UserPopoutModal.jsx";
import {AppContext} from "../../../../contexts/AppContext.js";

export function LightquarkMember({member}) {
    const {userCache} = useContext(AppContext)
    
    return (
        <div className={styles.member} onClick={() => NiceModal.show(UserPopoutModal, {userId: member._id})}>
            <ProfilePicture src={userCache[member._id].avatarUri} px={40}/>
            <span className={styles.memberName}>
                {userCache[member._id].username}
                {userCache[member._id].status ? <span className={styles.memberStatus}>⮡ {userCache[member._id].status.type} <i>{userCache[member._id].status.primaryText}</i></span> : null}
            </span>
        </div>
    )
}