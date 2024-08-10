import NiceModal, {useModal} from "@ebay/nice-modal-react";
import GenericModal from "./GenericModal.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import styles from "./GamePLUSuggestModal.module.css"
import loginStyles from "../_services/lightquark/modals/LightquarkLogin.module.css"
import ftmStyles from "./FirstTimeModal.module.css";
import classnames from "classnames";

export default NiceModal.create(() =>{
    const modal = useModal();
    const [processes, setProcesses] = useState([]);
    const {t} = useTranslation();
    const [selectedProcess, setProcess] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);

    function processHandler(processes) {
        setProcesses(processes.reverse());
    }
    useEffect(() => {
        window.hiddenside.babyGaming(processHandler);
        window.hiddenside.birthOfGaming();
        return () => {
            window.hiddenside.byeBaby(processHandler);
        };
    }, []);
    async function submitGame() {
        setSubmitting(true);
        await fetch("https://gameplus.nineplus.sh/api/suggest", {
            method: "POST",
            body: JSON.stringify({
                executable: selectedProcess.cmd.split(" ")[0],
                arguments: selectedProcess.cmd.split(" ").slice(1).join(" "),
                platform: window.hiddenside.platform,
            })
        })
        modal.hide();
    }

    return <GenericModal modal={modal}>
        <p>
            {t("SUGGEST_GAME_MODAL")}<br/>
            <span className={styles.privacyRisk}>{t("SUGGEST_GAME_MODAL_WARNING")}</span>
        </p>
        <div className={styles.gameList}>
            {processes.map(process =>
                <div key={process.pid} onClick={()=>setProcess(process)}
                     className={classnames(styles.game, {[styles.selected]: process.pid === selectedProcess?.pid})}>
                    <span className={styles.name}>{process.name}</span>
                    <span className={styles.cmd}>{process.cmd}</span>
                </div>
            )}
        </div>
        <button disabled={isSubmitting || selectedProcess === null} onClick={submitGame}
                className={classnames(loginStyles.prettyButton, loginStyles.primaryButton, ftmStyles.ultraWideButton)}>
            {t(isSubmitting ? "SUGGEST_GAME_SUGGESTING" : "SUGGEST_GAME_BUTTON")}
        </button>
    </GenericModal>;
})