import styles from "./UserSettingsPrideFlag.module.css";
import loginStyles from "../modals/LoginModal.module.css"
import {useTranslation} from "react-i18next";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import classnames from "classnames";
import SettingsRadio from "./SettingsRadio.jsx";

export default function UserSettingsPrideFlag() {
    const {t} = useTranslation();

    return <>
        <div className={styles.prideSwitcher}>
            <p>{t("SETTING_PRIDE_FLAG_DESC")}</p>
            <p style={{fontStyle: "italic", fontSize: "smaller"}}>{t("SETTING_PRIDE_FLAG_NOTE")}</p>

            {availableFlags.map(flag => <SettingsRadio key={flag} value={flag} setting={"PRIDE_FLAG"} text={t(`SETTING_PRIDE_FLAG_${flag.toUpperCase()}`)}
                    rightDecor={<div className={classnames(styles.pridePreviewLinear, `pride-${flag}`)}/>} leftDecor={<div className={styles.pridePreviewConic}>
                        <div className={classnames(styles.previewPrideRadialWrap, `pride-${flag}`)}>
                            <div className={classnames(loginStyles.prideRadial, styles.previewPrideRadial)}/>
                        </div>
                        <NyafileImage src={"img/loginheadervukky"} className={styles.previewPlanet}/>
                    </div>
            }/>)}
        </div>
    </>
}

export const availableFlags = [
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