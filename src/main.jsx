import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import './index.css'
import {AppContext} from "./contexts/AppContext.js";
import AuthenticationNeeded from "./routes/AuthenticationNeeded.jsx";
import Root from "./routes/Root.jsx";
import Client from "./routes/Client.jsx";

function App(props) {
    let [nyafile, setNyafile] = useState(null);
    let [loading, setLoading] = useState(true);

    return (
        <AppContext.Provider value={{loading, setLoading, nyafile, setNyafile}}>
            {props.children}
        </AppContext.Provider>
    )
}

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
    <React.StrictMode>
        <App>
            <RouterProvider router={router} />
        </App>
    </React.StrictMode>,
)
