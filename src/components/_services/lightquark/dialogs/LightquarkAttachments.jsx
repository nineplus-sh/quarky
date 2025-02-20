import styles from "./LightquarkAttachments.module.css";

export default function LightquarkAttachments({attachments}) {
    return attachments?.map((attachment) => {
        if(attachment.type.startsWith("image/")) return <div key={attachment.url} className={styles.attachment}><img src={attachment.url} height={attachment.height > 0 ? attachment.height : "auto"} width={attachment.width > 0 ? attachment.width : "auto"} className={styles.html5Attachment}/></div>
        if(attachment.type.startsWith("video/")) return <div key={attachment.url} className={styles.attachment}><video controls src={attachment.url} height={attachment.height > 0 ? attachment.height : undefined} width={attachment.width > 0 ? attachment.width : "auto"} className={styles.html5Attachment}/></div>
    })
}