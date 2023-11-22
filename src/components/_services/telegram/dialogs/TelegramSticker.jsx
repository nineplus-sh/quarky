import {useContext, useEffect, useState} from "react";
import pathToSvg from "../../../../util/pathToSvg.js";
import svgToImgURL from "../../../../util/svgToImgURL.js";
import {Api} from "telegram";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function TelegramSticker({media}) {
    const appContext = useContext(AppContext)

    useEffect(() => {
        (async () => {
            if(media.mimeType !== "image/webp") return;

            const stickerLocation = new Api.InputDocumentFileLocation({
                id: media.id.value,
                fileReference: media.fileReference,
                accessHash: media.accessHash.value,
                thumbSize: ""
            })
            const stickerDownload = await appContext.telegram.downloadFile(stickerLocation);
            const dataUrl = `data:image/webp;base64,${stickerDownload.toString("base64")}`;
            setImage(dataUrl)
        })()
    }, []);

    const photoPath = media.thumbs.find(thumb => thumb.className === "PhotoPathSize");
    const photoSize = media.thumbs.find(thumb => thumb.className === "PhotoSize");
    const [image, setImage] = useState(photoPath ? svgToImgURL(pathToSvg(photoPath.bytes)) : "")

    if(media.mimeType !== "image/webp") return <i>Quarky does not support this sticker type.</i>
    return <img src={image} width={photoSize.w} height={photoSize.h} />
}