import Quark from "./Quark.jsx";
import {useEffect, useState} from "react";
import LQ from "../../../../util/LQ.js";

export default function QuarkList() {
    const [quarks, setQuarks] = useState([])

    useEffect(() => {
        (async () => {
            const LQquarks = (await LQ("quark/me")).response.quarks;
            setQuarks(LQquarks)
        })()
    }, [])

    return quarks.map((quark) => <Quark quark={quark} key={quark._id}/>)
}