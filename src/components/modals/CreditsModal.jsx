import GenericModal from "./GenericModal.jsx";
import Datsuryoku from "../Datsuryoku.jsx";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {version, codename} from "../../../package.json";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

/**
 * A wrapper around GenericModal for the open source library notices.
 * @returns {JSX.Element}
 * @constructor
 */
export default NiceModal.create(() => {
    const modal = useModal();
    const { t } = useTranslation();

    return (<>
        <GenericModal modal={modal}>
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <div><NyafileImage src={"img/nineplus"} width={"140em"}/>
                    <NyafileImage src={"img/quarkymark"} width={"80em"} style={{paddingLeft: "0.5em"}}/></div>
                <p style={{margin: 0}}><i>{t("QUARKY_DESCRIPTION")}</i></p>
                <p style={{margin: 0}}>{t("QUARKY_VERSION", {version, codename})}</p>
            </div>
            <hr/>

            <h2 style={{margin: 0}}>{t("CREDITS_SPECIAL_THANKS")}</h2>
            <p style={{margin: 0}}><NyafileImage src={"img/blobbie"}/> {t("CREDITS_EMILIA")}</p>
            <p style={{margin: 0}}><NyafileImage src={"img/bye-man-justthetv"}/> {t("CREDITS_BYE")}</p>
            <p style={{margin: 0}}><NyafileImage src={"img/javascript"}/> {t("CREDITS_OSS")} <a
                href={"https://github.com/nineplus-sh/quarky/network/dependencies"} target="_blank" rel="noreferrer">{t("CREDITS_OSS_LIST")}</a></p>
            <p style={{margin: 0}}><NyafileImage src={"img/pixelaudio"}/> {t("CREDITS_OSUHRDTHDFL")}</p>
            <hr/>
            <p><NyafileImage src={"img/nineplus_pixel"}/> {t("CREDITS_LEGAL_NOTICE")} <NyafileImage src={"img/hakase"}/></p>
            <p><NyafileImage src={"img/anon"}/> {t("CREDITS_LEGAL_NOTICE_TUMBLR")}</p>
            <span style={{float: "left"}}>
                <a target={"_blank"} href={"https://ews.moe"} rel="noreferrer"><NyafileImage src={"img/ews"}/></a>
                <Datsuryoku/>
                <a target={"_blank"} href={"https://lightquark.network"} rel="noreferrer"><NyafileImage src={"img/lightquark"}/></a>
                <a target={"_blank"} href={"https://www.nineplus.sh"} rel="noreferrer"><NyafileImage src={"img/ninebutton"}/></a>
            </span>
        </GenericModal>
    </>)
})