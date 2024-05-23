import ProfilePicture from "../../../ProfilePicture.jsx";
import styles from "./LightquarkMember.module.css";

export function LightquarkMember({member}) {
    return (
        <div className={styles.member}>
            <ProfilePicture src={member.avatarUri} px={40}/>
            <p className={styles.memberName}>
                {member.username}
                {member.status ? <p className={styles.memberStatus}>⮡ {member.status.type} <i>{member.status.primaryText}</i></p> : null}
            </p>
        </div>
    )
}