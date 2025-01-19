import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkLeave() {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => {
            return apiCall({
                route: `quark/${id}/leave`,
                method: "POST"
            })
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries(["quark",id])
            queryClient.setQueryData([`quarks`], (prevData) => prevData.filter(q => q !== id))
        }
    })
}