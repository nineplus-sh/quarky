import Quark from "./Quark.jsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function QuarkList() {
    const {quarkList, quarkCache} = useContext(AppContext);
    return quarkList.map((quarkId) => <Quark quark={quarkCache[quarkId]} key={quarkId}/>)
}