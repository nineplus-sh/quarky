import styles from "./LoginModal.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import SmoothResize from "../nav/SmoothResize.jsx";
import LightquarkLogin from "../_services/lightquark/modals/LightquarkLogin.jsx";
import {useRef} from "react";
import {CrossfadeContext, useCrossfadeTrigger} from "../../hooks/useCrossfade.js";
import Clouds from "../backgrounds/decorators/Clouds.jsx";

/**
 * The login modal of the authentication needed screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function LoginModal() {

    return <div className={styles.centerwrap}>
        <div className={styles.login}>
            <VukkyPlanet/>
            <div style={{height: "100%", margin: "0.5em", marginTop: "3em"}}>
                <LightquarkLogin/>
            </div>
        </div>
    </div>
}

function VukkyPlanet() {
    return <div style={{position: "absolute", width:"inherit", height:"inherit",pointerEvents: "none"}}>
        <Clouds primaryColor={"white"}/>
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
    </div>
}