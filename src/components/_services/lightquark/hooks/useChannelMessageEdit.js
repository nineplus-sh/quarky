import {useMutation} from "@tanstack/react-query";
import {AppContext} from "../../../../contexts/AppContext.js";
import {useContext} from "react";

export default function useChannelMessageEdit() {
    const {axiosClient} = useContext(AppContext);

    return useMutation({
        mutationFn: ({channel,messageID,message}) => {
            const formData = new FormData();
            formData.append("payload", JSON.stringify(message));
            //attachments?.forEach(attachment => formData.append("attachment", attachment));
            return axiosClient.patch(`channel/${channel}/messages/${messageID}`, formData)
        }
    })
}