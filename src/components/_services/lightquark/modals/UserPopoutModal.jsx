import GenericModal from "../../../modals/GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import ProfilePicture from "../../../ProfilePicture.jsx";
import styles from "./UserPopoutModal.module.css";
import TimeAgo from "react-timeago";

const elapse = function(value, unit, suffix, date) {
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    const minutes = Math.floor(diffSec / 60);
    const seconds = diffSec % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * @returns {JSX.Element}
 * @constructor
 */
export default NiceModal.create(({user}) => {
    const modal = useModal();
    const { t } = useTranslation();

    return (<>
        <GenericModal modal={modal}>
            <div className={styles.introduction}>
                <ProfilePicture src={user.avatarUri} px={48}/>
                <p className={styles.name}>{user.username}</p>
            </div>
            {user.status ? <><p>is playing a game:</p><div className={styles.status}>
                <img src={user.status.primaryImage} width={96}/>
                <span className={styles.gameinfo}>
                    <b>{user.status.primaryText}</b>
                    {user.status.startTime && !user.status.endTime ? <><br/><TimeAgo date={user.status.startTime} formatter={elapse} maxPeriod={1}/> elapsed</> : null}
                </span>
            </div></> : <><p>isn't doing anything at the moment.</p></>}
        </GenericModal>
    </>)
})