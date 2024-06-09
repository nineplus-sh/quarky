import ProfilePicture from "../../../ProfilePicture.jsx";
import {useContext, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import LQ from "../../../../util/LQ.js";
import styles from "./SettingsProfile.module.css"
import NyafileImage from "../../../nyafile/NyafileImage.jsx";
import classnames from "classnames";

export default function SettingsProfile() {
    const appContext = useContext(AppContext);
    const [isUploading, setUploading] = useState(false);

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
            formData.append("avatar", file);

            const userResponse = await LQ("user/me/avatar", "PUT", formData);
            if(userResponse.request.success) {
                appContext.setAccounts(prev => ({...prev, "lightquark": userResponse.response.user}))
                new Audio(appContext.nyafile.getCachedData("sfx/success")).play();
            } else {
                new Audio(appContext.nyafile.getCachedData("sfx/error")).play();
                setTimeout(() => alert("The new avatar could not be uploaded."), 5);
            }
            setUploading(false);
        }
        input.click();
    }

    return <>
        <div className={styles.userInfoWrap}>
            <div onClick={uploadPicture} className={styles.profilePictureWrap}>
                <NyafileImage src={"img/upload"} className={classnames(styles.uploadIcon, {[styles.uploading]: isUploading})}/>
                <ProfilePicture src={appContext.accounts.lightquark.avatarUri} px={80} doPurr={false}/>
            </div>
            <div className={styles.userNameWrap}>
                <div className={styles.userName}>{appContext.accounts.lightquark.username}</div>
                <div className={styles.userJoinTime}>Joined on {new Date(parseInt(appContext.accounts.lightquark._id.substring(0, 8), 16) * 1000).toLocaleDateString()}</div>
            </div>
        </div>
    </>
}