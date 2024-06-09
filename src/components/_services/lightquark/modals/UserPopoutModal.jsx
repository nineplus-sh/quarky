import GenericModal from "../../../modals/GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import ProfilePicture from "../../../ProfilePicture.jsx";
import styles from "./UserPopoutModal.module.css";
import TimeAgo from "react-timeago";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

const elapse = function(value, unit) {
    return `for ${value} ${unit}${value !== 1 ? "s" : null}`
};

/**
 * @returns {JSX.Element}
 * @constructor
 */
export default NiceModal.create(({userId}) => {
    const modal = useModal();
    const {userCache} = useContext(AppContext)
    const { t } = useTranslation();

    return (<>
        <GenericModal modal={modal}>
            <div className={styles.introduction}>
                <ProfilePicture src={userCache[userId].avatarUri} px={48}/>
                <p className={styles.name}>{userCache[userId].username}</p>
            </div>
            {userCache[userId].status ? <><p>is playing a game:</p><div className={styles.status}>
                <img src={userCache[userId].status.primaryImage} width={96}/>
                <span className={styles.gameinfo}>
                    <b>{userCache[userId].status.primaryText}</b>
                    {userCache[userId].status.startTime && !userCache[userId].status.endTime ? <><br/><TimeAgo date={userCache[userId].status.startTime} formatter={elapse} maxPeriod={1}/></> : null}
                </span>
            </div></> : <><p>isn't doing anything at the moment.</p></>}
        </GenericModal>
    </>)
})