import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import Loader from "./Loader.jsx";
import NyaFile from "@litdevs/nyalib";
import * as Sentry from "@sentry/react";
import localForage from "localforage";
import * as i18n from "i18next";
import WooScreen from "./WooScreen.jsx";
import axios from "axios";
import byteSize from "byte-size";

/**
 * The root. Wraps later routes so that Nyafiles can be real.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Root() {
    let appContext = useContext(AppContext);
    const [loadingString, setLoadingString] = useState("LOADING_TRANSLATIONS");
    const [loadingPercentage, setLoadingPercentage] = useState(null);
    const [loadingPercentageText, setLoadingPercentageText] = useState("");

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

            document.documentElement.classList.add(`pride-${appContext.settings.PRIDE_FLAG}`);

            setLoadingString("LOADING_NYAFILE");

            const nyafile = new NyaFile();

            try {
                const nyafileBlob = await axios.get("/quarky.nya", {
                    onDownloadProgress: progressEvent => {
                        setLoadingPercentage(progressEvent.loaded / progressEvent.total * 100);
                        setLoadingPercentageText(`${byteSize(progressEvent.loaded, {units: 'iec'})}/${byteSize(progressEvent.total, {units: 'iec'})}`)
                    },
                    responseType: "blob"
                })
                await nyafile.load(nyafileBlob.data, true);

                setLoadingPercentage(0);

                nyafile.queueCache("img/hakase_pfp");
                nyafile.queueCache("img/stars");
                nyafile.queueCache("img/quark_join");
                nyafile.queueCache("img/quarky");
                nyafile.queueCache("music/login");
                nyafile.queueCache("sfx/crossfade");
                nyafile.queueCache("sfx/purr");

                nyafile.queueCache("sfx/button-hover");
                nyafile.queueCache("sfx/button-select");
                nyafile.queueCache("sfx/button-sidebar-hover");
                nyafile.queueCache("sfx/button-sidebar-select");
                nyafile.queueCache("sfx/checkbox-false");
                nyafile.queueCache("sfx/checkbox-true");
                nyafile.queueCache("sfx/default-select");
                nyafile.queueCache("sfx/default-hover");
                nyafile.queueCache("sfx/dialog-cancel-select");
                nyafile.queueCache("sfx/dialog-dangerous-select");
                nyafile.queueCache("sfx/dialog-pop-in");
                nyafile.queueCache("sfx/error");
                nyafile.queueCache("sfx/info-modal-pop-in");
                nyafile.queueCache("sfx/info-modal-pop-out");
                nyafile.queueCache("sfx/purr");
                nyafile.queueCache("sfx/success");

                await nyafile.waitAllCached();
            } catch(e) {
                console.log(e)
                if(e.message.includes("not found in default nyafile")) {
                    setLoadingString(`ERROR_NYAFILE_FILE_MISSING_${import.meta.env.PROD ? "PROD" : "DEV"}`)
                } else {
                    setLoadingString("ERROR_NYAFILE");
                }
                Sentry.captureException(e);
                return;
            } finally {
                setLoadingPercentage(0);
            }

            appContext.setNyafile(nyafile);

            const localConfig = await localForage.getItem("lightquark")
            if(localConfig?.token) {
                appContext.setApiKeys(prevApiKeys => ({
                    ...prevApiKeys,
                    baseURL: localConfig.network.baseUrl,
                    accessToken: localConfig.token,
                    refreshToken: localConfig.refreshToken
                }))
            }

            appContext.setLoading(false);
        }
        loadNyafile();
    }, []);

    useEffect(() => {
        i18n.changeLanguage(appContext.settings.LANGUAGE)
    }, [appContext.settings.LANGUAGE])

    if(appContext.loading) return <Loader loadingString={loadingString} progress={loadingPercentage} progressString={loadingPercentageText}/>

    return <Sentry.ErrorBoundary fallback={<WooScreen/>}><Outlet /></Sentry.ErrorBoundary>
}