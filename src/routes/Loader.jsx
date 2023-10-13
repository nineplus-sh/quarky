import styles from "./Loader.module.css"
import {version, author} from "../../package.json"

/**
 * The loading screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Loader() {
    return (<div className={styles.loaderWrap}>
        <div className={styles.loader}>
            <p className={styles.loaderText}>
                <span className={styles.loaderSymbol}>☯</span> Kitties are now preparing, please wait purringly.<br/>
                <small><small>Importing /quarky.nya<br/>Quarky {version} (c) {author}</small></small>
            </p>
        </div>
    </div>)
}