import styles from "./MainView.module.css";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";
import JoinQuark from "../components/_services/lightquark/nav/JoinQuark.jsx";
import {Outlet} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import GenericQuark from "../components/nav/GenericQuark.jsx";

export default function MainView() {
    const { data, isLoading } = useQuery({queryKey: ['quark']});
    const {t} = useTranslation();

    return <>
        <div className={styles.quarkList}>
            {isLoading ? <GenericQuark name={t("LOADING_QUARKS")}/> : <QuarkList list={data.quarks}/>}
            <JoinQuark/>
        </div>
        <Outlet/>
    </>
}