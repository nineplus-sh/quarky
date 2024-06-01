import styles from "./Message.module.css";
import Linkify from "linkify-react";
import * as linkify from "linkifyjs";
import RichEmbed from "./RichEmbed.jsx";
import BotTag from "./BotTag.jsx";

export default function Message({children, avatar, username, content, botName, isDiscord}) {
    return (<div className={styles.messagewrapper}>
        {avatar}
        <span className={styles.message}>
            <b>{username} {botName ? <BotTag name={botName} isDiscord={isDiscord} /> : ""}</b>
            <Linkify options={{"target": "_blank", "rel": "noreferrer noopener"}}>
                <span className={styles.messagecontent}>{children} {linkify.find(content).map(link => <RichEmbed url={link.value}/>)}</span>
            </Linkify>
        </span>
    </div>)
}