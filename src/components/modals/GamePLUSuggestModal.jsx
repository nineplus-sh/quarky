import NiceModal, {useModal} from "@ebay/nice-modal-react";
import GenericModal from "./GenericModal.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import styles from "./GamePLUSuggestModal.module.css"
import classnames from "classnames";
import dedupe from "../../util/dedupe.js";
import Button from "../nav/Button.jsx";

export default NiceModal.create(() =>{
    const modal = useModal();
    const [processes, setProcesses] = useState([]);
    const {t} = useTranslation();
    const [selectedProcess, setProcess] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);

    function processHandler(processes) {
        const procs = dedupe(processes, "name").sort((a,b) => b.pid-a.pid).filter(proc => !proc.cmd.startsWith("[") && !proc.cmd.endsWith("]") && proc.cmd.replace(/\\/g, '/').includes("/"));
        setProcesses(procs)
    }
    useEffect(() => {
        const cleanupListener = window.hiddenside.babyGaming(processHandler);
        window.hiddenside.birthOfGaming();
        return () => {
            cleanupListener();
        };
    }, []);
    useEffect(() => {
        if(processes.filter(proc => selectedProcess?.pid === proc.pid).length === 0) setProcess(null);
    }, [processes, selectedProcess]);
    async function submitGame() {
        setSubmitting(true);
        await fetch("https://gameplus.nineplus.sh/api/suggest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                executable: selectedProcess.cmd.split(" ")[0],
                arguments: selectedProcess.cmd.split(" ").slice(1).join(" "),
                platform: window.hiddenside.platform
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
        <div className={styles.actions}>
            <Button primary puffy disabled={isSubmitting || selectedProcess === null} onClick={submitGame}>
                {t(isSubmitting ? "SUGGEST_GAME_SUGGESTING" : "SUGGEST_GAME_BUTTON")}
            </Button>
            <Button puffy disabled={isSubmitting} onClick={() => window.hiddenside.birthOfGaming()}>
                {t("REFRESH")}
            </Button>
        </div>
    </GenericModal>;
})