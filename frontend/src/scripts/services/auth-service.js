// ==== CONFIG ====
const API_BASE = "http://localhost:8000/api/auth";

// Helper to extract error message from response
function extractErrorMessage(data) {
  // If it's a validation error with array of errors
  if (Array.isArray(data.detail)) {
    return data.detail.map((err) => err.message || err.msg || err).join("\n");
  }

  // If it's a single error object with message
  if (data.detail && typeof data.detail === "object" && data.detail.message) {
    return data.detail.message;
  }

  // If detail is a string
  if (typeof data.detail === "string") {
    return data.detail;
  }

  // Fallback to message or error
  return data.message || data.error || "خطای نامشخص";
}

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
        error: extractErrorMessage(data),
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
