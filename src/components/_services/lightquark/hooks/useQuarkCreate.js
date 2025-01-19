import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkCreate() {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({name, code}) => {
            const res = await apiCall({
                route: `quark`,
                method: "POST",
                body: {
                    name,
                    ...(code && { invite: code })
                }
            })
            return res.quark;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["quark",data._id], data.quark)
            queryClient.setQueryData([`quarks`], (prevData) => [...prevData, data._id])
        }
    })
}