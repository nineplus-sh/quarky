import {useEffect, useState} from "react";
import LQ from "../../../../util/LQ.js";
import {useParams} from "react-router-dom";
import {LightquarkMember} from "./LightquarkMember.jsx";
import styles from "./LightquarkMemberList.module.css";

export default function LightquarkMemberList() {
    const [members, setMembers] = useState([])
    const {dialogId} = useParams();

    useEffect(() => {
        (async () => {
            setMembers((await LQ(`channel/${dialogId}/members`)).response.users)
        })()
    }, [dialogId])

    return <>
        <p className={styles.memberHeader}>Members</p>
        {members.map((member) => <LightquarkMember member={member} key={member._id} />)}
    </>
}