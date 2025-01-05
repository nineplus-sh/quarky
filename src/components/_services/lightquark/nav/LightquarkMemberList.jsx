import {LightquarkMember} from "./LightquarkMember.jsx";
import styles from "./LightquarkMemberList.module.css";

export default function LightquarkMemberList({members}) {
    return <>
        <p className={styles.memberHeader}>{members.length} members</p>
        {members.map((member) => <LightquarkMember id={member} key={member} />)}
    </>
}