import {LightquarkMember} from "./LightquarkMember.jsx";
import styles from "./LightquarkMemberList.module.css";

export default function LightquarkMemberList({members}) {
    return <>
        <p className={styles.memberHeader}>{members.length} members</p>
        {members
            .sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()))
            .map((member) => <LightquarkMember member={member} key={member._id} />)
        }
    </>
}