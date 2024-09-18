import styles from "./Loader.module.css"
import {version, author} from "../../package.json"
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useRef, useState, useLayoutEffect} from "react";
import {AppContext} from "../contexts/AppContext.js";
import NyafileImage from "../components/nyafile/NyafileImage.jsx";
import classnames from "classnames";

/**
 * The loading screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Loader({loadingString, progress, progressString, crossfade}) {
    const { t } = useTranslation();
    const { holiday } = useContext(AppContext);
    const [pippiDiedBigSadFrownyFace, setPippiDiedBigSadFrownyFace] = useState(false);
    const [stabbed, setStabbed] = useState(false);
    const [splats, setSplats] = useState([]);
    const quarkyLogo = useRef(null);
    const [HP, setHP] = useState(10);

    function eyeMover(event) {
        if(!quarkyLogo.current) return;
        const eyeLayer = quarkyLogo.current.contentDocument.querySelector("#eyelayer")
        if(!eyeLayer) return;

        const rect = quarkyLogo.current.getBoundingClientRect();
        const rectX = rect.left + (rect.width / 2);
        const rectY = rect.top + (rect.height / 2);
        const calcX = (event.clientX - rectX) / 80;
        const calcY = (event.clientY - rectY) / 80;

        eyeLayer.style.transform = `
            translateX(${Math.max(-7, Math.min(7, calcX))}px) 
            translateY(${Math.max(-5, Math.min(5, calcY))}px)
        `
    }
    function owie(event) {
        if(HP > 0) {
            setHP(HP => HP - 1)
            if(HP === 1) new Audio("/explode.mp3").play();
        } else {
            return;
        }

        const splatID = Date.now();
        setSplats(oldSplats => [...oldSplats,{seed: splatID, clientX: event.clientX, clientY: event.clientY}] );
        setTimeout(() => setSplats(oldSplats => oldSplats.filter(splat => splat.seed !== splatID)), 1000)

        setStabbed(false);
        setTimeout(() => setStabbed(true), 10);
    }
    useEffect(() => {
        document.addEventListener("mousemove", eyeMover);
        return () => document.removeEventListener("mousemove", eyeMover);
    }, []);

    return (<><div className={styles.hitsplats}>{splats.map(splat => <Hitsplat data={splat} key={splat.seed}/>)}</div>
        <div id="superpreload" className={classnames({[styles.crossfade]: crossfade})}>
            <div id="preloadwrap">
            <div className={classnames(styles.logoEffectWrap, {[styles.stabbed]: stabbed && HP > 0})} onClick={owie}>
                {HP === 0 ? <img src={"/explode.gif"} height={160} id="preloadlogo"/> : <object data={"/quarky.svg"} id="preloadlogo" ref={quarkyLogo}/>}
            </div>

                {loadingString ? <span id="preloadtext">
            {t(loadingString)}
                <br/>
            <i>{t(`${holiday}_LINK`) !== `${holiday}_LINK` ?
                <a target={"_blank"} rel={"noreferrer noopener"} href={t(`${holiday}_LINK`)}>{t(holiday)}</a>
                : t(holiday)}</i>
                {progress ? <><br/>
                    <div
                        className={classnames(styles.loadingBarWrapper, {[styles.pippiless]: pippiDiedBigSadFrownyFace})}>
                        <img className={styles.loadingBarImage} style={{left: `${progress}%`}}
                             src={"/loading.gif"}/>

                        <div className={styles.loadingBar} onMouseOver={() => {
                            if(pippiDiedBigSadFrownyFace) return;
                            setPippiDiedBigSadFrownyFace(true)
                            new Audio("/fall.mp3").play()
                        }}>
                            <div className={styles.loadingBarStretcher} style={{width: `${progress}%`}}></div>
                        </div>

                        <div className={styles.loadingBarText}>
                            {progressString}
                        </div>
                    </div>
                </> : null}
            </span> : null}
        </div></div></>)
}

export function Hitsplat({data}) {
    return <img className={styles.hitsplat} style={{
        position: "fixed",
        left: data.clientX,
        top: data.clientY
    }} src="/hitsplat.png"/>
}