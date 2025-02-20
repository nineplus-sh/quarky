import WooScreen from "./WooScreen.jsx";
import {Outlet} from "react-router-dom";
import * as Sentry from "@sentry/react";

export default function SentryWrap() {
    return <Sentry.ErrorBoundary fallback={<WooScreen/>}><Outlet/></Sentry.ErrorBoundary>
}