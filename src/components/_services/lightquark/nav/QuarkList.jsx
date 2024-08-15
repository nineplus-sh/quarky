import Quark from "./Quark.jsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useQuery} from "@tanstack/react-query";
import GenericQuark from "../../../nav/GenericQuark.jsx";
import {useTranslation} from "react-i18next";

export default function QuarkList() {
    const { status, data, error, isLoading } = useQuery({queryKey: ['quark']});
    const {t} = useTranslation();

    if(isLoading) return <GenericQuark name={t("LOADING_QUARKS")}/>;
    return data.quarks.map((quark) => <Quark quark={quark} key={quark._id}/>)
}