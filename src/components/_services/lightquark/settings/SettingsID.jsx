import styles from "./SettingsID.module.css";
import NyafileImage from "../../../nyafile/NyafileImage.jsx";
import classnames from "classnames";
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import {useContext, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import useQuark from "../hooks/useQuark.js";
import useMe from "../hooks/useMe.js";
import {useQueryClient} from "@tanstack/react-query";
import useRPC from "../hooks/useRPC.js";
import useAvatarReset from "../hooks/useAvatarReset.js";
import useAvatarUpload from "../hooks/useAvatarUpload.js";
import useSound from "../../../../hooks/useSound.js";

export default function SettingsID({quarkId}) {
    const {play: successPlay} = useSound("sfx/success");

    const {data: quarkData, isLoading: isQuarkLoading} = useQuark(quarkId, {enabled: !!quarkId});
    const {data: meData, isLoading: isMeLoading} = useMe({enabled: !quarkId});
    const avatarReset = useAvatarReset();
    const avatarUpload = useAvatarUpload();
    const isUploading = avatarReset.isPending || avatarUpload.isPending;
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const target = quarkId ? quarkData : meData;
    const targetLoading = quarkId ? isQuarkLoading : isMeLoading;
    if(targetLoading) return null;

    const targetName = quarkId ? target.name : target.username;
    const targetAvatar = quarkId ? target.iconUri : target.avatarUri;

    async function uploadPicture() {
        if(isUploading) return;

        // https://stackoverflow.com/a/40971885 && https://github.com/nineplus-sh/Quarky-Classic/blob/senpai/public/client.js#L920
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.onchange = async e => {
            await avatarUpload.mutateAsync({
                image: e.target.files[0],
                quark: quarkId,
                progressCallback: (e) => setUploadPercentage(e.loaded / e.total * 100)
            });
            successPlay();
            setUploadPercentage(0);
        }
        input.click();
    }

    return <><div className={styles.userInfoWrap}>
        <div onClick={uploadPicture} className={styles.profilePictureWrap}>
            <div className={classnames(styles.uploadIconWrap, {[styles.uploading]: isUploading})}>
                <NyafileImage src={"img/upload"} inlinesvg={true} className={styles.uploadIcon}/>
            </div>
            <div className={styles.uploadBar} style={{clipPath: `inset(${100-uploadPercentage}% 0 0 0)`}}/>
            <ProfilePicture src={targetAvatar} px={80} doPurr={false}/>
        </div>
        <div className={styles.userNameWrap}>
            <div className={styles.userName}>{targetName}</div>
            <div className={styles.userJoinTime}>Born {new Date(parseInt(
                target._id.substring(0, 8), 16) * 1000).toLocaleDateString()}</div>
        </div>
    </div>{quarkId ? null : <div><button disabled={isUploading} onClick={() => avatarReset.mutate()}>reset avatar</button></div>}</>;
}