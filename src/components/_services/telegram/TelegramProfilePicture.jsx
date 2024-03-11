import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../contexts/AppContext.js";
import {Api, utils} from "telegram";
import ProfilePicture from "../../ProfilePicture.jsx";
import { ClientContext } from "../../../contexts/ClientContext.js";

/**
 * A Telegram DM.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramProfilePicture({photo, peer}) {
    const appContext = useContext(AppContext);
    /*
    avatarCache: Keeps promises to an avatar that is being downloaded, when the promise resolves, the avatar goes to resolvedAvatarCache
    resolvedAvatarCache: Keeps the downloaded avatars as ready-to-use data URIs
    */
    const {avatarCache, setAvatarCache, resolvedAvatarCache, setResolvedAvatarCache} = useContext(ClientContext)
    const [img, setImg] = useState(photo?.strippedThumb ? utils.strippedPhotoToJpg(photo.strippedThumb) : undefined);
    useEffect(() => {
        (async () => {
            if(!photo) return;
            if (avatarCache[photo.photoId.value]) {
                console.log("Cached avatar found")
                setImg(await avatarCache[photo.photoId.value])
            } else {
                console.log("Caching avatar")
                let photoLocation = new Api.InputPeerPhotoFileLocation({
                    photoId: photo.photoId.value,
                    peer: peer
                })
                let avatarDownload = appContext.telegram.downloadFile(photoLocation);
                setAvatarCache(p => ({...p, [photo.photoId.value]: avatarDownload}))
                let resolvedImage = await avatarDownload
                setImg(resolvedImage)
                console.log("Updating resolved avatar cache")
                setResolvedAvatarCache(p => ({...p, [photo.photoId.value]: `data:image/jpeg;base64,${resolvedImage.toString("base64")}`}))
            }
        })()
    }, [photo, peer]);

    return <div onClick={() => {console.log(resolvedAvatarCache)}}><ProfilePicture src={resolvedAvatarCache[photo?.photoId.value] || `data:image/jpeg;base64,${img?.toString("base64")}`} /></div>
}