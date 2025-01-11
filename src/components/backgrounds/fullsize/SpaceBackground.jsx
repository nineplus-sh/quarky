import styles from "./SpaceBackground.module.css"
import {AppContext} from "../../../contexts/AppContext.js";
import {useContext} from "react";

/**
 * A full size space background to be used in the loading screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function SpaceBackground() {
    const appContext = useContext(AppContext);
    return (
        <div className={styles.spaceBackground} style={{ background: `url(${appContext.nyafile.getFileURL("img/stars")})` }}></div>
    )
}