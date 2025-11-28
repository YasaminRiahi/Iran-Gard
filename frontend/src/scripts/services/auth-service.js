/**
 * @fileoverview Authentication service
 * Handles signup, login, and password reset flows
 * Stores access token in localStorage after successful login
 */

import { apiClient } from "./api-client.js";

const AUTH_ENDPOINT = "/auth";

/**
 * Stores access token in localStorage
 * Called after successful login or signup
 * @param {string} token - JWT access token
 */
function storeAccessToken(token) {
  localStorage.setItem("access_token", token);
}

/**
 * SIGNUP FLOW - 3-step process
 */

/**
 * Step 1: Send verification code to email
 * @param {string} email - User email address
 * @returns {Promise<Object>} Response with success status
 */
export function sendSignUpCode(email) {
  return apiClient.post(
    `${AUTH_ENDPOINT}/send-signup-code`,
    { email },
    { includeAuth: false }
  );
}

/**
 * Step 2: Verify code and get temporary signup token
 * @param {string} email - User email address
 * @param {string} code - 6-digit verification code from email
 * @returns {Promise<Object>} Response with signup_token for step 3
 */
export function verifySignupCode(email, code) {
  return apiClient.post(
    `${AUTH_ENDPOINT}/verify-signup-code`,
    { email, code },
    { includeAuth: false }
  );
}

/**
 * Step 3: Complete signup by creating account
 * Must be called after verifySignupCode with the signup_token
 * @param {string} email - User email address
 * @param {string} username - Desired username
 * @param {string} password - Desired password
 * @param {string} signupToken - Temporary token from step 2
 * @returns {Promise<Object>} Response with access_token on success
 */
export async function completeSignup(email, username, password, signupToken) {
  const response = await apiClient.post(
    `${AUTH_ENDPOINT}/complete-signup`,
    { email, username, password, signup_token: signupToken },
    { includeAuth: false }
  );

  // Store token on successful signup
  if (response.access_token) {
    storeAccessToken(response.access_token);
  }

  return response;
}

/**
 * LOGIN
 */

/**
 * Login with username and password
 * Stores access token in localStorage on successful login
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Response with access_token on success
 */
export async function login(username, password) {
  const response = await apiClient.post(
    `${AUTH_ENDPOINT}/login`,
    { username, password },
    { includeAuth: false }
  );

  // Store token on successful login
  if (response.access_token) {
    storeAccessToken(response.access_token);
  }

  return response;
}

/**
 * PASSWORD RESET FLOW - 2-step process
 */

/**
 * Step 1: Send password reset code to email
 * @param {string} email - User email address
 * @returns {Promise<Object>} Response with success status
 */
export function sendResetCode(email) {
  return apiClient.post(
    `${AUTH_ENDPOINT}/forgot-password`,
    { email },
    { includeAuth: false }
  );
}

/**
 * Step 2: Reset password with verification code
 * @param {string} email - User email address
 * @param {string} code - 6-digit verification code from email
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response with success status
 */
export function resetPassword(email, code, newPassword) {
  return apiClient.post(
    `${AUTH_ENDPOINT}/reset-password`,
    { email, code, new_password: newPassword },
    { includeAuth: false }
  );
}
