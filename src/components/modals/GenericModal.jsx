import Modal from 'react-modal'
import "./GenericModal.css"

/**
 * A generic wrapper around react-modal. Depending on your needs, there might be a more specific wrapper around this one.
 * @param children - The props of the component, provided by React.
 * @param open {boolean} - If the modal should be shown or not.
 * @param closer {function} - The function to run when the modal should be closed. Usually a useState setter higher in the component tree.
 * @returns {JSX.Element}
 * @constructor
 */
export default function GenericModal({children, open, closer}) {
    return (
        <Modal isOpen={open} closeTimeoutMS={300} shouldCloseOnOverlayClick={true} onRequestClose={closer} style={{
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