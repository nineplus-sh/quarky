import UserSettingsProfile from "../_services/lightquark/settings/UserSettingsProfile.jsx";
import UserSettingsChat from "../settings/UserSettingsChat.jsx";
import UserSettingsPlaying from "../settings/UserSettingsPlaying.jsx";
import UserSettingsAppearance from "../settings/UserSettingsAppearance.jsx";
import UserSettingsLanguage from "../settings/UserSettingsLanguage.jsx";
import UserSettingsNetworkInformation from "../settings/UserSettingsNetworkInformation.jsx";

export default function UserSettingsArea({area}) {
    if (area === "profile") {
        return <UserSettingsProfile/>
    } else if (area === "chat") {
        return <UserSettingsChat/>
    } else if (area === "playing") {
        return <UserSettingsPlaying/>
    } else if (area === "appearance") {
        return <UserSettingsAppearance/>
    } else if (area === "language") {
        return <UserSettingsLanguage/>
    } else if (area === "netinfo") {
        return <UserSettingsNetworkInformation/>
    }
}