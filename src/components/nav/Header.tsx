import styles from "./Header.module.css"

export default function Header({title, description}: {title: string, description: string}) {
    return (
        <>
            <div className={styles.header}>
                <img className={styles.headerLogo} src={"/quarkyheader.svg"} alt={"A grayscale version of the Quarky logo."}/>
                <span className={styles.headerText}>
                <h1>{title}</h1>
                <p>⮡ {description}</p>
            </span>
            </div>
            <div className={styles.headerShadow}></div>
        </>
    );
}