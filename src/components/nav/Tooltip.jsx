import styles from "./Tooltip.module.css";

export default function Tooltip({floatRef, floatStyles, floatProps, children}) {
    return <div className={styles.tooltipWrap} ref={floatRef} style={floatStyles} {...floatProps}>
        <div className={styles.tooltip}>
            <span className={styles.tooltipText}>{children}</span>
        </div>
    </div>
}