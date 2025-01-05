import {useQuery, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";
import useMe from "./useMe.js";

export default function useUser(id, options = {}) {
    const apiCall = useRPC();
    const me = useMe();

    const userQuery = useQuery({
        queryFn: async () => {
            const data = await apiCall(`user/${id}`)
            return data.quark;
        },
        queryKey: [`user/${id}`],
        enabled: me.isSuccess && me.data._id !== id,
        ...options
    });

    if(me.isSuccess && me.data._id === id) return me;
    return userQuery;
}