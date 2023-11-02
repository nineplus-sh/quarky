import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";

export default function Dialog() {
    const appContext = useContext(AppContext);

    return <h1>Fuckin dialog!! rawr</h1>
}