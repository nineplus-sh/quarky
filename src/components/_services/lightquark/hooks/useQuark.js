import {useQuery, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuark(id, options = {}) {
    const queryClient = useQueryClient();
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall(`quark/${id}`)
            return data.quark;
        },
        queryKey: [`quark/${id}`],
        ...options
    });
}