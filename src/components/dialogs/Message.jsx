import styles from "./Message.module.css";
import Linkify from "linkify-react";
import * as linkify from "linkifyjs";
import RichEmbed from "./RichEmbed.jsx";

export default function Message({children, avatar, username, content}) {
    return (<div className={styles.messagewrapper}>
        {avatar}
        <span className={styles.message}>
            <b>{username}</b>
            <Linkify options={{"target": "_blank", "rel": "noreferrer"}}>
                <span className={styles.messagecontent}>{children}</span>
            </Linkify>

            {linkify.find(content).map(link => <RichEmbed url={link.value}/>)}
        </span>
    </div>)
}