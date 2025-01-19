import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRPC from "./useRPC.js";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

export default function useAvatarUpload() {
    const {axiosClient} = useContext(AppContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({image, quark, progressCallback}) => {
            const data = new FormData();
            data.append(quark ? "icon" : "avatar", image);
            return axiosClient.put(quark ? `quark/${quark}/icon` : "user/me/avatar", data, {onUploadProgress: progressCallback})
        },
        onSuccess: (data, vars) => {
            if(!vars.quark) queryClient.invalidateQueries(["me"])
        }
    })
}