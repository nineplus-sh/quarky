import UserSettingsProfile from "../_services/lightquark/settings/UserSettingsProfile.jsx";
import UserSettingsChat from "./UserSettingsChat.jsx";
import UserSettingsPlaying from "./UserSettingsPlaying.jsx";
import UserSettingsPrideFlag from "./UserSettingsPrideFlag.jsx";
import UserSettingsLanguage from "./UserSettingsLanguage.jsx";
import UserSettingsNetworkInformation from "./UserSettingsNetworkInformation.jsx";

export default function UserSettingsArea({area}) {
    if (area === "profile") {
        return <UserSettingsProfile/>
    } else if (area === "chat") {
        return <UserSettingsChat/>
    } else if (area === "playing") {
        return <UserSettingsPlaying/>
    } else if (area === "pride") {
        return <UserSettingsPrideFlag/>
    } else if (area === "language") {
        return <UserSettingsLanguage/>
    } else if (area === "netinfo") {
        return <UserSettingsNetworkInformation/>
    }
}