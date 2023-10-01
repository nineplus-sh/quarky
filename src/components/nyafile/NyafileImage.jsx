import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";

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
        <img src={image} {...otherProps} />
    )
}