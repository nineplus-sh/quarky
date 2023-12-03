import styles from "./LightquarkMessage.module.css"

export default function LightquarkMessage({message}) {
    console.log(message)
    return (<div className={styles.message}>
        <img src={message.author.avatarUri} width={64} />
        <span className={styles.content}> <b>{message.author.username}</b><br/>{message.message.content}</span>
    </div>)
}