import {useQuery, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useChannelMembers(id, options = {}) {
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall(`channel/${id}/members`)
            return data.users;
        },
        queryKey: [`channel/${id}`, `channel/${id}/members`],
        ...options
    });
}