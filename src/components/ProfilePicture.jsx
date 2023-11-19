import styles from "./ProfilePicture.module.css"
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import classnames from "classnames";
export default function ProfilePicture({src}) {
    const appContext = useContext(AppContext)
    const [purr] = useState(new Audio(appContext.nyafile.getCachedData("sfx/purr")))
    purr.loop = true;

    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        isHovered ? purr?.play() : purr?.pause();
    }, [isHovered]);

    return <img src={src} className={classnames(styles.pfp, {[styles.petting]: isHovered})} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}/>
}