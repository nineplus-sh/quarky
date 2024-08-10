import NiceModal, {useModal} from "@ebay/nice-modal-react";
import GenericModal from "./GenericModal.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import styles from "./GamePLUSuggestModal.module.css"

export default NiceModal.create(() =>{
    const modal = useModal();
    const [processes, setProcesses] = useState([]);
    const {t} = useTranslation();

    function processHandler(processes) {
        setProcesses(processes);
        console.log(processes)
    }
    useEffect(() => {
        window.hiddenside.babyGaming(processHandler);
        window.hiddenside.birthOfGaming();
        return () => {
            window.hiddenside.byeBaby(processHandler);
        };
    }, []);

    return <GenericModal modal={modal}>
        {t("SUGGEST_GAME_MODAL")}
        <div className={styles.gameList}>
            {processes.map(process => <div key={process.cmd} className={styles.game}>{process.name} ({process.cmd})</div>)}
        </div>
    </GenericModal>;
})