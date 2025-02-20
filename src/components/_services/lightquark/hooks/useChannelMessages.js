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
            return data.messages.map(message => {
                queryClient.setQueryData(["user",message.author._id], (prevData) => {
                    return {...prevData, ...message.author}
                });
                return {...message, author: message.author._id}
            });
        },
        queryKey: ["channel", id, "messages"],
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