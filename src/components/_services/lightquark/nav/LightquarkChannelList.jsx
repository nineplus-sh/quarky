import LightquarkChannel from "./LightquarkChannel.jsx";
import styles from "./LightquarkChannelList.module.css";
import GenericChannel from "../../../nav/GenericChannel.jsx";
import {useTranslation} from "react-i18next";
import useMe from "../hooks/useMe.js";
import NiceModal from "@ebay/nice-modal-react";
import CreditsModal from "../../../modals/CreditsModal.jsx";

export default function LightquarkChannelList({quark, demo}) {
    const {t} = useTranslation();
    const {data: userData, isLoading} = useMe();

    return <div className={styles.channelList}>
        {quark.channels.map((channel) => <LightquarkChannel demo={demo} channel={channel} quarkId={quark._id} key={channel._id} />)}
        {true || isLoading || quark._id === "100000000000000000000000" || !quark?.owners.includes(userData._id) ? null :
            <GenericChannel slim name={"+ " + t("CREATE_CHANNEL")} onClick={() => {
                NiceModal.show(CreditsModal)
            }}/>}
    </div>
}