import SettingsToggleBox from "./SettingsToggleBox.jsx";
import Message from "../dialogs/Message.jsx";
import ProfilePicture from "../dialogs/ProfilePicture.jsx";
import {useContext, useMemo} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useTranslation} from "react-i18next";
import NyafileImage from "../nyafile/NyafileImage.jsx";
import styles from "./UserSettingsChat.module.css"
import richEmbedSamples from "../../util/richEmbedSamples.js";
import Button from "../nav/Button.jsx";

export default function UserSettingsChat() {
    const appContext = useContext(AppContext);
    const {t} = useTranslation();
    const sample = useMemo(() => richEmbedSamples[Math.floor(Math.random() * richEmbedSamples.length)], []);

    return <>
        <SettingsToggleBox setting={"RICH_EMBEDS"} trans={[<a href={"https://youtrack.litdevs.org/articles/q2-A-1"} target={"_blank"} rel={"noreferrer"}/>]}/>
        <Message username={t("SAMPLE_USER_NAME")} avatarUri={appContext.nyafile.getCachedData("img/hakase_pfp")}
                 content={`${t("SAMPLE_USER_MESSAGE_RICH_EMBEDS", {link: null})}${sample}`} />

        {window.hiddenside ? <><hr/>
            <p>{t("SETTING_RICH_EMBEDS_ENHANCEMENTS")}</p>
            <div className={styles.enhancementList}>
                <RichEmbedEnhancement service={"spotify"} url={"https://accounts.spotify.com/login"}/>
                <RichEmbedEnhancement service={"tumblr"} url={"https://www.tumblr.com/login"}/>
                <RichEmbedEnhancement service={"youtube"} url={"https://accounts.google.com/ServiceLogin?service=youtube&continue=https://www.youtube.com/signin?action_handle_signin=true"}/>
            </div>
        </> : null}
    </>
}

export function RichEmbedEnhancement({service, url, width}) {
    const {t} = useTranslation();
    return <div className={styles.enhancementUpsell}>
        <span className={styles.enhancementUpsellTitle}>
            <NyafileImage src={`img/${service}`} alt={service} inlinesvg={true}/>
            <span> {t(`SETTING_RICH_EMBEDS_ENHANCEMENT_${service.toUpperCase()}`)}</span>
        </span>

        <Button onClick={() => window.open(url, "_blank", "popup=true,width=500")}>
            {t("SIGN_IN")}
        </Button>
    </div>
}
