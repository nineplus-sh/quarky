import SettingsToggleBox from "./SettingsToggleBox.jsx";
import {useTranslation} from "react-i18next";
import NiceModal from "@ebay/nice-modal-react";
import GamePLUSuggestModal from "../modals/GamePLUSuggestModal.jsx";

export default function UserSettingsPlaying() {
    const {t} = useTranslation();
    return <>
        <SettingsToggleBox setting={"GAME_ACTIVITY"} trans={[<a href={"https://gameplus.nineplus.sh/games"} target={"_blank"} rel={"noreferrer"}/>]}/>
        <button onClick={() => NiceModal.show(GamePLUSuggestModal)}>{t("SUGGEST_GAME")}</button>
    </>
}