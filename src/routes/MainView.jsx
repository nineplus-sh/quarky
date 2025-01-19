import styles from "./MainView.module.css";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";
import JoinQuark from "../components/_services/lightquark/nav/JoinQuark.jsx";
import {Outlet, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import GenericQuark from "../components/nav/GenericQuark.jsx";
import useQuarkList from "../components/_services/lightquark/hooks/useQuarkList.js";
import Quark from "../components/_services/lightquark/nav/Quark.jsx";
import {useState} from "react";
import {SidebarContext} from "../contexts/SidebarContext.js";
import classnames from "classnames";

export default function MainView() {
    const { data, isLoading } = useQuarkList();
    const {t} = useTranslation();
    let { dialogId } = useParams();
    const [listOpen, setListOpen] = useState(!dialogId);
    const [membersOpen, setMembersOpen] = useState(window.innerWidth > 1000);

    return <SidebarContext value={{
        listOpen, setListOpen, membersOpen, setMembersOpen
    }}>
        <div className={classnames(styles.quarkList, {[styles.closed]: !listOpen})}>
            {isLoading ? <GenericQuark name={t("LOADING_QUARKS")}/> : data.map(id => <Quark id={id} key={id}/>)}
            <JoinQuark/>
        </div>

        {isLoading ? null : <Outlet/>}
    </SidebarContext>
}