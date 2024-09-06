import {useContext, useEffect, useState} from "react";
import LQ from "../../../../util/LQ.js";
import {useParams} from "react-router-dom";
import {LightquarkMember} from "./LightquarkMember.jsx";
import styles from "./LightquarkMemberList.module.css";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function LightquarkMemberList() {
    const [members, setMembers] = useState([])
    const {setUserCache} = useContext(AppContext)
    const {dialogId} = useParams();

    useEffect(() => {
        (async () => {
            let members = await LQ(`channel/${dialogId}/members`);
            members.response.users.forEach(member => {
                setUserCache(p => {
                    p[member._id] = member
                    return p;
                })
            })
            setMembers(members.response.users);
        })()
    }, [dialogId])

    return <>
        <p className={styles.memberHeader}>{members.length} members</p>
        {members
            .sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()))
            .map((member) => <LightquarkMember member={member} key={member._id} />)
        }
    </>
}