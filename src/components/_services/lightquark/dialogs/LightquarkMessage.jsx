import styles from "./LightquarkMessage.module.css"

export default function LightquarkMessage({message}) {
    const botMetadata = message.message.specialAttributes.find(attr => attr.type === "botMessage");

    return (<div className={styles.message}>
        <img src={botMetadata?.avatarUri || message.author.avatarUri} width={64} />
        <span className={styles.content}> <b>{botMetadata?.username || message.author.username} <i>{message.message.ua}</i></b><br/>{message.message.content}</span>
    </div>)
}