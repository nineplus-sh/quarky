import GenericModal from "./GenericModal.jsx";
import styles from "./FirstTimeModal.module.css";
import loginStyles from "../_services/lightquark/modals/LightquarkLogin.module.css";
import {Trans, useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import classnames from "classnames";

export default NiceModal.create(({playMusic}) => {
    const modal = useModal();
    const { t } = useTranslation();

    return (<>
        <GenericModal modal={modal} classNames={[styles.modalContent]} allowNonEventClose={false}>

            <span className={styles.firstTimeContainer}>
                <span className={styles.blahBlahBlah}>
                    <span className={styles.heyhey}>
                        <NyafileImage src={"img/quarky"} className={styles.quarkyLogo}/>
                        <span className={styles.heyheyText}>{t("HEADER_WELCOME")}</span>
                    </span>

                    <p className={styles.blahBlahDesc}>{t("QUARKY_DESCRIPTION_FIRST_TIME")}</p>
                </span>

                <iframe width="391" height="220" src="https://www.youtube.com/embed/rNuMNyVInlY?start=92" frameBorder="0"
                        className={styles.MV} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </span>

            <p>{t("FIRST_TIME_MISSION")}</p>
            <p>{t("FIRST_TIME_STANDOUT")}</p>
            <p><Trans i18nKey={"FIRST_TIME_SUPPORT"} components={[<a href={"https://www.nineplus.sh/support.html"} target={"_blank"} rel={"noreferrer"}/>]}/></p>

            <button onClick={() => {
                localStorage.setItem("SEEN_DEVELOP_MODAL", "Yes :)");
                modal.hide();
                setTimeout(function() {
                    playMusic(true);
                }, 300)
            }} className={classnames(loginStyles.prettyButton, loginStyles.primaryButton, styles.ultraWideButton)}>
                {t("FIRST_TIME_BLASTOFF")}
            </button>

            <p className={styles.autoplayWarning}>{t("FIRST_TIME_AUTOPLAY")}</p>
        </GenericModal>
    </>)
})