import styles from "./LightquarkAttachments.module.css";

export default function LightquarkAttachments({attachments}) {
    return attachments?.map((attachment) => {
        if(attachment.type.startsWith("image/")) return <div key={attachment.url} className={styles.attachment}><img src={attachment.url} className={styles.html5Attachment}/></div>
        if(attachment.type.startsWith("video/")) return <div key={attachment.url} className={styles.attachment}><video controls src={attachment.url} className={styles.html5Attachment}/></div>
    })
}