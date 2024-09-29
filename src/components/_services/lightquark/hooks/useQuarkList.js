import {useQuery} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkList(options = {}) {
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            const data = await apiCall("quark")
            return data.quarks;
        },
        queryKey: ["quarks"],
        ...options
    });
}