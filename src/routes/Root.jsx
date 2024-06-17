import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import Loader from "./Loader.jsx";
import NyaFile from "@litdevs/nyalib";
import * as Sentry from "@sentry/react";
import LQ from "../util/LQ.js";
import localForage from "localforage";
import {useFlag, useUnleashContext} from '@unleash/proxy-client-react';
import {SettingsContext} from "../contexts/SettingsContext.js";

/**
 * The root. Wraps later routes so that Nyafiles can be real.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Root() {
    let appContext = useContext(AppContext);
    let {settings} = useContext(SettingsContext)
    const updateContext = useUnleashContext();
    const [loadingString, setLoadingString] = useState("LOADING_TRANSLATIONS");

    const hakase = useFlag("Q2_HakaseBittanBittan");
    const mio = useFlag("Q2_MioBittanBittan");

    useEffect(() => {
        async function loadNyafile() {
            let themePalette = await localForage.getItem("palette");
            if(!themePalette) {
                const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                themePalette = wantsDark ? "dark" : "light";
            }
            document.documentElement.classList.add(`theme-${themePalette}`);
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", async e => {
                if(await localForage.getItem("palette")) return;
                document.documentElement.classList.remove("theme-light", "theme-dark", "theme-hotdog");
                document.documentElement.classList.add(`theme-${e.matches ? "dark" : "light"}`);
            })

            document.documentElement.classList.add(`pride-${settings.PRIDE_FLAG}`);

            setLoadingString("LOADING_NYAFILE");

            const nyafile = new NyaFile();
            await nyafile.load("/quarky.nya", true);

            nyafile.queueCache("img/stars");
            nyafile.queueCache("img/quark_join");
            nyafile.queueCache("img/quarky");
            nyafile.queueCache("music/login");
            nyafile.queueCache("sfx/button-select");
            nyafile.queueCache("sfx/checkbox-false");
            nyafile.queueCache("sfx/checkbox-true");
            nyafile.queueCache("sfx/default-select");
            nyafile.queueCache("sfx/default-hover");
            nyafile.queueCache("sfx/error");
            nyafile.queueCache("sfx/info-modal-pop-in");
            nyafile.queueCache("sfx/info-modal-pop-out");
            nyafile.queueCache("sfx/purr");
            nyafile.queueCache("sfx/success");

            await nyafile.waitAllCached();
            appContext.setNyafile(nyafile);

            const localConfig = await localForage.getItem("lightquark")
            if(localConfig?.token) {
                const LQuserdata = await LQ("user/me");
                appContext.setAccounts(prev => ({...prev, "lightquark": LQuserdata.response.user}))
                updateContext({lqId: LQuserdata.response.user._id})
            }

            appContext.setLoading(false);
        }
        loadNyafile();
    }, []);

    if(appContext.loading) return <Loader loadingString={loadingString} />

    return <Sentry.ErrorBoundary fallback={
        <iframe src={`https://www.youtube-nocookie.com/embed/${
            hakase ? "5wS9lOHli0c" :
                mio ? "mXQb0P9A2jE" :
                    "x6LovY_DdEE"
        }?autoplay=1&rel=0&controls=0`} style={{position: "fixed", width: "100%", height: "100%"}} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
    } showDialog><Outlet /></Sentry.ErrorBoundary>
}