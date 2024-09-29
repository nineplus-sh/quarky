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
    const uuid = useMemo(() => uuidv4(), [])
    const refreshUuid = useMemo(() => uuidv4(), [])
    const promiseRef = useRef(null);
    const messageRef = useRef(null);
    const refreshRef = useRef(null);
    const [messageUnsent, setMessageUnsent] = useState(true);

    useEffect(() => {
        if(!socket || !socket.lastMessage || !messageRef.current) return;

        const eventData = JSON.parse(socket.lastMessage.data)
        if(eventData.event === "rpc" && eventData.state === uuid) {
            console.warn(messageRef.current.route, "gets", eventData)
            if(eventData.body.request.status_code === 401) {
                if(renewPromise) {
                    renewPromise.then(() => socket.sendJsonMessage(messageRef.current))
                    return;
                }

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
            } else {
                promiseRef.current.resolve(eventData.body.response)
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
                    refreshRef.current.resolve();
                    refreshRef.current = null;

                    messageRef.current.token = eventData.body.response.accessToken;
                    socket.sendJsonMessage(messageRef.current)
                })
            } else {
                promiseRef.current.reject(eventData.body.response);
                localForage.removeItem("lightquark").then(() => setApiKeys({}))
            }
        }
    }, [socket, socket?.lastMessage, socket?.readyState]);

    useOnceWhen(socket?.isAuthenticated, true, () => {
        if(messageUnsent) {
            setMessageUnsent(false);
            socket.sendJsonMessage(messageRef.current)
        }
    }, !!messageRef.current)

    return async (data) => {
        if(renewPromise) await renewPromise;

        return new Promise((resolve, reject) => {
            setMessageUnsent(true);
            promiseRef.current = { resolve, reject }
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
            }
            messageRef.current = messageToSend
            if(socket?.isAuthenticated) {
                setMessageUnsent(false);
                socket.sendJsonMessage(messageRef.current);
            }
        })
    }
}