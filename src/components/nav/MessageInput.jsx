import {useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import LQ from "../../util/LQ.js";
import styles from "./MessageInput.module.css"
import {autoUpdate, useClick, useFloating, useInteractions, useListNavigation} from "@floating-ui/react";
import GIFPicker from "../modals/GIFPicker.jsx";
import {AppContext} from "../../contexts/AppContext.js";
import NiceModal from "@ebay/nice-modal-react";
import GameLaunchModal from "../modals/GameLaunchModal.jsx";
import mergeRefs from "merge-refs";
import LightquarkEmoteSearch from "../_services/lightquark/dialogs/LightquarkEmoteSearch.jsx";

export default function MessageInput() {
    let { quarkId, dialogId } = useParams();
    let [message, setMessage] = useState("");
    const {settings, saveSettings, nyafile} = useContext(AppContext);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isSending, setSending] = useState(false);
    const messageBox = useRef(null);

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
    const [emoteSearchOpen, setEmoteSearchOpen] = useState(false);
    const emoteSearchFloat = useFloating({
        placement: "top-start",
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        open: emoteSearchOpen,
        onOpenChange: setEmoteSearchOpen
    });
    const emoteSearchListRef = useRef([]);
    const emoteSearchVirtRef = useRef(null);
    const [emoteSearchActiveIndex, setEmoteSearchActiveIndex] = useState(null);
    const emoteSearchNavigation = useListNavigation(emoteSearchFloat.context, {
        listRef: emoteSearchListRef,
        virtualItemRef: emoteSearchVirtRef,
        activeIndex: emoteSearchActiveIndex,
        onNavigate: setEmoteSearchActiveIndex,
        virtual: true,
        focusItemOnOpen: true,
        loop: true
    })
    const oldKeyDown = emoteSearchNavigation.reference.onKeyDown;
    emoteSearchNavigation.reference.onKeyDown = function(event) {
        if(event.key === "ArrowUp") {
            event.key = "ArrowDown";
        } else if (event.key === "ArrowDown") {
            event.key = "ArrowUp";
        }
        oldKeyDown(event);
    }
    const emoteSearchInteractions = useInteractions([emoteSearchNavigation]);

    function keysmashOutsideHandler(event) {
        if(document.activeElement?.tagName.toLowerCase() === "input") return;
        if(document.activeElement?.tagName.toLowerCase() === "textarea") return;
        if(event.key === "Tab") return;
        messageBox.current?.focus();
    }
    useEffect(() => {
        document.addEventListener("keydown", keysmashOutsideHandler);
        return () => document.removeEventListener('keydown', keysmashOutsideHandler);
    }, []);
    useEffect(() => {
        if (settings.DRAFTS[dialogId] && message === "") setMessage(settings.DRAFTS[dialogId].content);
    }, [dialogId, settings.DRAFTS]);
    useEffect(() => {
        if (!settings.DRAFTS[dialogId]) setMessage("");
    }, [dialogId]);
    useEffect(() => {
        /*if(typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => {
            if(message === settings.DRAFTS[dialogId]?.content) return;
            if(message === "" && !settings.DRAFTS[dialogId]) return;
            saveSettings({
                DRAFTS: {
                    ...settings.DRAFTS,
                    [dialogId]: message === "" ? undefined : {
                        content: message
                    }
                }
            })
        }, 5000));*/

        setEmoteSearchOpen(/:\w{2,}$/.test(message));
    }, [message]);

    return (<form className={styles.messageForm} onSubmit={async (e) => {
        e.preventDefault();
        if(emoteSearchOpen) return;

        setSending(true);
        let wantedMessage = message;
        if(typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(null);
        }

        const formData = new FormData();
        formData.append("payload", JSON.stringify({
            ...(settings.DRAFTS[dialogId] || {}),
            content: wantedMessage,
        }));

        await LQ(`channel/${dialogId}/messages`, "POST", formData)
        setMessage("")
        saveSettings({
            DRAFTS: {
                ...settings.DRAFTS,
                [dialogId]: undefined
            }
        })
        setSending(false);
        setTimeout(function() {
            messageBox.current?.focus();
        }, 100);
    }}>
        <button type="button" onClick={() => NiceModal.show(GameLaunchModal, {quarkId: quarkId.split("lq_")[1]})}>Games</button>
        <input type={"text"} ref={mergeRefs(messageBox, emoteSearchFloat.refs.setReference)} disabled={isSending} value={message} onInput={(e) => setMessage(e.target.value)} className={styles.messageBox} {...emoteSearchInteractions.getReferenceProps()}/>
        <button type="button" ref={gifFloat.refs.setReference} {...gifInteractions.getReferenceProps()}>GIFs</button>
        {gifOpen ? <GIFPicker floatRef={gifFloat.refs.setFloating} floatStyles={gifFloat.floatingStyles} floatProps={gifInteractions.getFloatingProps()} setOpen={setGifOpen}/> : null}
        {emoteSearchOpen ? <LightquarkEmoteSearch message={message} setMessage={(message) => {
            setMessage(message);
            new Audio(nyafile.getCachedData("sfx/button-sidebar-select")).play();
            setTimeout(function() {
                setEmoteSearchOpen(false);
            }, 100)
        }} floatRef={emoteSearchFloat.refs.setFloating} floatStyles={emoteSearchFloat.floatingStyles} floatProps={emoteSearchInteractions.getFloatingProps()} activeIndex={emoteSearchActiveIndex} listRef={emoteSearchListRef} itemProps={emoteSearchInteractions.getItemProps()} virtualItemRef={emoteSearchVirtRef}/> : null}
    </form>)
}
