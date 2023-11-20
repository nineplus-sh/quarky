import OSSList from "../oss/OSSList.jsx";
import GenericModal from "./GenericModal.jsx";
import Datsuryoku from "../Datsuryoku.jsx";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {version} from "../../../package.json"

/**
 * A wrapper around GenericModal for the open source library notices.
 * @param props - The props of the component, provided by React. Refer to GenericModal for the props.
 * @returns {JSX.Element}
 * @constructor
 */
export default function CreditsModal(props) {
    return (<>
        <GenericModal {...props}>
            <h1 style={{margin: 0}}><NyafileImage src={"img/quarky"} width={"40em"}/> Quarky 2 <span style={{float: "right"}}><Datsuryoku  /></span></h1>
            <p style={{margin: 0}}><i>A chat client for Lightquark, Telegram, and maybe Discord</i></p>
            <br/>
            <p style={{margin: 0}}><NyafileImage src={"img/hakase"} /> Hakase software © 2023</p>
            <p style={{margin: 0}}><NyafileImage src={"img/quarkypixel"} /> Version {version}</p>
            <hr/>
            <p>Quarky uses music by <a href={"https://www.hurtrecord.com/"}>HURT RECORD</a> and sound effects from <a href={"https://github.com/ppy/osu-resources"}>osu!resources</a>. Quarky also uses open source libraries:</p>
            <OSSList />
        </GenericModal>
    </>)
}