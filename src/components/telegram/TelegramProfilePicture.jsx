import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {Api, utils} from "telegram";
import ProfilePicture from "../ProfilePicture.jsx";

/**
 * A Telegram DM.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramProfilePicture({photo, peer}) {
    const appContext = useContext(AppContext);
    const [img, setImg] = useState(photo.strippedThumb ? utils.strippedPhotoToJpg(photo.strippedThumb) : undefined);
    useEffect(() => {
        (async () => {
            let photoLocation = new Api.InputPeerPhotoFileLocation({
                photoId: photo.photoId.value,
                peer: peer
            })
            setImg(await appContext.telegram.downloadFile(photoLocation))
        })()
    }, []);

    return <ProfilePicture src={`data:image/jpeg;base64,${img?.toString("base64")}`} />
}