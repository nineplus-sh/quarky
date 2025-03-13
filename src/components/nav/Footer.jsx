import styles from "./Footer.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import CreditsModal from "../modals/CreditsModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal from "@ebay/nice-modal-react";
import Button from "./Button.jsx";
import {AppContext} from "../../contexts/AppContext.js";
import {useContext} from "react";
import Clouds from "../backgrounds/decorators/Clouds.jsx";

/**
 * The footer in the login page.
 * @param {string} title
 * @param {string} description
 * @returns {JSX.Element}
 * @constructor
 */
export default function Footer({title, description}) {
    const {t} = useTranslation();
    const {nyafile} = useContext(AppContext);

    return (<div className={styles.footerShift}>
        <Clouds animate primaryColor={"var(--accent-color)"} secondaryColor={"var(--darker-accent-color)"}/>
        <div className={styles.headerWrap}>
            <div className={styles.headerContent}>
                <NyafileImage className={styles.headerLogo} src={"img/quarkymark"}/>
                <Button className={styles.headerAcknowledgements} onClick={() => NiceModal.show(CreditsModal)}>{t("CREDITS_BUTTON")}</Button>
                <span className={styles.headerText}>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </span>
            </div>
        </div>
    </div>);
}