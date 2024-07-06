import styles from "./Message.module.css";
import Linkify from "linkify-react";
import * as linkify from "linkifyjs";
import RichEmbed from "./RichEmbed.jsx";
import BotTag from "./BotTag.jsx";
import TimeAgo from "react-timeago";
import {SettingsContext} from "../../contexts/SettingsContext.js";
import {useContext} from "react";

export default function Message({children, avatar, username, content, isBot, botName, isDiscord, timestamp, edited, attachments}) {
    const {settings} = useContext(SettingsContext)

    return (<div className={styles.messagewrapper}>
        {avatar}
        <span className={styles.message}>
            <span className={styles.usernameArea}><b>{username}</b> {isBot ? <BotTag name={botName} isDiscord={isDiscord} /> : ""} <TimeAgo className={styles.timestamp} date={timestamp} /></span>
            <Linkify options={{"target": "_blank", "rel": "noreferrer noopener"}}>
                <span className={styles.messagecontent}>
                    {edited ? <div className={styles.edited}>edited</div> : null}
                    {children || content}
                    {settings["RICH_EMBEDS"] ? linkify.find(content).map(link => <RichEmbed url={link.value}/>) : null}
                    {attachments}
                </span>
            </Linkify>
        </span>
    </div>)
}