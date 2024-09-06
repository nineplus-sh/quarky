import SettingsRadio from "./SettingsRadio.jsx";
import {Trans, useTranslation} from "react-i18next";
import locallangs from "../../util/locallangs.json"

export default function UserSettingsLanguage() {
    const languages = ["en", "fi", "nb_NO", "ja"];
    const jokeLanguages = ["en_UWU", "ja_KANA"];
    const {t} = useTranslation();

    function langmap(languages) {
        return languages.map(language => <SettingsRadio setting={"LANGUAGE"} value={language} key={language}
                                                        externalIcon={`https://translit.litdevs.org/widget/quarky/quarky/${language}/88x31-grey.png`}
                                                        text={locallangs[language] === t(`SETTING_LANGUAGE_${language.toUpperCase()}`) ?
                                                            locallangs[language] :
                                                            t("SETTINGS_LANGUAGE_FORMAT", {
                                                                localname: locallangs[language], translatedname: t(`SETTING_LANGUAGE_${language.toUpperCase()}`)
                                                            })}/>)
    }

    return <>
        <p><Trans i18nKey={"SETTINGS_LANGUAGE_INVITE"} components={[<a href={"https://translit.litdevs.org/projects/quarky/quarky/"} target={"_blank"} rel={"noreferrer"}/>]}/></p>
        {langmap(languages)}
        <hr/>
        {langmap(jokeLanguages)}
    </>
}