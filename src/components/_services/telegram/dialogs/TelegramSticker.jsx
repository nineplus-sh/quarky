import {useContext, useEffect, useState} from "react";
import pathToSvg from "../../../../util/pathToSvg.js";
import svgToImgURL from "../../../../util/svgToImgURL.js";
import {Api} from "telegram";
import {AppContext} from "../../../../contexts/AppContext.js";
import Lottie from 'react-lottie';
import * as pako from "pako";

export default function TelegramSticker({media}) {
    const appContext = useContext(AppContext)

    useEffect(() => {
        (async () => {
            const stickerLocation = new Api.InputDocumentFileLocation({
                id: media.id.value,
                fileReference: media.fileReference,
                accessHash: media.accessHash.value,
                thumbSize: ""
            })
            const stickerDownload = await appContext.telegram.downloadFile(stickerLocation);
            if(media.mimeType === "application/x-tgsticker") return setLottie(JSON.parse(pako.inflate(stickerDownload, { to: 'string' })))
            const dataUrl = `data:image/webp;base64,${stickerDownload.toString("base64")}`;
            setImage(dataUrl)
        })()
    }, []);

    const photoPath = media.thumbs.find(thumb => thumb.className === "PhotoPathSize");
    const photoSize = media.thumbs.find(thumb => thumb.className === "PhotoSize");
    const [image, setImage] = useState(photoPath ? svgToImgURL(pathToSvg(photoPath.bytes)) : "")
    const [lottie, setLottie] = useState(undefined)

    return lottie ? <Lottie options={{loop: true, autoplay: true, animationData: lottie}} width={256}/> : <img src={image} width={photoSize.w} height={photoSize.h} />
}