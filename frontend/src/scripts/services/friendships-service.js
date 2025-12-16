import { apiClient } from "/src/scripts/services/api-client.js";

const FRIENDSHIPS_ENDPOINT = "/friendships";


export function getFriends(){
    return apiClient.get(
        `${FRIENDSHIPS_ENDPOINT}`
    );
}

export function removeFriend(friendship_ID) {
    return apiClient.delete(`${FRIENDSHIPS_ENDPOINT}/remove/${friendship_ID}`);
}

export function getReceivedPendingRequests() {
    return apiClient.get(`${FRIENDSHIPS_ENDPOINT}/received_pending`);
}

export function acceptFriendRequest(friendship_ID) {
    return apiClient.post(`${FRIENDSHIPS_ENDPOINT}/accept/${friendship_ID}`);
}

export function rejectFriendRequest(friendship_ID) {
    return apiClient.post(`${FRIENDSHIPS_ENDPOINT}/reject/${friendship_ID}`);
}

export function getSentPendingRequests() {
    return apiClient.get(`${FRIENDSHIPS_ENDPOINT}/sent_pending`);
}

export function cancelFriendRequest(friendship_ID) {
    return apiClient.delete(`${FRIENDSHIPS_ENDPOINT}/cancel/${friendship_ID}`);
}

export function sendFriendRequest(username) {
    return apiClient.post(`${FRIENDSHIPS_ENDPOINT}/request`, {
        username: username
    });
}