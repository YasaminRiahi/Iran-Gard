import { apiClient , URL_BASE } from "./api-client.js";

const USER_ENDPOINT = "/users";


export function getUserInformation(){
    return apiClient.get(
        `${USER_ENDPOINT}/me`
    );
}


export function updateUserInformation(userData) {
    return apiClient.put(
        `${USER_ENDPOINT}/update-information`,
        userData
    );
}


export function getURL () {
    return URL_BASE;
}