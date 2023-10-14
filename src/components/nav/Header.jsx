import styles from "./Header.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import OSSModal from "../modals/OSSModal.jsx";
import {useState, useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";

/**
 * The header of Quarky. This should not be used in the client itself.
 * @param {string} title
 * @param {string} description
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header({title, description}) {
    const [ossModalOpen, setOssModalOpen] = useState(false);
    const appContext = useContext(AppContext)

    function toggleModal() {
        setOssModalOpen(!ossModalOpen);
        new Audio(appContext.nyafile.getCachedData(`sfx/info-modal-pop-${ossModalOpen ? "out" : "in"}`)).play();
    }

    return (<>
        <div className={styles.header}>
            <NyafileImage className={styles.headerLogo} src={"img/quarkyheader"}/>
            <span className={styles.headerText}>
                <h1>{title}</h1>
                <p>⮡ {description}</p>
            </span>
            <button className={styles.headerAcknowledgements} onClick={toggleModal}>Acknowledgements</button>
        </div>
        <div className={styles.headerShadow}></div>

        <OSSModal open={ossModalOpen} closer={toggleModal}/>
    </>);
}