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

export default function Message({children, avatarUri, username, content, isBot, botName, isDiscord, timestamp, edited, attachments, replyTo, isContinuation, game, editFunction, deleteFunction}) {
    const {settings} = useContext(AppContext)
    const [isEditing, setEditing] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [editText, setEditText] = useState(content);

    async function checkEditKey(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            setSaving(true);
            await editFunction(editText);
            setSaving(false); setEditing(false);
        } else if (e.key === "Escape") {
            setEditing(false);
            setEditText(content);
        }
    }

    return (<div className={classnames(styles.messagewrapper, {[styles.messagefollowup]: isContinuation, [styles.messagediting]: isEditing})}>
        {isContinuation ? null : <ProfilePicture src={avatarUri} isMessage={!isEditing}/>}
        <span className={styles.message}>
            {isContinuation ? null : <span className={styles.usernameArea}>
                <b>{username}</b>
                {isBot ? <BotTag name={botName} isDiscord={isDiscord} /> : ""}
                <TimeAgo className={styles.timestamp} date={timestamp} />

                <span className={styles.interactions}>
                    {editFunction ? <button disabled={isDeleting || isEditing} onClick={() => setEditing(true)}>edit</button> : null}
                    {deleteFunction ? <button disabled={isDeleting} onClick={() => {
                        setDeleting(true);
                        deleteFunction();
                    }}>delete</button> : null}
                </span>
            </span>}

            <span className={styles.messagecontent} onDoubleClick={() => {if(editFunction){setEditing(true)}}}>
                {isEditing ? <textarea autoFocus={true} value={editText} disabled={isSaving} onKeyDown={(e) => checkEditKey(e)} onChange={(e ) => setEditText(e.target.value)}/> : <>
                    {edited ? <div className={styles.edited}>edited</div> : null}

                    {settings["RICH_EMBEDS"] ? content.replaceAll(badLinks, "") : content}

                    {settings["RICH_EMBEDS"] ? dedupe(linkify.find(content), "href").map(link => <RichEmbed key={link.href} url={link.href}/>) : null}
                    {attachments}
                    {game}
                </>}
            </span>
        </span>
    </div>)
}