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
import {AppContext} from "./contexts/AppContext.js";
import AuthenticationNeeded from "./routes/AuthenticationNeeded.jsx";
import Root from "./routes/Root.jsx";
import Client from "./routes/Client.jsx";
import ChannelView from "./components/nav/ChannelView.jsx";
import Dialog from "./components/nav/Dialog.jsx";
import * as Sentry from "@sentry/react";
import {FlagProvider} from '@unleash/proxy-client-react';

Sentry.init({
    dsn: "https://901c666ed03942d560e61928448bcf68@sentry.yggdrasil.cat/5",
    tunnel: "https://quarky.skin/diagtun",
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
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
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
    let [music, setMusic] = useState(undefined);
    let [telegram, setTelegram] = useState(undefined);
    let [accounts, setAccounts] = useState({})
    let [messageCache, setMessageCache] = useState({})

    return (
        <AppContext.Provider value={{loading, setLoading, nyafile, setNyafile, music, setMusic, telegram, setTelegram, accounts, setAccounts, messageCache, setMessageCache}}>
            <audio src={music} autoPlay={true} loop={true}></audio>
            {props.children}
        </AppContext.Provider>
    )
}

/* The router. In the words of Emilia, it routes. Wow... */
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);
const router = sentryCreateBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path="/" element={<AuthenticationNeeded />}>
                <Route path="/" element={<Client />} >
                    <Route path="/:quarkId" element={<ChannelView />} >
                        <Route path="/:quarkId/:dialogId" element={<Dialog />} />
                    </Route>
                </Route>
            </Route>
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
            <FlagProvider config={unleashConfig}>
                    <App>
                        <RouterProvider router={router} />
                    </App>
            </FlagProvider>
    //</React.StrictMode>,
)
