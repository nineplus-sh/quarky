import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import DOMPurify from 'dompurify';
import styles from "./NyafileImage.module.css";
import classnames from "classnames";

/**
 * A wrapper for <img> that allows specifying a Nyafile path in the src instead.
 * TODO 2: This wonky legacy non-reactic component shows some flaws with how nyalib is used in q2. I have just ported its logic to nyalib v3 and thrown it through a sanitizer for now.
 * @param src - The path to the image in the Nyafile.
 * @param props - The props of the component to pass down to the <img>, provided by React.
 * @returns {JSX.Element} - The <img> tag with the image from the Nyafile as the src.
 * @constructor
 */
export default function NyafileImage({src, inlinesvg, ...props}) {
    let {nyafile} = useContext(AppContext);
    const [svg, setSvg] = useState(null);

    useEffect(() => {
        async function getSVG() {
            setSvg(DOMPurify.sanitize(await nyafile.getFileText(src)))
        }

        if(inlinesvg && nyafile.getFileType(src) === "image/svg+xml") getSVG();
    }, [nyafile?.defaultCache, nyafile?.skinCache, src, inlinesvg]);

    // noinspection HtmlRequiredAltAttribute
    const { alt, ...restProps } = props;
    if (!inlinesvg || nyafile.getFileType(src) !== "image/svg+xml") return <img {...props} src={nyafile.getFileURL(src)}/>
    if(!svg) return null;
    if (alt) return <div {...restProps} className={classnames(restProps.className, styles.svg)} dangerouslySetInnerHTML={{__html: svg}} role={"image"} aria-label={alt}/>
    return (
        <div {...props} className={classnames(restProps.className, styles.svg)} dangerouslySetInnerHTML={{__html: svg}}/>
    )
}