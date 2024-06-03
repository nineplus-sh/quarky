import styles from "./LightquarkAttachments.module.css";

export default function LightquarkAttachments({attachments}) {
    return attachments.map((attachment) => {
        if(!attachment.type.startsWith("image/")) return;
        return <div className={styles.attachment}><img src={attachment.url}/></div>
    })
}