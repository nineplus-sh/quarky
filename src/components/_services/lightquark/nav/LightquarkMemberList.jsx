import {LightquarkMember} from "./LightquarkMember.jsx";
import styles from "./LightquarkMemberList.module.css";
import {useQueryClient} from "@tanstack/react-query";

export default function LightquarkMemberList({members}) {
    const queryClient = useQueryClient();
    return <>
        <p className={styles.memberHeader}>{members.length} members</p>
        {members
            .sort((a,b) => queryClient.getQueryData(["user",a]).username.localeCompare(queryClient.getQueryData(["user",b]).username))
            .map((member) => <LightquarkMember id={member} key={member} />)
        }
    </>
}