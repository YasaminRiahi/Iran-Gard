import { apiClient } from "./api-client.js";

const USER_ENDPOINT = "/friendships";


export function getFriends(){
    return apiClient.get(
        `${USER_ENDPOINT}`
    );
}

export function removeFriend(friendship_ID) {
    return apiClient.post(`${USER_ENDPOINT}/remove/${friendship_ID}`);
}

export function sendResetCode(email) {
    return apiClient.post(
        `${AUTH_ENDPOINT}/forgot-password`,
        { email },
        { includeAuth: false }
    );
}