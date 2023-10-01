import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect} from "react";
import Loader from "./Loader.jsx";
import NyaFile from "@litdevs/nyalib";

export default function Root() {
    let appContext = useContext(AppContext);

    useEffect(() => {
        async function loadNyafile() {
            const nyafile = new NyaFile();
            await nyafile.load("/quarky.nya", true);

            nyafile.queueCache("img/stars");

            await nyafile.waitAllCached();
            appContext.setNyafile(nyafile);
            appContext.setLoading(false);
        }
        loadNyafile();
    }, []);

    if(appContext.loading) return <Loader />
    return <Outlet />
}