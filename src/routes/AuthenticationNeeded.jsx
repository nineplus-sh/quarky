import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";
import changeMusic from "../components/nyafile/NyafileChangeMusic.js";
import TelegramQRCode from "../components/telegram/login/TelegramQRCode.jsx";

/**
 * The authentication needed ("login") screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function AuthenticationNeeded() {
    changeMusic("music/login");

    return (<>
        <SpaceBackground />
        <Header title={"Welcome to Quarky~"} description={"Let's sign in to use it now!"}></Header>

        <TelegramQRCode />
    </>)
}