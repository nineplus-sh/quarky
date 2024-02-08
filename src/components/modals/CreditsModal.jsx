import OSSList from "../oss/OSSList.jsx";
import GenericModal from "./GenericModal.jsx";
import Datsuryoku from "../Datsuryoku.jsx";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {version, codename} from "../../../package.json";
import {useTranslation} from "react-i18next";

/**
 * A wrapper around GenericModal for the open source library notices.
 * @param props - The props of the component, provided by React. Refer to GenericModal for the props.
 * @returns {JSX.Element}
 * @constructor
 */
export default function CreditsModal(props) {
    const { t } = useTranslation();

    return (<>
        <GenericModal {...props}>
            <h1 style={{margin: 0}}><NyafileImage src={"img/quarky"} width={"40em"}/> {t("QUARKY_NAME")} <span style={{float: "right"}}><Datsuryoku  /></span></h1>
            <p style={{margin: 0}}><i>{t("QUARKY_DESCRIPTION")}</i></p>
            <br/>
            <p style={{margin: 0}}><NyafileImage src={"img/hakase"} /> {t("QUARKY_BYLINE", {year: "2023-2024"})}</p>
            <p style={{margin: 0}}><NyafileImage src={"img/quarkypixel"} /> {t("QUARKY_VERSION", {version, codename})}</p>
            <hr/>
            <h2 style={{margin: 0}}>{t("CREDITS_SPECIAL_THANKS")}</h2>
            <p style={{margin: 0}}><NyafileImage src={"img/blobbie"} /> {t("CREDITS_EMILIA")}</p>
            <p style={{margin: 0}}><NyafileImage src={"img/bye-man-justthetv"} /> {t("CREDITS_BYE")}</p>
            <p style={{margin: 0}}><NyafileImage src={"img/noicon"} /> {t("CREDITS_SYNNE")}</p>
            <hr/>
            <p>Quarky uses music by <a href={"https://www.hurtrecord.com/"}>HURT RECORD</a> and sound effects from <a href={"https://github.com/ppy/osu-resources"}>osu!resources</a>. Quarky also uses open source libraries:</p>
            <OSSList />
        </GenericModal>
    </>)
}