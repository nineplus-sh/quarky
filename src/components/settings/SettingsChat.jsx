import SettingsToggleBox from "./SettingsToggleBox.jsx";
import Message from "../dialogs/Message.jsx";
import ProfilePicture from "../ProfilePicture.jsx";
import {useContext, useMemo} from "react";
import {AppContext} from "../../contexts/AppContext.js";
import {useTranslation} from "react-i18next";

export default function SettingsChat() {
    const appContext = useContext(AppContext);
    const {t} = useTranslation();
    const richEmbedSamples = [
        "https://play.spotify.com/track/6zLfXq8Gbz6Z6aYk1LcgLR",
        "https://play.spotify.com/track/4TY0ecl4AEbkuK6aQhcFsH",
        "https://play.spotify.com/track/2JzzrNu4B3YZSnE3YWuzDk",
        "https://play.spotify.com/track/1YOXvTJluKQqrDxDg97Kwo",
        "https://play.spotify.com/track/1gOJ1WqxIGAjwXiY0zyaJq",
        "https://play.spotify.com/track/3filrFWJa0ecHVtJZANEzc",
        "https://open.spotify.com/track/3N2lo2io4biJvf5od9azJz",
        "https://www.youtube.com/watch?v=hJWSBBQ04XI"
    ];
    const sample = useMemo(() => richEmbedSamples[Math.floor(Math.random() * richEmbedSamples.length)], []);

    return <>
        <SettingsToggleBox setting={"RICH_EMBEDS"} trans={[<a href={"https://youtrack.litdevs.org/articles/q2-A-1"} target={"_blank"} rel={"noreferrer"}/>]}/>
        <Message username={t("SAMPLE_USER_NAME")} avatar={<ProfilePicture isMessage={true} src={appContext.nyafile.getCachedData("img/hakase_pfp")}/>}
                 content={sample} />
    </>
}