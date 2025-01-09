import useRPC from "./useRPC.js";
import {useQuery} from "@tanstack/react-query";

export default function useNetwork(options = {}) {
    const apiCall = useRPC();

    return useQuery({
        queryFn: async () => {
            return apiCall("network");
        },
        queryKey: ["network"],
        ...options
    });
}