import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useAvatarReset() {
    const apiCall = useRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            return apiCall({
                route: "user/me/avatar",
                method: "DELETE"
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user/me"]});
        }
    })
}