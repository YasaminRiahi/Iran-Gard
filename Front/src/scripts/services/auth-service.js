// ==== CONFIG ====
const API_BASE = "http://127.0.0.1:5000/api";

// Universal POST helper
async function apiPost(url, body) {
    const res = await fetch(`${API_BASE}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return res.json();
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
