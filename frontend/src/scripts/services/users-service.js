/**
 * @fileoverview User service
 * Handles users' information : about me - full name - username
 * email - gender - favorite categories - number of friends and trips
 */

import { apiClient } from "./api-client.js";

const USER_ENDPOINT = "/users";


export function getUserInformation(){
    return apiClient.get(
        `${USER_ENDPOINT}/me`
    );
}


/**
 * Sends updated user profile data to the server using the PUT method.
 * @param {Object} userData - The object containing updated profile fields.
 * @returns {Promise<Object>} The response data from the API.
 */
export function updateUserInformation(userData) {
    return apiClient.put(
        `${USER_ENDPOINT}/update-information`,
        userData
    );
}
