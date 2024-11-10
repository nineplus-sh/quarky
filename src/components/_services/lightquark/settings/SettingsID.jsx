import styles from "./SettingsID.module.css";
import NyafileImage from "../../../nyafile/NyafileImage.jsx";
import classnames from "classnames";
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";
import {useContext, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import LQ from "../../../../util/LQ.js";
import useQuark from "../hooks/useQuark.js";
import useMe from "../hooks/useMe.js";
import {useQueryClient} from "@tanstack/react-query";
import useRPC from "../hooks/useRPC.js";

export default function SettingsID({quarkId}) {
    const appContext = useContext(AppContext);
    const queryClient = useQueryClient();
    const [isUploading, setUploading] = useState(false);

    const {data: quarkData, isLoading: isQuarkLoading} = useQuark(quarkId, {enabled: !!quarkId});
    const {data: meData, isLoading: isMeLoading} = useMe({enabled: !quarkId});
    const apiCall = useRPC();

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
            setUploading(true);
            let file = e.target.files[0]
            let formData = new FormData();
            formData.append(quarkId ? "icon" : "avatar", file);

            const avatarCall = await LQ(quarkId ? `quark/${quarkId}/icon` : "user/me/avatar", "PUT", formData);
            if(avatarCall.request.success) {
                if(quarkId) {
                    queryClient.invalidateQueries({queryKey: ["quark", `quark/${quarkId}`]});
                } else {
                    queryClient.invalidateQueries({queryKey: ["user/me"]});
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

    async function resetAvatar() {
        setUploading(true);
        await apiCall({
            route: "user/me/avatar",
            method: "DELETE"
        });
        queryClient.invalidateQueries({queryKey: ["user/me"]});
        setUploading(false);
    }

    return <><div className={styles.userInfoWrap}>
        <div onClick={uploadPicture} className={styles.profilePictureWrap}>
            <NyafileImage src={"img/upload"} inlinesvg={"true"}
                          className={classnames(styles.uploadIcon, {[styles.uploading]: isUploading})}/>
            <ProfilePicture src={targetAvatar} px={80} doPurr={false}/>
        </div>
        <div className={styles.userNameWrap}>
            <div className={styles.userName}>{targetName}</div>
            <div className={styles.userJoinTime}>Born {new Date(parseInt(
                target._id.substring(0, 8), 16) * 1000).toLocaleDateString()}</div>
        </div>
    </div>{quarkId ? null : <div><button onClick={resetAvatar}>reset avatar</button></div>}</>;
}