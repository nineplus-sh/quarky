import styles from "./Button.module.css";
import classnames from "classnames";

export default function Button({children, className, puffy, primary, destructive, ...props}) {
    return <button type="button" {...props} className={classnames(styles.prettyButton, {[styles.puffy]: puffy, [styles.primary]: primary, [styles.destructive]: destructive}, className)}>
        {children}
    </button>;
}