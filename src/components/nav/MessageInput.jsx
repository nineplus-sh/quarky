import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import LQ from "../../util/LQ.js";
import styles from "./MessageInput.module.css"
import {autoUpdate, useClick, useFloating, useInteractions} from "@floating-ui/react";
import GIFPicker from "../modals/GIFPicker.jsx";
import NiceModal from "@ebay/nice-modal-react";
import {AppContext} from "../../contexts/AppContext.js";

export default function MessageInput() {
    let { dialogId } = useParams();
    let [message, setMessage] = useState("");
    const {settings, saveSettings} = useContext(AppContext);
    const [typingTimeout, setTypingTimeout] = useState(null);

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

    useEffect(() => {
        if (settings.DRAFTS[dialogId]) setMessage(settings.DRAFTS[dialogId].content);
    }, [dialogId, settings.DRAFTS]);
    useEffect(() => {
        if (!settings.DRAFTS[dialogId]) setMessage("");
    }, [dialogId]);
    useEffect(() => {
        if(typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => {
            if(message === settings.DRAFTS[dialogId]?.content) return;
            saveSettings({
                DRAFTS: {
                    ...settings.DRAFTS,
                    [dialogId]: message === "" ? undefined : {
                        content: message
                    }
                }
            })
        }, 5000));
    }, [message]);

    return (<form className={styles.messageForm} onSubmit={async (e) => {
        e.preventDefault();
        let wantedMessage = message;
        setMessage("");

        const formData = new FormData();
        formData.append("payload", JSON.stringify({content: wantedMessage}));

        await LQ(`channel/${dialogId}/messages`, "POST", formData)
        setMessage("")
        saveSettings({
            DRAFTS: {
                ...settings.DRAFTS,
                [dialogId]: undefined
            }
        })
    }}>
        <button type="button" disabled>Games</button>
        <input type={"text"} value={message} onInput={(e) => setMessage(e.target.value)} className={styles.messageBox} />
        <button type="button" ref={gifFloat.refs.setReference} {...gifInteractions.getReferenceProps()}>GIFs</button>

        {gifOpen ? <GIFPicker floatRef={gifFloat.refs.setFloating} floatStyles={gifFloat.floatingStyles} floatProps={gifInteractions.getFloatingProps()} setOpen={setGifOpen}/> : null}
    </form>)
}