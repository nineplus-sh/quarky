import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import styles from "./LightquarkMember.module.css";
import {useContext} from "react";
import NiceModal from "@ebay/nice-modal-react";
import UserPopoutModal from "../modals/UserPopoutModal.jsx";
import {AppContext} from "../../../../contexts/AppContext.js";

export function LightquarkMember({member}) {
    return (
        <div className={styles.member} onClick={() => NiceModal.show(UserPopoutModal, {userId: member._id})}>
            <ProfilePicture src={member.avatarUri} px={40}/>
            <span className={styles.memberName}>
                {member.username}
                {member.status ? <span className={styles.memberStatus}>⮡ {member.status.type} <i>{member.status.primaryText}</i></span> : null}
            </span>
        </div>
    )
}