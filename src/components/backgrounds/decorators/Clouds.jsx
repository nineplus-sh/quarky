import styles from "./Clouds.module.css";
import {AppContext} from "../../../contexts/AppContext.js";
import {useContext} from "react";
import classnames from "classnames";

export default function Clouds({primaryColor, secondaryColor, animate}) {
    const {nyafile} = useContext(AppContext);
    console.log(animate)

    return <div className={classnames(styles.clouds, {[styles.animate]: animate})} style={{'--primary-cloud-color': primaryColor, '--secondary-cloud-color': secondaryColor}}>
        <div className={styles.secondaryClouds} style={{maskImage: `url(${nyafile.getFileURL("img/cloud")})`}}/>
        <div className={styles.primaryClouds} style={{maskImage: `url(${nyafile.getFileURL("img/cloud")})`}}/>
    </div>
}