import {useQuery} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useEmotes(options = {}) {
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall("emoji")
            return data.emotes;
        },
        queryKey: ["emoji"],
        ...options
    });
}