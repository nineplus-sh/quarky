import useRPC from "./useRPC.js";
import {useInfiniteQuery} from "@tanstack/react-query";

export default function useChannelMessages(id, options) {
    const apiCall = useRPC();

    return useInfiniteQuery({
        queryFn: async ({pageParam}) => {
            const route = pageParam ?
                `channel/${id}/messages?${pageParam.direction === "backward" ?
                    "before" : "after"}Timestamp=${pageParam.timestamp}`
                : `channel/${id}/messages`

            const data = await apiCall(route)
            return data.messages;
        },
        queryKey: [`channel/${id}`, `messages`],
        getPreviousPageParam: (firstPage) => {
            const timestamp = firstPage[firstPage.length-1]?.timestamp;
            if(!timestamp) return undefined;
            return {timestamp: firstPage[firstPage.length-1].timestamp, direction: "backward"}
        },
        getNextPageParam: (lastPage) => {
            const timestamp = lastPage[0]?.timestamp;
            if(!timestamp) return undefined;
            return {timestamp: lastPage[0].timestamp, direction: "forward"};
        },
        ...options
    });
}