import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export default function useQuark(id, options) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: [`quark/${id}`],
        initialData: () => queryClient.getQueryData(["quark"])?.quarks.find(quark => quark._id === id),
        select: (res) => { return res?.quark ? res.quark : res; },
        ...options
    });
}