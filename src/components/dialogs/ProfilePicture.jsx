import styles from "./ProfilePicture.module.css"
import {AppContext} from "../../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import classnames from "classnames";
import useSound from "../../hooks/useSound.js";

export default function ProfilePicture({src, px = 64, isMessage = false, doPurr = true, isPurring = false, ...props}) {
    const appContext = useContext(AppContext);
    const purr = useSound("sfx/purr", {looping: true})

    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        isHovered && doPurr ? purr?.play() : purr?.stop();
        return () => purr?.stop();
    }, [isHovered]);

    return <img {...props} src={`${src}${!src.startsWith("blob") ? `?size=${px}` : ""}`} width={px} height={px} className={classnames(props.className, styles.pfp, {[styles.petting]: (doPurr && isHovered) || isPurring, [styles.message]: isMessage})} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}/>
}
