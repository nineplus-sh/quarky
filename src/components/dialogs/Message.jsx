import styles from "./Message.module.css";
import Linkify from "linkify-react";
import * as linkify from "linkifyjs";
import RichEmbed from "./RichEmbed.jsx";
import BotTag from "./BotTag.jsx";
import TimeAgo from "react-timeago";

export default function Message({children, avatar, username, content, isBot, botName, isDiscord, timestamp}) {
    return (<div className={styles.messagewrapper}>
        {avatar}
        <span className={styles.message}>
            <span className={styles.usernameArea}><b>{username}</b> {isBot ? <BotTag name={botName} isDiscord={isDiscord} /> : ""} <TimeAgo className={styles.timestamp} date={timestamp} /></span>
            <Linkify options={{"target": "_blank", "rel": "noreferrer noopener"}}>
                <span className={styles.messagecontent}>{children} {linkify.find(content).map(link => <RichEmbed url={link.value}/>)}</span>
            </Linkify>
        </span>
    </div>)
}