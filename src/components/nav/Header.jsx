import styles from "./Header.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import CreditsModal from "../modals/CreditsModal.jsx";
import {useState, useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useTranslation} from "react-i18next";

/**
 * The header of Quarky. This should not be used in the client itself.
 * @param {string} title
 * @param {string} description
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header({title, description}) {
    const [creditsModalOpen, setCreditsModalOpen] = useState(false);
    const appContext = useContext(AppContext);
    const {t} = useTranslation();

    function toggleModal() {
        setCreditsModalOpen(!creditsModalOpen);
        new Audio(appContext.nyafile.getCachedData(`sfx/info-modal-pop-${creditsModalOpen ? "out" : "in"}`)).play();
    }

    return (<>
        <div className={styles.header}>
            <NyafileImage className={styles.headerLogo} src={"img/quarkyheader"}/>
            <span className={styles.headerText}>
                <h1>{title}</h1>
                <p>⮡ {description}</p>
            </span>
            <button className={styles.headerAcknowledgements} onClick={toggleModal}>{t("CREDITS_BUTTON")}</button>
        </div>
        <div className={styles.headerShadow}></div>

        <CreditsModal open={creditsModalOpen} closer={toggleModal}/>
    </>);
}