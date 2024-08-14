import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect, useState} from "react";
import Loader from "./Loader.jsx";
import NyaFile from "@litdevs/nyalib";
import * as Sentry from "@sentry/react";
import LQ from "../util/LQ.js";
import localForage from "localforage";
import {useFlag, useUnleashContext} from '@unleash/proxy-client-react';
import * as i18n from "i18next";
import NiceModal from "@ebay/nice-modal-react";
import NetworkOfflineModal from "../components/modals/NetworkOfflineModal.jsx";
import WooScreen from "./WooScreen.jsx";

/**
 * The root. Wraps later routes so that Nyafiles can be real.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Root() {
    let appContext = useContext(AppContext);
    const updateContext = useUnleashContext();
    const [loadingString, setLoadingString] = useState("LOADING_TRANSLATIONS");

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
                await nyafile.load("/quarky.nya", true);

                nyafile.queueCache("img/hakase_pfp");
                nyafile.queueCache("img/stars");
                nyafile.queueCache("img/quark_join");
                nyafile.queueCache("img/quarky");
                nyafile.queueCache("music/login");
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
                if(e.message.includes("not found in default nyafile")) {
                    setLoadingString(`ERROR_NYAFILE_FILE_MISSING_${import.meta.env.PROD ? "PROD" : "DEV"}`)
                } else {
                    setLoadingString("ERROR_NYAFILE");
                }
                Sentry.captureException(e);
                return;
            }

            appContext.setNyafile(nyafile);

            const localConfig = await localForage.getItem("lightquark")
            if(localConfig?.token) {
                setLoadingString("LOADING_WEBSOCKET");

                let LQuserdata;
                try {
                    LQuserdata = await LQ("user/me");
                } catch(e) {
                    await NiceModal.show(NetworkOfflineModal, {name: localConfig.network.baseUrl,   signOut: true});
                }
                appContext.setAccounts(prev => ({...prev, "lightquark": LQuserdata.response.user}))
                updateContext({lqId: LQuserdata.response.user._id})
            }

            appContext.setLoading(false);
        }
        loadNyafile();
    }, []);

    useEffect(() => {
        i18n.changeLanguage(appContext.settings.LANGUAGE)
    }, [appContext.settings.LANGUAGE])

    if(appContext.loading) return <Loader loadingString={loadingString} />

    return <Sentry.ErrorBoundary fallback={<WooScreen/>}><Outlet /></Sentry.ErrorBoundary>
}