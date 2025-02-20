import GenericModal from "./GenericModal.jsx";
import Datsuryoku from "../Datsuryoku.jsx";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import {version, codename} from "../../../package.json";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import styles from "./CreditsModal.module.css"

/**
 * A wrapper around GenericModal for the open source library notices.
 * @returns {JSX.Element}
 * @constructor
 */
export default NiceModal.create(() => {
    const modal = useModal();
    const { t } = useTranslation();

    return (<>
        <GenericModal modal={modal} classNames={styles.creditsModal}>
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <div><NyafileImage src={"img/nineplus"} width={"140em"}/>
                    <NyafileImage src={"img/quarkymark"} width={"80em"} style={{paddingLeft: "0.5em"}}/></div>
                <p><i>{t("QUARKY_DESCRIPTION")}</i></p>
                <p>{t("QUARKY_VERSION", {version, codename})}</p>
            </div>
            <hr/>

            <h2>{t("CREDITS_SPECIAL_THANKS")}</h2>
            <p><NyafileImage src={"img/blobbie"}/> {t("CREDITS_EMILIA")}</p>
            <p><NyafileImage src={"img/bye-man-justthetv"}/> {t("CREDITS_BYE")}</p>
            <p><NyafileImage src={"img/javascript"}/> {t("CREDITS_OSS")} <a href={"https://github.com/nineplus-sh/quarky/network/dependencies"} target="_blank" rel="noreferrer">{t("CREDITS_OSS_LIST")}</a></p>
            <p><NyafileImage src={"img/pixelaudio"}/> {t("CREDITS_OSUHRDTHDFL")}</p>
            <hr/>

            <span className={styles.legalTexts}>
                <p><NyafileImage src={"img/nineplus_pixel"}/> {t("CREDITS_LEGAL_NOTICE")} <NyafileImage src={"img/hakase"}/></p>
                <p><NyafileImage src={"img/anon"}/> {t("CREDITS_LEGAL_NOTICE_TUMBLR")}</p>
            </span>

            <span className={styles.buttonContainer}>
                <Datsuryoku/>
                <a target={"_blank"} href={"https://lightquark.network"} rel="noreferrer"><NyafileImage src={"img/lightquark"} alt={"Powered by Lightquark"}/></a>
                <a target={"_blank"} href={"https://www.nineplus.sh"} rel="noreferrer"><NyafileImage src={"img/ninebutton"} alt={"a ninePLUS project"}/></a>
                <a target={"_blank"} href="https://ews.moe" rel="noreferrer"><img src="https://ews.moe/ews88x31.png" alt="Hosted by Emilia Web Services"/></a>
            </span>
        </GenericModal>
    </>)
})