import {useQuery} from "@tanstack/react-query";
import {useContext} from "react";
import {AppContext} from "../../contexts/AppContext.js";

export default function WhatsNew() {
    const {apiKeys} = useContext(AppContext);
    const networkChangelog = useQuery({
        queryFn: () => fetch(`${apiKeys.baseURL}/changelog.xml`).then(res => res.text()).then(txt => new window.DOMParser().parseFromString(txt, "text/xml")),
        queryKey: ["changelog"]
    })

    if(!networkChangelog.isSuccess) return null;
    return <>
        {networkChangelog.data.querySelectorAll("item")[0].querySelector("title").innerHTML}
    </>
}