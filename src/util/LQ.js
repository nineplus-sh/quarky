import APIResponse from "./LQResponse.js";
import localForage from "localforage";
import {version} from "../../package.json";

/**
 * Robbed from https://github.com/emilianya/quarkvite/blob/2bb3b84634c9d41e7da7973b17853acdd010729b/src/util/api/apiCall.js
 * @param apiMethod
 * @param httpMethod
 * @param body
 * @param skipAuth
 * @return {Promise<APIResponse>}
 */
export default async function LQ (apiMethod, httpMethod, body = undefined, skipAuth = false) {
    let localConfig = await localForage.getItem("lightquark")
    if (!skipAuth && !localConfig.token) throw new Error("Missing token")
    try {
        let headers = {};
        let requestBody = undefined;
        if (httpMethod !== "GET") {
            headers.Accept = "application/json";
            headers["Content-Type"] = "application/json";
            headers["lq-agent"] = `Quarky/${version}`
            requestBody = JSON.stringify(body);
        }
        if (!skipAuth) headers.Authorization = `Bearer ${localConfig.token}`;
        let apiRequest = await fetch(`${localConfig.network.baseUrl}/${localConfig.network.version}/${apiMethod}${httpMethod === "GET" && body ? "?" + new URLSearchParams(body) : ""}`, {
            method: httpMethod,
            headers,
            body: requestBody
        })
        let apiResponse = await apiRequest.json();
        return new APIResponse(apiResponse, apiRequest.status, true)
    } catch (e) {
        console.error("[apiCall]", e);
        throw e
    }
}