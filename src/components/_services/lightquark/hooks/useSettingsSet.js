import useRPC from "./useRPC.js";
import {useContext} from "react";
import {WebSocketContext} from "../../../../contexts/WebSocketContext.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import localForage from "localforage";
import * as Sentry from "@sentry/react";

export default function useSettingsSet() {
    const apiCall = useRPC();
    const {socket} = useContext(WebSocketContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({key, value, namespace = "quarky"}) => {
            if(!socket?.isAuthenticated) return;

            return apiCall({
                route: `user/me/preferences/${namespace}/${key}`,
                body: {
                    value: value
                }
            })
        },
        onMutate: async (variables) => {
            const {key, value} = variables;

            const previousUnauthed = queryClient.getQueryData(["settings", "unauthed"]);

            localForage.setItem("settings", {...previousUnauthed, [key]: value});
            queryClient.setQueryData(["settings", "unauthed"], (prev) => ({ ...prev, [key]: value }));
            if (socket?.isAuthenticated) queryClient.setQueryData(["settings", "authed"], (prev) => ({ ...prev, [key]: value }));

            return { previousUnauthed };
        },
        onError: (error, variables, context) => {
            Sentry.captureException(error);
            const currentUnauthed = queryClient.getQueryData(["settings", "unauthed"]);
            localForage.setItem("settings", {...currentUnauthed, [variables.key]: context.previousUnauthed[variables.key]});
        }
    })
}