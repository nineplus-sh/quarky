import styles from "./BotTag.module.css"
import classnames from "classnames";

export default function BotTag({name, isDiscord}) {

    return <span className={classnames(styles.botTag, {[styles.discord]: isDiscord})}>
        {isDiscord ? "DISCORD" : "BOT"}
    </span>
}