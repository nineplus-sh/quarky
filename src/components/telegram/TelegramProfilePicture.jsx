import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {Api, utils} from "telegram";
import styles from "./TelegramProfilePicture.module.css"

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

    return <img src={`data:image/jpeg;base64,${img?.toString("base64")}`} className={styles.pfp} />
}