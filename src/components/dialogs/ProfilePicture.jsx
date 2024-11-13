import styles from "./ProfilePicture.module.css"
import {AppContext} from "../../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import classnames from "classnames";

export default function ProfilePicture({src, px = 64, isMessage = false, doPurr = true}) {
    const appContext = useContext(AppContext)

    const [purr] = useState(doPurr ? new Audio(appContext.nyafile.getCachedData("sfx/purr")) : null)
    if(purr) purr.loop = true;

    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        isHovered && doPurr ? purr?.play() : purr?.pause();
        return () => purr?.pause();
    }, [isHovered]);

    return <img src={`${src}?size=${px}`} width={px} height={px} className={classnames(styles.pfp, {[styles.petting]: doPurr && isHovered, [styles.message]: isMessage})} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}/>
}
