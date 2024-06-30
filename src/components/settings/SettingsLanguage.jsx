import SettingsRadio from "./SettingsRadio.jsx";
import {Trans, useTranslation} from "react-i18next";
import locallangs from "../../util/locallangs.json"

export default function SettingsLanguage() {
    const languages = ["en", "fi", "nb_NO", "ja"];
    const {t} = useTranslation();

    return <>
        <p><Trans i18nKey={"SETTINGS_LANGUAGE_INVITE"} components={[<a href={"https://translit.litdevs.org/projects/quarky/quarky/"} target={"_blank"} rel={"noreferrer"}/>]}/></p>
        {languages.map(language => <SettingsRadio setting={"LANGUAGE"} value={language} key={language} externalIcon={`https://translit.litdevs.org/widget/quarky/quarky/${language}/88x31-grey.png`}
                                                    text={t("SETTINGS_LANGUAGE_FORMAT", {localname: locallangs[language], translatedname: t(`SETTING_LANGUAGE_${language.toUpperCase()}`)})}/>)}
    </>
}