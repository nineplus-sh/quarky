import styles from "./QuarkSettingsDelete.module.css"
import useQuark from "../hooks/useQuark.js";
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import GenericChannel from "../../../nav/GenericChannel.jsx";
import NyafileImage from "../../../nyafile/NyafileImage.jsx";
import useChannelMembers from "../hooks/useChannelMembers.js";
import {useContext, useEffect, useReducer, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "../../../nav/Button.jsx";
import useQuarkDelete from "../hooks/useQuarkDelete.js";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useModal} from "@ebay/nice-modal-react";
import {router} from "../../../../index.jsx";
import useSound from "../../../../hooks/useSound.js";
import useUser from "../hooks/useUser.js";

export default function QuarkSettingsDelete({quarkId}) {
    const {nyafile} = useContext(AppContext);
    const modal = useModal();
    const {t} = useTranslation();
    const [deaths, setDeaths] = useState([]);
    const {data: quark, isLoading} = useQuark(quarkId);
    const {data: channelMembers, isLoading: isMembersLoading} = useChannelMembers(quark.channels[0]?._id, {enabled: !isLoading && quark.channels.length !== 0});
    const eoeWrap = useRef(null);
    const quarkDelete = useQuarkDelete();

    const {play: popInPlay} = useSound("sfx/dialog-pop-in");
    const {play: cancelPlay} = useSound("sfx/dialog-cancel-select");
    const {play: explodePlay} = useSound("sfx/explode");

    useEffect(() => {
        if(isMembersLoading) return;
        let prevPos = null;
        let prevID = null;
        const interval = setInterval(function() {
            const id = Date.now();
            let pos; let userID;
            do { pos = Math.floor(Math.random()*(parseInt(eoeWrap.current.getBoundingClientRect().width.toString()[0])-1))+1; } while (pos===prevPos);
            do { userID = channelMembers[Math.floor(Math.random() * channelMembers.length)]; } while (channelMembers.length > 1 && prevID===userID);
            prevPos = pos;
            prevID = userID;
            setDeaths(deaths => [...deaths, {id, userID, pos}]);
            setTimeout(() => setDeaths(deaths => deaths.filter(death => death.id !== id)), 500)
        }, 1000)
        return () => clearInterval(interval);
    }, [isMembersLoading]);

    async function boom() {
        popInPlay();
        if(confirm(t("DELETE_QUARK_CONFIRM", {name:quark.name}))) {
            await quarkDelete.mutateAsync(quarkId);
            modal.hide();
            router.navigate("/lq_100000000000000000000000");
            explodePlay();
        } else {
            cancelPlay();
        }
    }

    if(isLoading || isMembersLoading) return null;

    return <>
        <div className={styles.members}>
            {deaths?.map(death => <Death id={death.userID} key={death.id} pos={death.pos}/>)}
        </div>
        <div className={styles.eoeGraphic} ref={eoeWrap}>
            <ProfilePicture src={quark.iconUri} px={196} doPurr={false} className={styles.quark}/>
            <div className={styles.cutter}/>
            <div className={styles.channels}>
                {quark.channels.map(channel => <GenericChannel key={channel.id} name={channel.name}/>)}
            </div>
            <div className={styles.charas}>
                <NyafileImage src={"img/eoeleft"}/>
                <NyafileImage src={"img/eoeright"}/>
            </div>
        </div>

        <div className={styles.terminate}>
            <p className={styles.massive}>{t("DELETE_QUARK_TITLE")}</p>
            <p>{t("DELETE_QUARK_BODY", {name:quark.name})}</p>
            <Button destructive puffy onClick={boom} className={styles.w3shake}>{t("DONT_CARE")}</Button>
        </div>
    </>
}

function Death({id, pos}) {
    const {isSuccess, data} = useUser(id);
    if(!isSuccess) return null;

    return <ProfilePicture src={data.avatarUri} style={{left: `${pos}00px`}}/>
}