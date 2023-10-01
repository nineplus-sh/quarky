import styles from "./Header.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";

export default function Header({title, description}) {
    return (
        <>
            <div className={styles.header}>
                <NyafileImage className={styles.headerLogo} src={"img/quarkyheader"}/>
                <span className={styles.headerText}>
                <h1>{title}</h1>
                <p>⮡ {description}</p>
            </span>
            </div>
            <div className={styles.headerShadow}></div>
        </>
    );
}