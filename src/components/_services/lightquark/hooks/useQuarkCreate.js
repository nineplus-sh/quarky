import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkCreate() {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name, code) => {
            return apiCall({
                route: `quark`,
                method: "POST",
                body: {
                    name,
                    ...(code && { invite: code })
                }
            })
        },
        onSuccess: (data) => {
            queryClient.setQueryData([`quark/${data.quark._id}`], data.quark)
            queryClient.setQueryData([`quarks`], (prevData) => [...prevData, data.quark._id])
        }
    })
}