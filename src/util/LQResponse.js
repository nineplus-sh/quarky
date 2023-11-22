// Robbed from https://github.com/emilianya/quarkvite/blob/2bb3b84634c9d41e7da7973b17853acdd010729b/src/util/api/classes/APIResponse.js
export default class APIResponse {
    request;
    response;
    statusCode;
    fetchSuccess;
    raw;
    constructor(res, statusCode, success) {
        this.statusCode = statusCode;
        this.fetchSuccess = success
        this.request = res.request;
        this.response = res.response;
        this.raw = res;
    }
}