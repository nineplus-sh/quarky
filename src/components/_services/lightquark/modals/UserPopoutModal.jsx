import GenericModal from "../../../modals/GenericModal.jsx";
import {useTranslation} from "react-i18next";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import ProfilePicture from "../../../ProfilePicture.jsx";
import styles from "./UserPopoutModal.module.css";

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
                <b className={styles.name}>{user.status.primaryText}</b>
            </div></> : <><p>isn't doing anything at the moment.</p></>}
        </GenericModal>
    </>)
})