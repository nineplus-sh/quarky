import {useState} from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import {AppContext} from "./contexts/AppContext.js";
import AuthenticationNeeded from "./routes/AuthenticationNeeded.jsx";
import Root from "./routes/Root.jsx";
import Client from "./routes/Client.jsx";
import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";

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
    let [telegram] = useState(new TelegramClient(new StringSession(''), parseInt(import.meta.env.VITE_TG_API_ID), import.meta.env.VITE_TG_API_HASH, { connectionRetries: 5 }));

    return (
        <AppContext.Provider value={{loading, setLoading, nyafile, setNyafile, music, setMusic, telegram}}>
            <audio src={music} autoPlay={true} loop={true}></audio>
            {props.children}
        </AppContext.Provider>
    )
}

/* The router. In the words of Emilia, it routes. Wow... */
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path="/" element={<AuthenticationNeeded />}>
                <Route path="/" element={<Client />}  />
            </Route>
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
        <App>
            <RouterProvider router={router} />
        </App>
    //</React.StrictMode>,
)
