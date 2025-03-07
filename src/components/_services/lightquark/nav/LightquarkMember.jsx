import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import styles from "./LightquarkMember.module.css";
import {useContext} from "react";
import NiceModal from "@ebay/nice-modal-react";
import UserPopoutModal from "../modals/UserPopoutModal.jsx";
import {AppContext} from "../../../../contexts/AppContext.js";
import useUser from "../hooks/useUser.js";

export function LightquarkMember({id}) {
    const {isSuccess, data: member} = useUser(id);

    if (!isSuccess) return <div className={styles.member}>
        <span className={styles.memberName}>Loading...</span>
    </div>

    return (
        <div className={styles.member} onClick={() => NiceModal.show(UserPopoutModal, {user: member})}>
            <ProfilePicture src={member.avatarUri} px={40}/>
            <span className={styles.memberName}>
                {member.username}
                {member.status ? <span className={styles.memberStatus}>⮡ {member.status.type} <i>{member.status.primaryText}</i></span> : null}
            </span>
        </div>
    )
}