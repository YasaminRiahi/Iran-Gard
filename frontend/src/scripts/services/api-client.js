/**
 * @fileoverview Universal API Client with automatic authentication
 * Handles all HTTP requests with automatic Authorization header injection
 *
 * @module api-client
 * @example
 * import { apiClient } from './api-client.js';
 *
 * // GET request (authenticated by default)
 * const profile = await apiClient.get('/users/me');
 *
 * // POST request with data
 * const result = await apiClient.post('/favorites', { place_id: 123 });
 *
 * // Non-authenticated request
 * const places = await apiClient.get('/places', { includeAuth: false });
 */

import {getAPIBase} from '/src/scripts/config.js';

/**
 * Request options for API calls
 * @typedef {Object} RequestOptions
 * @property {boolean} [includeAuth=true] - Whether to include Authorization header
 * @property {Object} [headers] - Additional headers to merge
 */

/**
 * API Client with HTTP methods
 * @typedef {Object} ApiClient
 * @property {(endpoint: string, options?: RequestOptions) => Promise<any>} get - GET request
 * @property {(endpoint: string, body: Object, options?: RequestOptions) => Promise<any>} post - POST request
 * @property {(endpoint: string, body: Object, options?: RequestOptions) => Promise<any>} put - PUT request
 * @property {(endpoint: string, body: Object, options?: RequestOptions) => Promise<any>} patch - PATCH request
 * @property {(endpoint: string, options?: RequestOptions) => Promise<any>} delete - DELETE request
 */

// Get API base URL
export const API_BASE = getAPIBase();

/**
 * Extracts user-friendly error message from API response
 * Handles various error response formats:
 * - Array of validation errors
 * - Object with message property
 * - Simple string message
 *
 * @param {Object} data - Response data object
 * @returns {string} User-friendly error message
 */
function extractErrorMessage(data) {
    // Validation error with array of errors (Pydantic format)
    if (Array.isArray(data.detail)) {
        return data.detail.map((err) => err.message || err.msg || err).join("\n");
    }

    // Single error object with message
    if (data.detail && typeof data.detail === "object" && data.detail.message) {
        return data.detail.message;
    }

    // Simple string error message
    if (typeof data.detail === "string") {
        return data.detail;
    }

    // Fallback to alternative error fields
    return data.message || data.error || "خطای نامشخص";
}

/**
 * Retrieves access token from localStorage
 * @returns {string|null} JWT access token or null if not found
 */
function getAccessToken() {
    return localStorage.getItem("access_token");
}

/**
 * Builds request headers with optional Authorization header injection
 * @param {boolean} includeAuth - Whether to include Authorization header
 * @returns {Object} Headers object with Content-Type and optional Authorization
 */
function getHeaders(includeAuth = true) {
    const headers = {"Content-Type": "application/json"};

    if (includeAuth) {
        const token = getAccessToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return headers;
}

/**
 * Universal HTTP request handler
 * Automatically injects Authorization header for authenticated requests
 *
 * @param {string} endpoint - API endpoint (e.g., '/users/me')
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Request body for POST/PUT
 * @param {boolean} options.includeAuth - Include Authorization header (default: true)
 * @param {Object} options.headers - Additional headers to merge
 * @returns {Promise<Object>} Response data or error object with success: false
 */
async function request(endpoint, options = {}) {
    const {
        method = "GET",
        body = null,
        includeAuth = true,
        headers = {},
    } = options;

    const url = `${API_BASE}${endpoint}`;
    const fetchOptions = {
        method,
        headers: {...getHeaders(includeAuth), ...headers},
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json();

        // Handle error responses (4xx, 5xx)
        if (!response.ok) {
            throw {
                status: response.status,
                error: extractErrorMessage(data),
                data: data,
            };
        }

        return data;
    } catch (err) {
        // Return standardized error format
        if (err.error) {
            return {
                success: false,
                error: err.error,
                status: err.status,
            };
        }

        // Network error or JSON parse error
        return {
            success: false,
            error: "خطا در ارتباط با سرور",
        };
    }
}

/**
 * Public API client with convenience methods
 * All methods automatically include Authorization header unless specified otherwise
 *
 * @type {ApiClient}
 * @property {Function} get - GET request
 * @property {Function} post - POST request
 * @property {Function} put - PUT request
 * @property {Function} delete - DELETE request
 * @property {Function} patch
 */
export const apiClient = {
    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {RequestOptions} [options] - Request options
     * @returns {Promise<any>} Response data
     */
    get: (endpoint, options = {}) =>
        request(endpoint, {...options, method: "GET"}),

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {RequestOptions} [options] - Request options
     * @returns {Promise<any>} Response data
     */
    post: (endpoint, body, options = {}) =>
        request(endpoint, {...options, method: "POST", body}),

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {RequestOptions} [options] - Request options
     * @returns {Promise<any>} Response data
     */
    put: (endpoint, body, options = {}) =>
        request(endpoint, {...options, method: "PUT", body}),

    /**
     * PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {RequestOptions} [options] - Request options
     * @returns {Promise<any>} Response data
     */
    patch: (endpoint, body, options = {}) =>
        request(endpoint, { ...options, method: "PATCH", body }),
    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {RequestOptions} [options] - Request options
     * @returns {Promise<any>} Response data
     */
    delete: (endpoint, options = {}) =>
        request(endpoint, {...options, method: "DELETE"}),


};
