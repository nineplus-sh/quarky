import useRPC from "./useRPC.js";
import {useInfiniteQuery} from "@tanstack/react-query";

export default function useChannelMessages(id, options) {
    const apiCall = useRPC();

    return useInfiniteQuery({
        queryFn: async ({pageParam}) => {
            const data = await apiCall(`channel/${id}/messages`)
            return data.messages;
        },
        queryKey: [`channel/${id}`, `channel/${id}/messages`],
        getFirstPageParam: (firstPage) => firstPage[firstPage.length-1].timestamp,
        getNextPageParam: (lastPage) => lastPage?.[0].timestamp,
        ...options
    });
}