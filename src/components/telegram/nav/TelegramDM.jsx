import TelegramProfilePicture from "../TelegramProfilePicture.jsx";

/**
 * A Telegram DM.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramDM({name, photo, peer}) {
    return (<>
        {photo && photo.className !== "ChatPhotoEmpty" ? <TelegramProfilePicture photo={photo} peer={peer} /> : ""}
        <span> {name}</span>
    </>)
}