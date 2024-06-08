import {AppContext} from "../../contexts/AppContext.js";
import {useContext} from "react";
import ProfilePicture from "../ProfilePicture.jsx";

export default function SettingsArea({area}) {
    const appContext = useContext(AppContext)
    if (area === "profile") {
        return <span>Lalalalala this is the profile area</span>
    }
}