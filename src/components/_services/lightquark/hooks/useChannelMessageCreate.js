import {useMutation} from "@tanstack/react-query";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

export default function useChannelMessageCreate() {
    const {axiosClient} = useContext(AppContext);

    return useMutation({
        mutationFn: ({channel,message,attachments}) => {
            const formData = new FormData();
            formData.append("payload", JSON.stringify(message));
            attachments.forEach(attachment => formData.append("attachment", attachment));
            return axiosClient.post(`channel/${channel}/messages`, formData)
        }
    })
}