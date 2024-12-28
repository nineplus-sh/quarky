import {WebSocketContext} from "../../../../contexts/WebSocketContext.js";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {AppContext} from "../../../../contexts/AppContext.js";
import localForage from "localforage";
import useOnceWhen from "../../../../util/useOnceWhen.js";

export let renewPromise = null;

/**
 * Hits on the gateway asking to perform an HTTP request.
 * FormData requests are not supported.
 */
export default function useRPC() {
    const {socket} = useContext(WebSocketContext);
    const {apiKeys, setApiKeys} = useContext(AppContext);
    const refreshUuid = useMemo(() => uuidv4(), []);
    const promiseRef = useRef({});
    const messageRef = useRef({});
    const refreshRef = useRef(null);
    const isRefreshing = useRef(false);

    useEffect(() => {
        if(!socket || !socket.lastMessage || !messageRef.current) return;

        const eventData = JSON.parse(socket.lastMessage.data)
        if(eventData.event === "rpc" && promiseRef.current[eventData.state]) {
            if(eventData.body.request.status_code === 401) {
                if(renewPromise && !isRefreshing.current) {
                    renewPromise.then(() => socket.sendJsonMessage(messageRef.current[eventData.state]))
                    return;
                }

                isRefreshing.current = true;
                renewPromise = new Promise((resolve, reject) => {refreshRef.current={resolve,reject}})
                socket.sendJsonMessage({
                    event: "rpc",
                    state: refreshUuid,
                    token: "If anyone sees this I would really like if you rubbed my tummy",

                    route: "/v4/auth/refresh",
                    method: "POST",
                    body: {
                        accessToken: apiKeys.accessToken,
                        refreshToken: apiKeys.refreshToken
                    }
                })
            } else if(eventData.body.request.success) {
                promiseRef.current[eventData.state].resolve(eventData.body.response);
                delete promiseRef.current[eventData.state];
                delete messageRef.current[eventData.state];
            } else {
                promiseRef.current[eventData.state].reject(eventData.body);
                delete promiseRef.current[eventData.state];
                delete messageRef.current[eventData.state];
            }
        } else if(eventData.event === "rpc" && eventData.state === refreshUuid) {
            if(eventData.body.request.success) {
                localForage.setItem("lightquark", {
                    network: {
                        baseUrl: apiKeys.baseURL
                    },
                    token: eventData.body.response.accessToken,
                    refreshToken: apiKeys.refreshToken
                }).then(() => {
                    setApiKeys(prevApiKeys => ({...prevApiKeys, accessToken: eventData.body.response.accessToken}))
                    renewPromise = null;
                    isRefreshing.current = false;
                    refreshRef.current.resolve();
                    refreshRef.current = null;

                    Object.entries(messageRef.current).forEach(([uuid]) => {
                        messageRef.current[uuid].token = eventData.body.response.accessToken;
                        socket.sendJsonMessage(messageRef.current[uuid])
                    });
                })
            } else {
                localForage.removeItem("lightquark").then(() => setApiKeys({}))
            }
        }
    }, [socket, socket?.lastMessage, socket?.readyState]);

    useOnceWhen(socket?.isAuthenticated, true, () => {
        Object.values(messageRef.current).forEach(message => socket.sendJsonMessage(message))
    })

    return async (data) => {
        if(renewPromise) await renewPromise;
        const uuid = uuidv4();

        return new Promise((resolve, reject) => {
            let messageToSend = {
                event: "rpc",
                state: uuid,
                token: apiKeys.accessToken
            }
            if(typeof data === "string") {
                messageToSend.route = "/v4/" + data;
                messageToSend.method = "GET"
            } else {
                messageToSend = {...messageToSend, ...data}
                messageToSend.route = "/v4/" + messageToSend.route;
                if(!messageToSend.method) messageToSend.method = "POST";
            }

            messageRef.current[uuid] = messageToSend;
            promiseRef.current[uuid] = { resolve, reject }
            if(socket?.isAuthenticated) socket.sendJsonMessage(messageToSend);
        })
    }
}