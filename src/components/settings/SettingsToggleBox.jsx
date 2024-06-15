import {Trans, useTranslation} from "react-i18next";
import SettingsToggle from "./SettingsToggle.jsx";
import styles from "./SettingsToggleBox.module.css";

export default function SettingsToggleBox({setting, description = true, trans}) {
    const {t} = useTranslation();

    return <div className={styles.toggleBox}>
        <div className={styles.toggleBoxText}>
            <p className={styles.toggleBoxTitle}>{t(`SETTING_${setting}`)}</p>
            {description ? <p className={styles.toggleBoxDescription}>
                {trans ? <Trans i18nKey={`SETTING_${setting}_DESC`} components={trans}/> : t(`SETTING_${setting}_DESC`)}</p>
            : null}
        </div>
        <div className={styles.toggleBoxToggle}>
            <SettingsToggle setting={setting}/>
        </div>
    </div>
}