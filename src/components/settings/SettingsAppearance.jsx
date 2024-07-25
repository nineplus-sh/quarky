import styles from "./SettingsAppearance.module.css";
import loginStyles from "../modals/LoginModal.module.css"
import {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import classnames from "classnames";
import localForage from "localforage";
import {AppContext} from "../../contexts/AppContext.js";

export default function SettingsAppearance() {
    const {settings, setSettings} = useContext(AppContext);
    const {t} = useTranslation();

    async function transition(flag) {
        setSettings({...settings, "PRIDE_FLAG": flag});
        document.documentElement.classList.remove(...availableFlags.map(flag => `pride-${flag}`)); // TODO: Make less clunky
        document.documentElement.classList.add(`pride-${flag}`);

        const oldForage = await localForage.getItem("settings")
        await localForage.setItem("settings", {...oldForage, "PRIDE_FLAG": flag});
    }
    return <>
        <div className={styles.prideSwitcher}>
            <p>{t("SETTING_PRIDE_FLAG_DESC")}</p>
            <p style={{fontStyle: "italic", fontSize: "smaller"}}>{t("SETTING_PRIDE_FLAG_NOTE")}</p>
            <select value={settings["PRIDE_FLAG"]} onChange={e => transition(e.target.value)}>
                {availableFlags.map(flag => <option key={flag} value={flag}>{t(`SETTING_PRIDE_FLAG_${flag.toUpperCase()}`)}</option>)}
            </select>

            <div className={styles.pridePreviews}>

                <div className={styles.pridePreviewLinear}/>
                <div className={styles.pridePreviewConic}>
                    <div className={styles.previewPrideRadialWrap}>
                        <div className={classnames(loginStyles.prideRadial, styles.previewPrideRadial)}/>
                    </div>
                    <NyafileImage src={"img/loginheadervukky"} className={styles.previewPlanet}/>
                </div>
            </div>
        </div>
    </>
}

const availableFlags = [
    "agender",
    "aromantic",
    "asexual",
    "bisexual",
    "lesbian5",
    "lesbian7",
    "genderfluid",
    "nonbinary",
    "pansexual",
    "rainbow",
    "trans",
    "transfem",
    "transmasc"
]