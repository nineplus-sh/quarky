import {useMutation} from "@tanstack/react-query";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

export default function useStatusSet() {
    const {axiosClient} = useContext(AppContext);

    return useMutation({
        mutationFn: (status) => {
            const formData = new FormData();
            formData.append("payload", JSON.stringify(status));
            return axiosClient.put("user/me/status", formData)
        }
    })
}