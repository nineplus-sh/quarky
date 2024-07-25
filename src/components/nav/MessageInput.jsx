import {useParams} from "react-router-dom";
import {useState} from "react";
import LQ from "../../util/LQ.js";
import styles from "./MessageInput.module.css"
import {autoUpdate, useClick, useFloating, useInteractions} from "@floating-ui/react";
import GIFPicker from "../modals/GIFPicker.jsx";
import NiceModal from "@ebay/nice-modal-react";

export default function MessageInput() {
    let { dialogId } = useParams();
    let [message, setMessage] = useState("");

    const [gifOpen, setGifOpen] = useState(false);
    const gifFloat = useFloating({
        placement: "top-end",
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        open: gifOpen,
        onOpenChange: setGifOpen
    });
    const gifClick = useClick(gifFloat.context);
    const gifInteractions = useInteractions([gifClick]);

    return (<form className={styles.messageForm} onSubmit={async (e) => {
        e.preventDefault();
        let wantedMessage = message;
        setMessage("");

        const formData = new FormData();
        formData.append("payload", JSON.stringify({content: wantedMessage}));

        await LQ(`channel/${dialogId}/messages`, "POST", formData)
        setMessage("")
    }}>
        <button type="button" disabled>Games</button>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} className={styles.messageBox} />
        <button type="button" ref={gifFloat.refs.setReference} {...gifInteractions.getReferenceProps()}>GIFs</button>

        {gifOpen ? <GIFPicker floatRef={gifFloat.refs.setFloating} floatStyles={gifFloat.floatingStyles} floatProps={gifInteractions.getFloatingProps()} setOpen={setGifOpen}/> : null}
    </form>)
}