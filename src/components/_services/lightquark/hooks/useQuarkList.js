import {useQuery, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkList(options = {}) {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall("quark")
            data.quarks.forEach(quark => queryClient.setQueryData(["quark",quark._id], quark))
            return data.quarks.map(quark => quark._id);
        },
        queryKey: ["quarks"],
        ...options
    });
}