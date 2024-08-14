import styles from "./SettingsID.module.css";
import NyafileImage from "../../../nyafile/NyafileImage.jsx";
import classnames from "classnames";
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import {useContext, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import LQ from "../../../../util/LQ.js";

export default function SettingsID({quarkId}) {
    const appContext = useContext(AppContext);
    const [isUploading, setUploading] = useState(false);

    const target = quarkId ? appContext.quarkCache[quarkId] : appContext.accounts.lightquark;
    const targetName = quarkId ? target.name : target.username;
    const targetAvatar = quarkId ? target.iconUri : target.avatarUri;

    async function uploadPicture() {
        if(isUploading) return;

        // https://stackoverflow.com/a/40971885 && https://github.com/nineplus-sh/Quarky-Classic/blob/senpai/public/client.js#L920
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.onchange = async e => {
            setUploading(true);
            let file = e.target.files[0]
            let formData = new FormData();
            formData.append(quarkId ? "icon" : "avatar", file);

            const avatarCall = await LQ(quarkId ? `quark/${quarkId}/icon` : "user/me/avatar", "PUT", formData);
            if(avatarCall.request.success) {
                if(quarkId) {
                    appContext.setQuarkCache(prev => ({...prev, [quarkId]: {...avatarCall.response.quark, channels: appContext.quarkCache[quarkId].channels}}));
                } else {
                    appContext.setAccounts(prev => ({...prev, "lightquark": avatarCall.response.user}))
                }
                new Audio(appContext.nyafile.getCachedData("sfx/success")).play();
            } else {
                new Audio(appContext.nyafile.getCachedData("sfx/error")).play();
                setTimeout(() => alert("The new avatar could not be uploaded."), 5);
            }
            setUploading(false);
        }
        input.click();
    }

    return <div className={styles.userInfoWrap}>
        <div onClick={uploadPicture} className={styles.profilePictureWrap}>
            <NyafileImage src={"img/upload"} inlinesvg="true"
                          className={classnames(styles.uploadIcon, {[styles.uploading]: isUploading})}/>
            <ProfilePicture src={targetAvatar} px={80} doPurr={false}/>
        </div>
        <div className={styles.userNameWrap}>
            <div className={styles.userName}>{targetName}</div>
            <div className={styles.userJoinTime}>Born {new Date(parseInt(
                target._id.substring(0, 8), 16) * 1000).toLocaleDateString()}</div>
        </div>
    </div>;
}