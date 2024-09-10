import NiceModal, {useModal} from "@ebay/nice-modal-react";
import GenericModal from "./GenericModal.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import styles from "./GameModal.module.css"
import classnames from "classnames";
import useMe from "../_services/lightquark/hooks/useMe.js";
import useQuark from "../_services/lightquark/hooks/useQuark.js";

export default NiceModal.create(({ gameLink, quarkId, opponent }) =>{
    const modal = useModal();
    const ourFrame = useRef(null);
    const [frameHeight, setFrameHeight] = useState(null);
    const [frameWidth, setFrameWidth] = useState(null);
    const {settings, saveSettings} = useContext(AppContext);

    const {data: userData, isLoading: isMeLoading} = useMe();
    const {data: quarkData, isLoading: isQuarkLoading} = useQuark(quarkId);
    const isLoading = isMeLoading || isQuarkLoading;

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
                name: userData.username,
                avatar: userData.avatarUri
            },
            opponent: opponent,
            arena: {
                name: quarkData.name,
                avatar: quarkData.iconUri
            }
        }, "*")
    }

    if(isLoading) return null;
    return <GenericModal modal={modal} classNames={classnames(styles.gameModal, {[styles.gameModalDefault]: frameWidth === null})}>
        <iframe src={gameLink} ref={ourFrame} width={frameWidth} height={frameHeight} onLoad={feedData} frameBorder={0}/>
    </GenericModal>;
})