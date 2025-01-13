import styles from "./Header.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import CreditsModal from "../modals/CreditsModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal from "@ebay/nice-modal-react";
import Button from "./Button.jsx";

/**
 * The header of Quarky. This should not be used in the client itself.
 * @param {string} title
 * @param {string} description
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header({title, description}) {
    const {t} = useTranslation();

    return (<>
        <div className={styles.header}>
            <NyafileImage className={styles.headerLogo} src={"img/quarkyheader"}/>
            <span className={styles.headerText}>
                <h1>{title}</h1>
                <p>⤷ {description}</p>
            </span>
            <Button className={styles.headerAcknowledgements} onClick={() => NiceModal.show(CreditsModal)}>{t("CREDITS_BUTTON")}</Button>
        </div>
        <div className={styles.headerShadow}></div>
    </>);
}