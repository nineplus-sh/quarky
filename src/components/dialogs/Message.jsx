import styles from "./Message.module.css";
import Linkify from "linkify-react";
import * as linkify from "linkifyjs";
import RichEmbed from "./RichEmbed.jsx";

export default function Message({children, avatar, username, content}) {
    return (<div className={styles.message}>
        {avatar}
        <span className={styles.content}>
            <b>{username}</b><br/>
            <Linkify options={{"target": "_blank", "rel": "noreferrer"}}>
                {children}
            </Linkify>

            {linkify.find(content).map(link => <RichEmbed url={link.value}/>)}
        </span>
    </div>)
}