import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkJoin() {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (code) => {
            return apiCall({
                route: `quark/${code}/join`,
                method: "POST"
            })
        },
        onSuccess: (data) => {
            queryClient.setQueryData([`quark/${data.quark._id}`], data.quark)
            queryClient.setQueryData([`quarks`], (prevData) => [...prevData, data.quark._id])
        }
    })
}