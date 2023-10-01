import styles from "./SpaceBackground.module.css"
import {AppContext} from "../../../contexts/AppContext.js";
import {useContext} from "react";

export default function SpaceBackground() {
    const appContext = useContext(AppContext);
    return (
        <h1>you like space don't you</h1>
        //<div className={styles.spaceBackground} style={{ "--stars-gif": appContext.nyafile.getCachedData("img/stars") }}></div>
    )
}