import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useQuarkJoin() {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (code) => {
            const res = await apiCall({
                route: `quark/${code}/join`,
                method: "POST"
            })
            return res.quark;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([`quark/${data._id}`], data)
            queryClient.setQueryData([`quarks`], (prevData) => [...prevData, data._id])
        }
    })
}