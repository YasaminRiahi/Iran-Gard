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

