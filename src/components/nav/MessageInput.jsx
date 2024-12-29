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
import Button from "./Button.jsx";
import usePopout from "../../hooks/usePopout.js";
import useAutocompletePopout from "../../hooks/useAutocompletePopout.js";
import useEmotes from "../_services/lightquark/hooks/useEmotes.js";
import useChannelMessageCreate from "../_services/lightquark/hooks/useChannelMessageCreate.js";

export default function MessageInput() {
    const {nyafile} = useContext(AppContext);
    let { quarkId, dialogId } = useParams();
    let [message, setMessage] = useState("");
    const messageBox = useRef(null);
    const messageCreate = useChannelMessageCreate();

    const gifPopout = usePopout({placement: "top-end"});
    const emotes = useEmotes();
    const emoteSearchPopout = useAutocompletePopout({
        data: emotes.data?.flatMap(q => q.emotes),
        search: message.match(/:(\w{2,})$/)?.[1],
        popoutOptions: {placement: "top-start"},
        fuseOptions: {keys: ['name'], threshold: 0.1, limit: 50},
        invertControls: true
    })

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

    return (<form className={styles.messageForm} onSubmit={async (e) => {
        e.preventDefault();

        await messageCreate.mutateAsync({
            channel: dialogId,
            message: {content:message}
        })

        setMessage("");
        setTimeout(function() {
            messageBox.current?.focus();
        }, 100);
    }}>
        <Button onClick={() => NiceModal.show(GameLaunchModal, {quarkId: quarkId.split("lq_")[1]})}>Games</Button>
        <input type={"text"} disabled={messageCreate.isPending} value={message} onInput={(e) => setMessage(e.target.value)} className={styles.messageBox} {...emoteSearchPopout.sourceProps} ref={mergeRefs(messageBox, emoteSearchPopout.sourceProps.ref)} />
        <Button {...gifPopout.sourceProps}>GIFs</Button>
        {gifPopout.open ? <GIFPicker {...gifPopout.popoutProps} hide={gifPopout.toggle}/> : null}
        {emoteSearchPopout.open ? <LightquarkEmoteSearch message={message} setMessage={(message) => {
            setMessage(message);
            new Audio(nyafile.getCachedData("sfx/button-sidebar-select")).play();
        }} {...emoteSearchPopout} {...emoteSearchPopout.popoutProps}/> : null}
    </form>)
}
