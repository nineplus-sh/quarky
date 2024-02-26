import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext, useEffect, useRef, useState} from "react";
import QRCodeStyling from "qr-code-styling";
import localforage from "localforage";
import * as Sentry from "@sentry/react";
import {useUnleashContext} from "@unleash/proxy-client-react";
import {t} from "i18next";


// i love u
function base64url_encode(buffer) {
    return btoa(Array.from(new Uint8Array(buffer), b => String.fromCharCode(b)).join(''))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * A sign-in QR code to be scanned by Telegram apps.
 * @returns {JSX.Element}
 * @constructor
 */
export default function TelegramQRCode() {
    const appContext = useContext(AppContext);
    const updateContext = useUnleashContext();
    const [url, setUrl] = useState(null);
    const ref = useRef(null);
    let [qrCode, setQrCode] = useState()

    useEffect(() => {
        (async () => {
            try {
                await appContext.telegram.connect()
                const user = await appContext.telegram.signInUserWithQrCode({
                    apiId: parseInt(import.meta.env.VITE_TG_API_ID),
                    apiHash: import.meta.env.VITE_TG_API_HASH
                }, {
                    qrCode: async (code) => {
                        setUrl(`tg://login?token=${base64url_encode(code.token)}`);
                    }
                })
                await localforage.setItem("TG_SESSION", appContext.telegram.session.save())
                appContext.setAccounts({telegram: user});
                updateContext({telegramId: user.id.value})
            } catch(e) {
                if(e.message === "Account has 2FA enabled.") {
                    const user = await appContext.telegram.signInWithPassword({
                        apiId: parseInt(import.meta.env.VITE_TG_API_ID),
                        apiHash: import.meta.env.VITE_TG_API_HASH
                    }, {
                        password: function(hint){return prompt(`Your account has Telegram 2FA enabled. Please enter your password.\nHint: ${hint}`);},
                        onError: function(e) {console.log(e);Sentry.captureException(e);alert("Failed to log in. This error has been reported to Quarky developers.");}
                    })
                    await localforage.setItem("TG_SESSION", appContext.telegram.session.save())
                    appContext.setAccounts({telegram: user});
                    updateContext({telegramId: user.id.value})
                } else {
                    console.log(e);
                    Sentry.captureException(e);
                    alert("Failed to log in. This error has been reported to Quarky developers.");
                }
            }
        })()
    }, []);

    useEffect(() => {
        (async () => {
            setQrCode(new QRCodeStyling({
                width: 300,
                height: 300,
                image: await appContext.nyafile.getAssetDataUrl("img/quarky"),
                dotsOptions: {
                    color: "#00a8f3",
                    type: "classy"
                },
                imageOptions: {
                    margin: 3
                },
            }));
        })()
    }, [])

    useEffect(() => {
        if (!qrCode) return;
        qrCode.append(ref.current);
    }, [qrCode]);

    useEffect(() => {
        if (!qrCode) return;
        qrCode.update({
            data: url
        });
    }, [url, qrCode]);

    return (<><div ref={ref}/>{url ? "" : <p>{t("TELEGRAM_CONNECTING")}</p>}</>)
}