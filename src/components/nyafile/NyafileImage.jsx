import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";

/**
 * A wrapper for <img> that allows specifying a Nyafile path in the src instead.
 * TODO: Fix this. Not ported. Bad.
 * @param props - The props of the component to pass down to the <img>, provided by React.
 * @returns {JSX.Element} - The <img> tag with the image from the Nyafile as the src.
 * @constructor
 */
export default function NyafileImage(props) {
    let appContext = useContext(AppContext);
    const { src, ...otherProps } = props;
    const [image, setImage] = useState("");
    const [svg, setSvg] = useState(null);

    useEffect(() => {
        async function getDataUrl() {
            const fetchedImage = await appContext.nyafile.getAssetDataUrl(props.src);
            if(fetchedImage.startsWith("data:image/svg") && props.inlinesvg) {
                setSvg(atob(fetchedImage.replace("data:image/svg+xml;base64,", '')))
            } else {
                setImage(fetchedImage)
            }
        }
        getDataUrl();
    }, [appContext.nyafile, props.src]);

    // noinspection HtmlRequiredAltAttribute
    if(!svg) return (
        <img src={image} {...otherProps} />
    )
    return (
        <div {...otherProps} dangerouslySetInnerHTML={{__html: svg}}/>
    )
}