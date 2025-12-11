import { apiClient } from "./api-client.js";

const USER_ENDPOINT = "/friendships";


export function getFriends(){
    return apiClient.get(
        `${USER_ENDPOINT}`
    );
}

export function removeFriend(friendship_ID) {
    return apiClient.delete(`${USER_ENDPOINT}/remove/${friendship_ID}`);
}

export function getReceivedPendingRequests() {
    return apiClient.get(`${USER_ENDPOINT}/received_pending`);
}

export function acceptFriendRequest(friendship_ID) {
    return apiClient.post(`${USER_ENDPOINT}/accept/${friendship_ID}`);
}

export function rejectFriendRequest(friendship_ID) {
    return apiClient.post(`${USER_ENDPOINT}/reject/${friendship_ID}`);
}