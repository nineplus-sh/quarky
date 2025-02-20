import useRPC from "./useRPC.js";
import {useMutation} from "@tanstack/react-query";

export default function useChannelMessageDelete() {
    const apiCall = useRPC();

    return useMutation({
        mutationFn: ({channel, messageID}) => {
            return apiCall({
                route: `channel/${channel}/messages/${messageID}`,
                method: "DELETE"
            })
        }
    })
}