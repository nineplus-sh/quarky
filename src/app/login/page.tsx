"use client";

import Header from "@/components/nav/Header";
import "./style.css"
import NyafileAsset from "@/components/nya/NyafileAsset";
import {NyafileContext} from "@/components/nya/NyafileProvider";
import {useContext} from "react";

export default function Page() {
    const nyafile = useContext(NyafileContext)
    if(!nyafile) return <Header title={"Quarky is loading..."} description={"Please wait."}/>
    return (<>
        <Header title={"Welcome to Quarky~"} description={"Sign in to continue"}/>
        <NyafileAsset></NyafileAsset>
    </>)
}