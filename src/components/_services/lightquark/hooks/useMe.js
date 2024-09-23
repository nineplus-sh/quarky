import {useQuery} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useMe(options = {}) {
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall("user/me")
            return data.user;
        },
        queryKey: ["user/me"],
        ...options
    });
}