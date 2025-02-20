import styles from "./Message.module.css";
import * as linkify from "linkifyjs";
import RichEmbed, {badLinks} from "./RichEmbed.jsx";
import BotTag from "./BotTag.jsx";
import TimeAgo from "react-timeago"
import {useContext, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import ProfilePicture from "./ProfilePicture.jsx";
import dedupe from "../../util/dedupe.js";
import Button from "../nav/Button.jsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import useSettings from "../_services/lightquark/hooks/useSettings.js";

export default function Message({children, avatarUri, username, content, isBot, botName, isDiscord, timestamp, edited, attachments, replyTo, isContinuation, game, editFunction, deleteFunction, mutatorIsBusy, mutatorError}) {
    const {data: settings, isSuccess: settingsReady} = useSettings();
    const [isEditing, setEditing] = useState(false);
    const [editText, setEditText] = useState(content || "");

    async function checkEditKey(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            await editFunction(editText);
            setEditing(false);
        } else if (e.key === "Escape") {
            setEditing(false);
            setEditText(content || "");
        }
    }

    if(!settingsReady) return null;
    return (<div className={classnames(styles.messagewrapper, {[styles.messagefollowup]: isContinuation, [styles.messagediting]: isEditing})}>
        {isContinuation ? null : <ProfilePicture src={avatarUri} isMessage={!isEditing}/>}
        <span className={styles.message} tabIndex={0}>
            <span className={styles.usernameArea}>
                {isContinuation ? null : <><b>{username}</b>
                {isBot ? <BotTag name={botName} isDiscord={isDiscord} /> : ""}
                <TimeAgo className={styles.timestamp} date={timestamp} /></>}

                <span className={styles.interactions}>
                    {editFunction ? <Button disabled={mutatorIsBusy} onClick={() => setEditing(!isEditing)}>{isEditing ? "cancel" : "edit"}</Button> : null}
                    {editFunction && isEditing ? <Button onClick={() => checkEditKey({key: "Enter"})}>save</Button> : null}
                    {deleteFunction && !isEditing ? <Button disabled={mutatorIsBusy} onClick={deleteFunction}>delete</Button> : null}
                    {mutatorError ? "failed!!" : null}
                </span>
            </span>

            <span className={styles.messagecontent}>
                {isEditing ? <textarea autoFocus={true} value={editText} disabled={mutatorIsBusy} onKeyDown={(e) => checkEditKey(e)} onChange={(e ) => setEditText(e.target.value)}/> : <>
                    {edited ? <div className={styles.edited}>edited</div> : null}

                    <Markdown components={{p: "span"}} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {"target": "_blank", "rel": ["noreferrer", "noopener", "nofollow"]}]]}>
                        {settings["RICH_EMBEDS"] ? content.replaceAll(badLinks, "") : content}
                    </Markdown>

                    {settings["RICH_EMBEDS"] ? dedupe(linkify.find(content), "href").map(link => <RichEmbed key={link.href} url={link.href}/>) : null}
                    {attachments}
                    {game}
                </>}
            </span>
        </span>
    </div>)
}