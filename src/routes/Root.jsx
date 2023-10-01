import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect} from "react";
import Loader from "./Loader.jsx";
import {loadAsync as loadZip} from "jszip";

export default function Root() {
    let appContext = useContext(AppContext);

    useEffect(() => {
        async function fetchNyafile() {
            const nyafileResponse = await fetch("/quarky.nya");
            const nyafileBlob = await nyafileResponse.blob();
            const nyafile = await loadZip(nyafileBlob);
            appContext.setNyafile(nyafile);
            appContext.setLoading(false);
        }
        fetchNyafile();
    }, []);

    if(appContext.loading) return <Loader />
    return <Outlet />
}