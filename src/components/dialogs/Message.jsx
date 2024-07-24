import styles from "./Message.module.css";
import * as linkify from "linkifyjs";
import RichEmbed from "./RichEmbed.jsx";
import BotTag from "./BotTag.jsx";
import TimeAgo from "react-timeago";
import {SettingsContext} from "../../contexts/SettingsContext.js";
import {useContext} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import classnames from "classnames";

export default function Message({children, avatar, username, content, isBot, botName, isDiscord, timestamp, edited, attachments, replyTo, isContinuation}) {
    const {settings} = useContext(SettingsContext)

    return (<div className={classnames(styles.messagewrapper, {[styles.messagefollowup]: isContinuation})}>
        {isContinuation ? null : avatar}
        <span className={styles.message}>
            {isContinuation ? null : <span className={styles.usernameArea}><b>{username}</b> {isBot ? <BotTag name={botName} isDiscord={isDiscord} /> : ""} <TimeAgo className={styles.timestamp} date={timestamp} /></span>}

            <span className={styles.messagecontent}>
                {edited ? <div className={styles.edited}>edited</div> : null}
                <Markdown components={{p: "span"}} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {"target": "_blank", "rel": ["noreferrer", "noopener", "nofollow"]}]]}>
                    {content}
                </Markdown>
                {settings["RICH_EMBEDS"] ? linkify.find(content).map(link => <RichEmbed url={link.value}/>) : null}
                {attachments}
            </span>
        </span>
    </div>)
}