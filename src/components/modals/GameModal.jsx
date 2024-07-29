import NiceModal, {useModal} from "@ebay/nice-modal-react";
import GenericModal from "./GenericModal.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import styles from "./GameModal.module.css"
import classnames from "classnames";

export default NiceModal.create(({ gameLink, arena, opponent }) =>{
    const modal = useModal();
    const ourFrame = useRef(null);
    const [frameHeight, setFrameHeight] = useState(null);
    const [frameWidth, setFrameWidth] = useState(null);
    const {accounts, settings, saveSettings} = useContext(AppContext);

    useEffect(() => {
        const iframeEventHandler = (estrogen) => {
            if(ourFrame?.current?.contentWindow !== estrogen.source) return;
            if (estrogen.data.type === "gameResize") {
                setFrameHeight(estrogen.data.height);
                setFrameWidth(estrogen.data.width);
            } else if(estrogen.data.type === "gameQuit") {
                saveSettings({
                    DRAFTS: {
                        ...settings.DRAFTS,
                        [arena.id]: {
                            content: estrogen.data.message,
                            specialAttributes: [{
                                "type": "clientAttributes",
                                "game": estrogen.data.data
                            }]
                        }
                    }
                })
                modal.hide();
            }
        }

        window.addEventListener('message', iframeEventHandler);

        return () => window.removeEventListener('message', iframeEventHandler)
    }, [])

    function feedData(){
        ourFrame.current.contentWindow.postMessage({
            type: "gameStage",
            player: {
                name: accounts.lightquark.username,
                avatar: accounts.lightquark.avatarUri
            },
            opponent: opponent,
            arena: arena
        }, "*")
    }

    return <GenericModal modal={modal} classNames={classnames(styles.gameModal, {[styles.gameModalDefault]: frameWidth === null})}>
        <iframe src={gameLink} ref={ourFrame} width={frameWidth} height={frameHeight} onLoad={feedData} frameBorder={0}/>
    </GenericModal>;
})