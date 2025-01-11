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

export default function QuarkSettingsDelete({quarkId}) {
    const {nyafile} = useContext(AppContext);
    const modal = useModal();
    const {t} = useTranslation();
    const [deaths, setDeaths] = useState([]);
    const {data: quark, isLoading} = useQuark(quarkId);
    const {data: channelMembers, isLoading: isMembersLoading} = useChannelMembers(quark.channels[0]?._id, {enabled: !isLoading && quark.channels.length !== 0});
    const eoeWrap = useRef(null);
    const quarkDelete = useQuarkDelete();

    useEffect(() => {
        if(isMembersLoading) return;
        let prevPos = null;
        let prevAvatar = null;
        const interval = setInterval(function() {
            const id = Date.now();
            let pos; let avatar;
            do { pos = Math.floor(Math.random()*(parseInt(eoeWrap.current.getBoundingClientRect().width.toString()[0])-1))+1; } while (pos===prevPos);
            do { avatar = channelMembers[Math.floor(Math.random() * channelMembers.length)].avatarUri; } while (channelMembers.length > 1 && prevAvatar===avatar);
            prevPos = pos;
            prevAvatar = avatar;
            setDeaths(deaths => [...deaths, {id, avatar, pos}]);
            setTimeout(() => setDeaths(deaths => deaths.filter(death => death.id !== id)), 500)
        }, 1000)
        return () => clearInterval(interval);
    }, [isMembersLoading]);

    function boom() {
        new Audio(nyafile.getFileURL("sfx/dialog-pop-in")).play();
        setTimeout(async function() {
            if(confirm(t("DELETE_QUARK_CONFIRM", {name:quark.name}))) {
                await quarkDelete.mutateAsync(quarkId);
                modal.hide();
                router.navigate("/lq_100000000000000000000000");
                new Audio("/explode.mp3").play();
            }
        }, 20)
    }

    if(isLoading || isMembersLoading) return null;

    return <>
        <div className={styles.members}>
            {deaths?.map(death => <ProfilePicture src={death.avatar} key={death.id} style={{left: `${death.pos}00px`}}/>)}
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