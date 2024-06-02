import Modal from 'react-modal'
import "./GenericModal.css"
import {useContext, useEffect, useRef} from "react";
import {AppContext} from "../../contexts/AppContext.js";

/**
 * A generic wrapper around react-modal. Depending on your needs, there might be a more specific wrapper around this one.
 * @returns {JSX.Element}
 * @constructor
 */
export default function GenericModal({children, modal, allowNonEventClose = true}) {
    const appContext = useContext(AppContext);
    const firstUpdate = useRef(true)

    useEffect(() => {
        if (firstUpdate.current) { firstUpdate.current = false; return; }

        new Audio(appContext.nyafile.getCachedData(`sfx/info-modal-pop-${modal.visible ? "in" : "out"}`)).play();
        if(!modal.visible) setTimeout(modal.remove, 300)
    }, [modal.visible]);

    return (
        <Modal appElement={document.querySelector("#root")} isOpen={modal.visible} closeTimeoutMS={300} shouldCloseOnOverlayClick={allowNonEventClose} onRequestClose={() => modal.hide()} style={{
            overlay: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 168, 243, 0.5)"
            },
            content: {
                maxWidth: "25%",
                inset: "unset",
                borderRadius: "15px"
            }
        }}>
            {children}
        </Modal>
    )
}