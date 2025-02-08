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
import useSettings from "../components/_services/lightquark/hooks/useSettings.js";
import useOnceWhen from "../util/useOnceWhen.js";
import {availableFlags} from "../components/settings/UserSettingsPrideFlag.jsx";

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

    const {data: settings, refetch: refetchSettings, isSuccess: settingsReady} = useSettings();

    useOnceWhen(settingsReady, true, async () => {
        let themePalette = settings.PALETTE;
        if(!themePalette) {
            const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            themePalette = wantsDark ? "dark" : "light";
        }
        document.documentElement.classList.add(`theme-${themePalette}`);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", async e => {
            if(settings.PALETTE) return;
            document.documentElement.classList.remove("theme-light", "theme-dark", "theme-hotdog");
            document.documentElement.classList.add(`theme-${e.matches ? "dark" : "light"}`);
        })

        document.documentElement.classList.add(`pride-${settings.PRIDE_FLAG}`);

        setLoadingString("LOADING_NYAFILE");

        const nyafile = new NyaFile();

        try {
            const nyafileBlob = await axios.get("/quarky.nya", {
                onDownloadProgress: progressEvent => {
                    setLoadingPercentage(progressEvent.loaded / progressEvent.total * 100);
                    setLoadingPercentageText(`${byteSize(progressEvent.loaded, {units: 'iec'})}/${byteSize(progressEvent.total, {units: 'iec'})}`)
                },
                responseType: "arraybuffer"
            })
            await nyafile.load(nyafileBlob.data, true);
        } catch(e) {
            setLoadingString("ERROR_NYAFILE");
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
    })

    useEffect(() => {
        if(!settings || !settings.LANGUAGE) return;
        i18n.changeLanguage(settings?.LANGUAGE)
    }, [settings?.LANGUAGE])
    useEffect(() => {
        if(!settings || !settings.PRIDE_FLAG) return;
        document.documentElement.classList.remove(...availableFlags.map(flag => `pride-${flag}`)); // TODO: Make less clunky
        document.documentElement.classList.add(`pride-${settings.PRIDE_FLAG}`);
    }, [settings?.PRIDE_FLAG]);

    if(appContext.loading) return <Loader loadingString={loadingString} progress={loadingPercentage} progressString={loadingPercentageText}/>

    return <Outlet />
}