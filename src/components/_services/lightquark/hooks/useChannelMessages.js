import useRPC from "./useRPC.js";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";

export default function useChannelMessages(id, options) {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryFn: async ({pageParam}) => {
            const route = pageParam ?
                `channel/${id}/messages?${pageParam.direction === "backward" ?
                    "before" : "after"}Timestamp=${pageParam.timestamp}`
                : `channel/${id}/messages`

            const data = await apiCall(route)
            return data.messages;
        },
        queryKey: [`channel/${id}`, `channel/${id}/messages`],
        getPreviousPageParam: (firstPage) => ({timestamp: firstPage[firstPage.length-1].timestamp, direction: "backward"}),
        getNextPageParam: (lastPage) => ({timestamp: lastPage[0].timestamp, direction: "forward"}),
        ...options
    });
}