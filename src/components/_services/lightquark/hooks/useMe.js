import {useQuery} from "@tanstack/react-query";

export default function useMe(options = {}) {
    return useQuery({
        queryKey: ["user/me"],
        select: (res) => {
            return res.user
        },
        ...options
    });
}