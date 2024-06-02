import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect} from "react";
import Loader from "./Loader.jsx";
import NyaFile from "@litdevs/nyalib";
import localforage from "localforage";
import * as Sentry from "@sentry/react";
import LQ from "../util/LQ.js";
import localForage from "localforage";
import {useFlag, useUnleashContext} from '@unleash/proxy-client-react';
import i18next from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

/**
 * The root. Wraps later routes so that Nyafiles can be real.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Root() {
    let appContext = useContext(AppContext);
    const updateContext = useUnleashContext();

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

            const localConfig = await localForage.getItem("lightquark")
            if(localConfig?.token) {
                const LQuserdata = await LQ("user/me");
                appContext.setAccounts(prev => ({...prev, "lightquark": LQuserdata.response.user}))
                updateContext({lqId: LQuserdata.response.user._id})
            }

            const nyafile = new NyaFile();
            await nyafile.load("/quarky.nya", true);

            const languages = import.meta.glob('../langs/*.json');

            await i18next
                .use(initReactI18next)
                .use(resourcesToBackend((language, namespace, callback) => {
                    if(languages[`../langs/${language}.json`]) {
                        languages[`../langs/${language}.json`]().then((lang) => callback(null, lang))
                    } else {
                        callback("This is not a language supported by Quarky! :cat2:", null)
                    }
                }))
                .use(LanguageDetector)
                .init({
                    fallbackLng: 'en',
                    debug: true
                })

            nyafile.queueCache("img/stars");
            nyafile.queueCache("img/quark_join");
            nyafile.queueCache("img/quarky");
            nyafile.queueCache("music/login");
            nyafile.queueCache("sfx/button-select");
            nyafile.queueCache("sfx/default-select");
            nyafile.queueCache("sfx/default-hover");
            nyafile.queueCache("sfx/error");
            nyafile.queueCache("sfx/info-modal-pop-in");
            nyafile.queueCache("sfx/info-modal-pop-out");
            nyafile.queueCache("sfx/purr");

            await nyafile.waitAllCached();
            appContext.setNyafile(nyafile);
            appContext.setLoading(false);
        }
        loadNyafile();
    }, []);

    if(appContext.loading) return <Loader />

    return <Sentry.ErrorBoundary fallback={
        <iframe src={`https://www.youtube-nocookie.com/embed/${
            hakase ? "5wS9lOHli0c" :
                mio ? "mXQb0P9A2jE" :
                    "x6LovY_DdEE"
        }?autoplay=1&rel=0&controls=0`} style={{position: "fixed", width: "100%", height: "100%"}} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
    } showDialog><Outlet /></Sentry.ErrorBoundary>
}