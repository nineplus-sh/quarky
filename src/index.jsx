import {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements, matchRoutes,
    Route,
    RouterProvider, useLocation,
    useNavigationType
} from "react-router-dom";
import './index.css'
import {AppContext, defaultSettings} from "./contexts/AppContext.js";
import AuthenticationNeeded from "./routes/AuthenticationNeeded.jsx";
import Root from "./routes/Root.jsx";
import ClientWrapper from "./routes/ClientWrapper.jsx";
import QuarkView from "./routes/QuarkView.jsx";
import ChannelView from "./routes/ChannelView.jsx";
import * as Sentry from "@sentry/react";
import {FlagProvider} from '@unleash/proxy-client-react';
import NiceModal from '@ebay/nice-modal-react';
import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import holidays from './util/holidays.json';
import MainView from "./routes/MainView.jsx";
import localForage from "localforage";
import LQ from "./util/LQ.js";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";
import {version} from "../package.json";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import DemoView from "./routes/DemoView.jsx";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

Sentry.init({
    dsn: "https://901c666ed03942d560e61928448bcf68@sentry.yggdrasil.cat/5",
    //tunnel: "https://quarky.skin/diagtun",
    environment: import.meta.env.MODE || "development",
    integrations: [
        new Sentry.BrowserTracing({
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost"],
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromElements,
                matchRoutes
            ),
        }),
        new Sentry.Replay({
            useCompression: false
        }),
        Sentry.browserProfilingIntegration()
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    profilesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    enabled: import.meta.env.MODE === "production"
});

const unleashConfig = {
    url: "https://feature-gacha.litdevs.org/api/frontend", // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
    clientKey: import.meta.env.MODE === "production" ? "default:production.da748f8d265a85d1b487cd21ab7ead43596aaeb8f7b3f5a70f606457" : "default:development.1166a6d9ad3507ff9e5df9e0ee2a308a449da96f191909e97f00f2f2", // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
    refreshInterval: 15, // How often (in seconds) the client should poll the proxy for updates
    appName: 'quarky2', // The name of your application. It's only used for identifying your application
};

/**
 * Wraps the route provider in an App, mainly so the app context can be real.
 * @param props - The props of the component, provided by React.
 * @returns {JSX.Element}
 * @constructor
 */
export function App(props) {
    let [nyafile, setNyafile] = useState(null);
    let [loading, setLoading] = useState(true);
    let [translationsLoading    , setTranslationsLoading] = useState(true);
    let [messageCache, setMessageCache] = useState({});
    let [userCache, setUserCache] = useState({});
    let [holiday, setHoliday] = useState("");
    let [settings, setSettings] = useState(defaultSettings);
    let [drafts, setDrafts] = useState({});
    let [quarkCache, setQuarkCache] = useState({});
    let [quarkList, setQuarkList] = useState([]);
    let [apiKeys, setApiKeys] = useState({});

    useEffect(() => {
        async function loadConfigs() {
            const storedSettings = await localForage.getItem("settings")
            if(storedSettings) {
                setSettings({...defaultSettings, ...storedSettings})
            }

            await loadTranslations();
        }
        async function loadTranslations() {
            const languages = import.meta.glob('./langs/*.json');

            await i18next
                .use(initReactI18next)
                .use(resourcesToBackend((language, namespace, callback) => {
                    if (languages[`./langs/${language}.json`]) {
                        languages[`./langs/${language}.json`]().then((lang) => callback(null, lang))
                    } else {
                        callback("This is not a language supported by Quarky! :cat2:", null)
                    }
                }))
                .use(LanguageDetector)
                .init({
                    fallbackLng: 'en',
                    debug: true
                })

            await setThatHoliday();
            setTranslationsLoading(false);
        }
        async function setThatHoliday(){
            let validHolidays = [];
            const currentTime = new Date();
            const currentMonth = currentTime.toLocaleString('en-US', { month: 'long' }).toLowerCase();
            const currentDay = currentTime.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
            const currentDate = currentTime.toLocaleString('en-US', { month: '2-digit', day: '2-digit' }).replace("/","-");;

            Object.entries(holidays).forEach(([date, holiday]) => {
                if(date === currentDay || date === currentMonth || date === currentDate) {
                    validHolidays.push(...holiday);
                }
            })

            setHoliday(validHolidays[Math.floor(Math.random() * validHolidays.length)]);
        }
        loadConfigs();
    }, []);

    async function saveSettings(toBeWritten, cloud = true) {
        setSettings({...settings, ...toBeWritten});
        localForage.setItem("settings", {...settings, ...toBeWritten});

        if(cloud && apiKeys.accessToken) {
            Object.entries(toBeWritten).forEach(([key, value]) => {
                LQ(`user/me/preferences/quarky/${key}`, "POST", {
                    value: typeof value === "object" ? Object.values(value).filter(vvalue => vvalue !== undefined).length === 0 ? null : JSON.stringify(value) : value
                })
            })
        }
    }

    const axiosClient = axios.create({
        baseURL: apiKeys.baseURL + "/v4/",
        headers: {
            "lq-agent": `Quarky/${version}`
        }
    })
    axiosClient.interceptors.request.use(config => {
        if (apiKeys.accessToken) {
            config.headers.Authorization = `Bearer ${apiKeys.accessToken}`;
        }
        return config;
    });
    createAuthRefreshInterceptor(axiosClient, async function() {
        return axiosClient.post("auth/refresh",
            {accessToken: apiKeys.accessToken, refreshToken: apiKeys.refreshToken}, {skipAuthRefresh: true})
            .then(async (response) => {
                setApiKeys({...apiKeys, accessToken: response.accessToken})
                await localForage.setItem("lightquark", {
                    network: {
                        baseUrl: apiKeys.baseURL
                    },
                    token: response.accessToken,
                    refreshToken: apiKeys.refreshToken
                });
            })
    })
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn: async ({queryKey}) => {
                    return (await axiosClient.get(queryKey[0])).data.response
                },
                retry: false,
            },
        }
    });

    return (
        <AppContext.Provider value={{
            loading, setLoading, holiday,
            nyafile, setNyafile,
            messageCache, setMessageCache,
            userCache, setUserCache,
            drafts, setDrafts,
            settings, setSettings, saveSettings,
            apiKeys, setApiKeys,
            quarkCache, setQuarkCache, quarkList, setQuarkList
        }}>
            <QueryClientProvider client={queryClient}>
                {translationsLoading ? null : props.children}
            </QueryClientProvider>
        </AppContext.Provider>
    )
}

/* The router. In the words of Emilia, it routes. Wow... */
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);
export const router = sentryCreateBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path="/demo/:quarkId?/:channelId?" element={<DemoView />} />

            <Route path="/" element={<AuthenticationNeeded />}>
                <Route path="/" element={<ClientWrapper />}>
                    <Route path="/" element={<MainView />}>
                        <Route path="/:quarkId" element={<QuarkView />} >
                            <Route path="/:quarkId/:dialogId" element={<ChannelView />} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Route>
    )
)

const ProfiledApp = Sentry.withProfiler(App);
ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
        <FlagProvider config={unleashConfig}>
            <ProfiledApp>
                <ReactQueryDevtools initialIsOpen={false} />
                <NiceModal.Provider>
                    <RouterProvider router={router} />
                </NiceModal.Provider>
            </ProfiledApp>
        </FlagProvider>
    //</React.StrictMode>,
)
