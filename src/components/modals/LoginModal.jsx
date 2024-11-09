import LightquarkLogin from "../_services/lightquark/modals/LightquarkLogin.jsx";
import styles from "./LoginModal.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import useResizeObserver from "../../util/useResizeObserver.js";

/**
 * The login modal of the authentication needed screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function LoginModal() {
    const [size, boxRef] = useResizeObserver();
    return <div className={styles.centerwrap}>
        <div className={styles.login} style={{...size}}>
            <div className={styles.characterContainer}>
                <NyafileImage src={"img/loginheadervukky"} className={styles.planet}/>
                <div className={styles.prideRadial}/>

                <div className={styles.orbs}>
                    <span className={styles.orbwrap}><img src={"https://logo.litdevs.org/api/vukky/bg"}
                                                          className={styles.orb}/></span>
                    <span className={styles.orbwrap}><NyafileImage src={"img/orb_2"} className={styles.orb}/></span>
                    <span className={styles.orbwrap}><NyafileImage src={"img/orb_3"} className={styles.orb}/></span>
                    <span className={styles.orbwrap}><NyafileImage src={"img/orb_4"} className={styles.orb}/></span>
                    <span className={styles.orbwrap}><NyafileImage src={"img/orb_5"} className={styles.orb}/></span>
                </div>
            </div>
            <div ref={boxRef} style={{width: "fit-content", position: "absolute", maxWidth: "25em"}}>
                <LightquarkLogin crossfade={async () => {
                    if (boxRef.current) {
                        await boxRef.current.animate([{opacity: 1},{opacity:0}], {duration: 200, easing: "ease", fill: "forwards"}).finished;
                        setTimeout(function() {
                            boxRef.current.style.visibility = "visible";
                            boxRef.current.animate([{opacity: 0},{opacity:1}], {duration: 200, easing: "ease", fill: "forwards"})
                        }, 300)
                    }
                }}/>
            </div>
        </div>
    </div>
}