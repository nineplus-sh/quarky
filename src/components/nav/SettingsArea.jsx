import {AppContext} from "../../contexts/AppContext.js";
import {useContext} from "react";
import SettingsProfile from "../_services/lightquark/settings/SettingsProfile.jsx";

export default function SettingsArea({area}) {
    if (area === "profile") {
        return <SettingsProfile/>
    }
}