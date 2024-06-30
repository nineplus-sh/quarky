import SettingsProfile from "../_services/lightquark/settings/SettingsProfile.jsx";
import SettingsChat from "../settings/SettingsChat.jsx";
import SettingsPlaying from "../settings/SettingsPlaying.jsx";
import SettingsAppearance from "../settings/SettingsAppearance.jsx";
import SettingsLanguage from "../settings/SettingsLanguage.jsx";

export default function SettingsArea({area}) {
    if (area === "profile") {
        return <SettingsProfile/>
    } else if (area === "chat") {
        return <SettingsChat/>
    } else if (area === "playing") {
        return <SettingsPlaying/>
    } else if (area === "appearance") {
        return <SettingsAppearance/>
    } else if (area === "language") {
        return <SettingsLanguage/>
    }
}