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

    useEffect(() => {
        async function getDataUrl() {
            setImage(await appContext.nyafile.getAssetDataUrl(props.src))
        }
        getDataUrl();
    }, []);

    return (
        <!--suppress HtmlRequiredAltAttribute -->
        <img src={image} {...otherProps} />
    )
}