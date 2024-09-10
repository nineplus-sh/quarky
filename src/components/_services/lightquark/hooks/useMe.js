import {useQuery} from "@tanstack/react-query";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

export default function useMe(options = {}) {
    const {apiKeys} = useContext(AppContext);
    const queryResult = useQuery({
        queryKey: ["user/me", apiKeys.accessToken],
        select: (res) => { return res.user },
        enabled: !!apiKeys.accessToken,
        ...options
    });

    if(!apiKeys.accessToken) return {isLoading:false,data:null};
    return queryResult;
}