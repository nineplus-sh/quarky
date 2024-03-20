import Photo from "../../../dialogs/Photo.jsx";
import {Api, utils} from "telegram";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function TelegramPhoto({media}) {
    const strippedSize = media.photo.sizes.find(size => size.type === "i")
    console.log(utils.strippedPhotoToJpg(strippedSize.bytes))

    const [src, setSrc] = useState(strippedSize?.bytes ? `data:image/jpg;base64,${utils.strippedPhotoToJpg(strippedSize.bytes).toString("base64")}` : undefined);
    const appContext = useContext(AppContext)

    useEffect(() => {
        (async () => {

            const photoLocation = new Api.InputPhotoFileLocation({
                id: media.photo.id.value,
                fileReference: media.photo.fileReference,
                accessHash: media.photo.accessHash.value,
                thumbSize: media.photo.sizes.find(size => size.className === "PhotoSizeProgressive").type
            })
            const photoDownload = await appContext.telegram.downloadFile(photoLocation);
            const dataUrl = `data:image/webp;base64,${photoDownload.toString("base64")}`;
            setSrc(dataUrl)
        })()
    }, []);

    return <Photo src={src} height={media.photo.sizes.find(size => size.className === "PhotoSizeProgressive").h} width={media.photo.sizes.find(size => size.className === "PhotoSizeProgressive").w}/>
}