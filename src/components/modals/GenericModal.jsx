import Modal from 'react-modal';
import {useContext, useEffect, useRef} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import styles from "./GenericModal.module.css"
import classnames from "classnames";
import Button from "../nav/Button.jsx";

/**
 * A generic wrapper around react-modal. Depending on your needs, there might be a more specific wrapper around this one.
 * @returns {JSX.Element}
 * @constructor
 */
export default function GenericModal({classNames = "", overlayClassNames = "", children, modal, allowNonEventClose = true}) {
    const appContext = useContext(AppContext);
    const firstUpdate = useRef(true)

    useEffect(() => {
        if (firstUpdate.current) { firstUpdate.current = false; return; }

        new Audio(appContext.nyafile.getFileURL(`sfx/info-modal-pop-${modal.visible ? "in" : "out"}`)).play();
        if(!modal.visible) setTimeout(modal.remove, 300)
    }, [modal.visible]);

    return (
        <Modal className={classnames(styles.genericModalContent, classNames)} overlayClassName={classnames(styles.genericModalOverlay, overlayClassNames)} appElement={document.querySelector("#root")} isOpen={modal.visible} closeTimeoutMS={300} shouldCloseOnOverlayClick={allowNonEventClose} onRequestClose={allowNonEventClose ? () => modal.hide() : null}>
            {allowNonEventClose ? <Button className={styles.closeButton} onClick={() => modal.hide()}>Close</Button> : null}
            {children}
        </Modal>
    )
}