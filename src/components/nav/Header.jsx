import styles from "./Header.module.css"
import NyafileImage from "../nyafile/NyafileImage.jsx";
import OSSModal from "../modals/OSSModal.jsx";
import {useState} from "react";

/**
 * The header of Quarky. This should not be used in the app itself, as no header is needed there.
 * @param {string} title - The title in the header.
 * @param {string} description - The description in the header.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header({title, description}) {
    const [ossModalOpen, setOssModalOpen] = useState(false);
    function toggleModal() {
        setOssModalOpen(!ossModalOpen);
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