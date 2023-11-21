import {Outlet} from "react-router-dom";
import {AppContext} from "../contexts/AppContext.js";
import {useContext, useEffect} from "react";
import Loader from "./Loader.jsx";
import NyaFile from "@litdevs/nyalib";
import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import localforage from "localforage";
import { NewMessage } from "telegram/events";
import * as Sentry from "@sentry/react";

/**
 * The root. Wraps later routes so that Nyafiles can be real.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Root() {
    let appContext = useContext(AppContext);

    function newMessageHandler(event) {
        let source = event.message.chatId.value;
        appContext.setMessageCache(previousValue => {
            previousValue = { ...previousValue }
            if(!previousValue[source]) previousValue[source] = [];
            previousValue[source].push(event.message)
            return previousValue;
        });
    }

    useEffect(() => {
        async function loadNyafile() {
            const telegramClient = new TelegramClient(new StringSession(await localforage.getItem("TG_SESSION")), parseInt(import.meta.env.VITE_TG_API_ID), import.meta.env.VITE_TG_API_HASH, { connectionRetries: 5 });
            appContext.setTelegram(telegramClient);
            await telegramClient.connect();

            if(await telegramClient.isUserAuthorized()) appContext.setAccounts({telegram: await telegramClient.getMe()})
            telegramClient.addEventHandler(newMessageHandler, new NewMessage({}));

            const nyafile = new NyaFile();
            await nyafile.load("/quarky.nya", true);

            nyafile.queueCache("data/licenses", "text");
            nyafile.queueCache("img/daturyok")
            nyafile.queueCache("img/stars");
            nyafile.queueCache("img/quarky");
            nyafile.queueCache("music/login");
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
    return <Sentry.ErrorBoundary fallback={<p>An error has occurred :(</p>} showDialog><Outlet /></Sentry.ErrorBoundary>
}