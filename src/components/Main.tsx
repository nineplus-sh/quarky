import {useContext} from "react";
import {AppContext} from "../contexts/AppContext.ts";
import Loader from "../screens/Loader.tsx";
import LoginScreen from "../screens/LoginScreen.tsx";

export default function Main() {
    let appContext = useContext(AppContext);

    if (appContext.loading) return <Loader/>
    if (!appContext.loading) return <LoginScreen/>
}