import {useQuery, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useChannelMembers(id, options = {}) {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall(`channel/${id}/members`)
            return data.users.map(user => {
                queryClient.setQueryData(["user",user._id], user)
                return user._id
            });
        },
        queryKey: ["channel", id, "members"],
        ...options
    });
}