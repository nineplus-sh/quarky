import {useQuery} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useChannel(id, options = {}) {
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall(`channel/${id}`)
            return data.channel;
        },
        queryKey: [`channel/${id}`],
        ...options
    });
}