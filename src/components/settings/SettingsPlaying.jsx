import SettingsToggleBox from "./SettingsToggleBox.jsx";

export default function SettingsPlaying() {
    return <>
        <SettingsToggleBox setting={"GAME_ACTIVITY"} trans={[<a href={"https://gameplus.nineplus.sh/games"} target={"_blank"} rel={"noreferrer"}/>]}/>
    </>
}