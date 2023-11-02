import {AppContext} from "../../../contexts/AppContext.js";
import {useContext, useLayoutEffect, useState} from "react";
import TelegramDM from "./TelegramDM.jsx";


/**
 * Allows you to select a Telegram DM.
 * @returns {Array[JSX.Element]}
 * @constructor
 */
export default function TelegramDMSelector() {
    const appContext = useContext(AppContext);
    const [dms, setDms] = useState([])

    useLayoutEffect(() => {
        (async () => {
            setDms(await appContext.telegram.getDialogs({}));
            console.log((await appContext.telegram.getDialogs({}))[0])
        })()
    }, []);

    return dms.map((dm) => <TelegramDM name={dm.name} photo={dm.entity.photo} key={dm.id.value} peer={dm.inputEntity} message={dm.message.message} id={dm.id.value} />)
}