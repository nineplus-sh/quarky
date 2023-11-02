import TelegramDMSelector from "../components/telegram/nav/TelegramDMSelector.jsx";
import {Outlet} from "react-router-dom";

/**
 * The client screen.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Client() {
    return (<>
        <Outlet />
        <TelegramDMSelector />
    </>)
}