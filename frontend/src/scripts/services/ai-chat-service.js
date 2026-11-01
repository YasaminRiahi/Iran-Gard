import {apiClient} from "/src/scripts/services/api-client.js";

const AI_ENDPOINT = "/ai";

export function askQuestion(question) {
    return apiClient.post(`${AI_ENDPOINT}/ask`, {
        question: question
    });
}