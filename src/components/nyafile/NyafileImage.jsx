import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";

/**
 * A wrapper for <img> that allows specifying a Nyafile path in the src instead.
 * TODO: Fix this. Not ported. Bad.
 * @param src - The path to the image in the Nyafile.
 * @param props - The props of the component to pass down to the <img>, provided by React.
 * @returns {JSX.Element} - The <img> tag with the image from the Nyafile as the src.
 * @constructor
 */
export default function NyafileImage({src, inlinesvg, ...props}) {
    let appContext = useContext(AppContext);
    const [image, setImage] = useState("");
    const [svg, setSvg] = useState(null);

    useEffect(() => {
        async function getDataUrl() {
            const fetchedImage = await appContext.nyafile.getAssetDataUrl(src);
            if (fetchedImage.startsWith("data:image/svg") && inlinesvg) {
                setSvg(atob(fetchedImage.replace("data:image/svg+xml;base64,", '')))
            } else {
                setImage(fetchedImage)
            }
        }

        getDataUrl();
    }, [appContext.nyafile, appContext.nyafile.defaultFile, appContext.nyafile.nyaFile, src, inlinesvg]);

    // noinspection HtmlRequiredAltAttribute
    const { alt, ...restProps } = props;
    if (!svg) return <img {...props} src={image}/>
    if (alt) return <div {...restProps} dangerouslySetInnerHTML={{__html: svg}} role={"image"} aria-label={alt}/>
    return (
        <div {...props} dangerouslySetInnerHTML={{__html: svg}}/>
    )
}