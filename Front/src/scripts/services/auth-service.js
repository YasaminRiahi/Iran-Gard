// ==== CONFIG ====
const API_BASE = "http://localhost:8000/api/auth";

// Universal POST helper with error handling
async function apiPost(url, body) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // If response is not OK (4xx, 5xx), throw error with detail message
    if (!res.ok) {
      throw {
        status: res.status,
        error: data.detail || data.message || "خطای نامشخص",
        data: data,
      };
    }

    return data;
  } catch (err) {
    // If it's our custom error, return it
    if (err.error) {
      return {
        success: false,
        error: err.error,
        status: err.status,
      };
    }
    // Network error or other issue
    return {
      success: false,
      error: "خطا در ارتباط با سرور: " + err.message,
    };
  }
}

// ===========================
//       SIGNUP API
// ===========================
export function sendSignUpCode(email) {
  return apiPost("/send-signup-code", { email });
}

export function verifySignupCode(email, code) {
  return apiPost("/verify-signup-code", { email, code });
}

export function completeSignup(email, username, password) {
  return apiPost("/complete-signup", { email, username, password });
}

// ===========================
//         LOGIN API
// ===========================
export function login(username, password) {
  return apiPost("/login", { username, password });
}

// ===========================
//     PASSWORD RESET API
// ===========================
export function sendResetCode(email) {
  return apiPost("/forgot-password", { email });
}

export function resetPassword(email, code, newPassword) {
  return apiPost("/reset-password", { email, code, newPassword });
}
