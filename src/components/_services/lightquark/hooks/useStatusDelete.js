import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";

export default function useStatusDelete() {
    const apiCall = useRPC();

    return useMutation({
        mutationFn: () => {
            return apiCall({
                route: "user/me/status",
                method: "DELETE"
            })
        }
    })
}