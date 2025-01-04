import {useParams} from "react-router-dom";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
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
import {v4 as uuidv4} from "uuid";
import byteSize from "byte-size";

export default function MessageInput() {
    const {nyafile} = useContext(AppContext);
    let { quarkId, dialogId } = useParams();
    let [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
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

    function upload() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.multiple = true;

        input.onchange = async e => {
            const newFiles = Array.from(e.target.files);

            if((newFiles.length+files.length)>10) return alert("You can't send more than 10 files at a time!")
            newFiles.forEach(file => file.key = uuidv4())
            setFiles(pfiles => [...pfiles, ...newFiles]);
        }
        input.click();
    }

    return <>
        {files.length > 0 ?
            <span className={styles.pendingFiles}>
                {files.map(file => <File
                    file={file}
                    clear={() =>
                        setFiles(pfiles => pfiles.filter(ffile => ffile.key !== file.key))
                    } key={file.key}
                />)}
            </span>
        : null}

        <form className={styles.messageForm} onSubmit={async (e) => {
            e.preventDefault();

            await messageCreate.mutateAsync({
                channel: dialogId,
                message: {content:message},
                attachments: files
            })

            setMessage("");
            setFiles([]);
            setTimeout(function() {
                messageBox.current?.focus();
            }, 100);
        }}>
            <Button onClick={upload} disabled={files.length > 9}>Upload</Button>
            <Button style={{display: "none"}} onClick={() => NiceModal.show(GameLaunchModal, {quarkId: quarkId.split("lq_")[1]})}>Games</Button>
            <input type={"text"} disabled={messageCreate.isPending} value={message} onInput={(e) => setMessage(e.target.value)} className={styles.messageBox} {...emoteSearchPopout.sourceProps} ref={mergeRefs(messageBox, emoteSearchPopout.sourceProps.ref)} />
            <Button {...gifPopout.sourceProps}>GIFs</Button>
        </form>

        {gifPopout.open ? <GIFPicker {...gifPopout.popoutProps} hide={gifPopout.toggle}/> : null}
        {emoteSearchPopout.open ? <LightquarkEmoteSearch message={message} setMessage={(message) => {
            setMessage(message);
            new Audio(nyafile.getCachedData("sfx/button-sidebar-select")).play();
        }} {...emoteSearchPopout} {...emoteSearchPopout.popoutProps}/> : null}
    </>
}

function File({file, clear}) {
    const [dataURI, setDataURI] = useState(null);

    useEffect(() => {
        if(!file.type.startsWith("image/")) setDataURI(null);
        const reader = new FileReader();
        reader.onload = () => setDataURI(reader.result);
        reader.readAsDataURL(file);
        return () => {reader.abort()}
    }, [file]);

    return <div className={styles.file} onClick={clear}>
        {dataURI ? <img src={dataURI} className={styles.filePreview}/> : null}
        <div className={styles.fileText}><span className={styles.fileName}>{file.name}</span>({byteSize(file.size, {units: 'iec'}).toString()})</div>
    </div>
}