import {useParams} from "react-router-dom";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/AppContext.js";

export default function MessageInput() {
    let { dialogId } = useParams();
    let [message, setMessage] = useState("");
    const appContext = useContext(AppContext);

    return (<form onSubmit={async (e) => {
        e.preventDefault();
        await appContext.telegram.sendMessage(dialogId, {message: message});
    }}>
        <input type={"text"} onInput={(e) => setMessage(e.target.value)} />
        <input type={"submit"} />
    </form>)
}