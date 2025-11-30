import {
  sendSignUpCode,
  verifySignupCode,
  completeSignup,
  login as loginUser,
  sendResetCode,
  resetPassword,
} from "../services/auth-service.js";

const wrapper = document.getElementById("wrapper");

const panels = {
  login: document.getElementById("loginPanel"),
  signup1: document.getElementById("signupStep1Panel"),
  signup2: document.getElementById("signupStep2Panel"),
  signup3: document.getElementById("signupStep3Panel"),
  forgot: document.getElementById("forgotPanel"),
  reset: document.getElementById("resetPasswordPanel"),
};

let tempEmail = "";
let resetEmail = "";
let signupToken = ""; // Store temporary signup token from Step 2

function showPanel(panel) {
  Object.values(panels).forEach((p) => p.classList.remove("active"));
  panel.classList.add("active");
}

function setLoading(btn, state) {
  btn.classList.toggle("loading", state);
}

// Helper to display errors (handles multi-line errors)
function displayError(element, errorMessage) {
  if (!element) return;
  element.textContent = "";

  // Split by newline and create formatted error
  if (errorMessage.includes("\n")) {
    // For multi-line errors, show each on its own line
    const lines = errorMessage.split("\n").filter((line) => line.trim());
    element.textContent = lines.join(" • ");
  } else {
    element.textContent = errorMessage;
  }
}

// ======================
//     UI Helpers
// ======================

document.getElementById("signupTrigger").onclick = () => {
  wrapper.classList.add("show-signup");
  wrapper.classList.remove("forgot-mode");
  showPanel(panels.signup1);
};

document.getElementById("loginTrigger1").onclick = () => {
  wrapper.classList.remove("show-signup");
  wrapper.classList.remove("forgot-mode");
  showPanel(panels.login);
};

document.getElementById("forgotTrigger").onclick = () => {
  wrapper.classList.add("forgot-mode");
  wrapper.classList.remove("show-signup");
  showPanel(panels.forgot);
};

document.getElementById("backToLogin").onclick = () => {
  wrapper.classList.remove("forgot-mode");
  showPanel(panels.login);
};

// ============================
//       SIGNUP STEP 1
// ============================

document.getElementById("sendCodeBtn").onclick = async () => {
  const email = document.getElementById("signupEmail").value.trim();
  const err = document.getElementById("emailError");
  const suc = document.getElementById("emailSuccess");
  const btn = document.getElementById("sendCodeBtn");

  err.textContent = "";
  suc.textContent = "";

  if (!email) return (err.textContent = "لطفاً ایمیل را وارد کنید.");

  setLoading(btn, true);
  const data = await sendSignUpCode(email);
  setLoading(btn, false);

  if (data.success) {
    tempEmail = email;
    suc.textContent = "کد ارسال شد.";
    setTimeout(() => showPanel(panels.signup2), 700);
  } else {
    displayError(err, data.error);
  }
};

// ============================
//       SIGNUP STEP 2
// ============================

document.getElementById("verifyCodeBtn").onclick = async () => {
  const code = document.getElementById("verifyCode").value.trim();
  const err = document.getElementById("verifyError");
  const btn = document.getElementById("verifyCodeBtn");

  err.textContent = "";

  if (code.length !== 6) return (err.textContent = "کد باید ۶ رقم باشد.");

  setLoading(btn, true);
  const data = await verifySignupCode(tempEmail, code);
  setLoading(btn, false);

  if (data.success) {
    // Store signup token from Step 2 to use in Step 3
    signupToken = data.signup_token;
    showPanel(panels.signup3);
  } else {
    displayError(err, data.error);
  }
};

// ============================
//       SIGNUP STEP 3
// ============================

document.getElementById("completeSignupBtn").onclick = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const err = document.getElementById("signupError");
  const btn = document.getElementById("completeSignupBtn");

  err.textContent = "";

  if (!username) return (err.textContent = "نام کاربری را وارد کنید.");
  if (password !== password2)
    return (err.textContent = "رمز عبور و تکرار آن یکسان نیست.");
  if (password.length < 6)
    return (err.textContent = "رمز عبور باید حداقل ۶ کاراکتر باشد.");

  setLoading(btn, true);
  const data = await completeSignup(tempEmail, username, password, signupToken);
  setLoading(btn, false);

  if (data.access_token) {
    // Save token from response
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token_type", data.token_type || "bearer");
    // Redirect after short delay to ensure storage
    setTimeout(() => (window.location.href = "../../../profile.html"), 100);
  } else {
    displayError(err, data.error);
  }
};

// ============================
//             LOGIN
// ============================

document.getElementById("loginBtn").onclick = async () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const err = document.getElementById("loginError");
  const btn = document.getElementById("loginBtn");

  err.textContent = "";

  if (!username || !password)
    return (err.textContent = "لطفاً همه‌ی فیلدها را پر کنید.");

  setLoading(btn, true);
  const data = await loginUser(username, password);
  setLoading(btn, false);

  if (data.access_token) {
    // Save token from response
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token_type", data.token_type || "bearer");
    // Redirect after short delay to ensure storage
    setTimeout(() => (window.location.href = "../../../home.html"), 100);
  } else {
    displayError(err, data.error);
  }
};

// ============================
//   SEND RESET PASSWORD CODE
// =============================

document.getElementById("sendResetCodeBtn").onclick = async () => {
  const email = document.getElementById("forgotEmail").value.trim();
  const err = document.getElementById("forgotError");
  const suc = document.getElementById("forgotSuccess");
  const btn = document.getElementById("sendResetCodeBtn");

  err.textContent = "";
  suc.textContent = "";

  if (!email) return (err.textContent = "لطفاً ایمیل را وارد کنید.");

  setLoading(btn, true);
  const data = await sendResetCode(email);
  setLoading(btn, false);

  if (data.success) {
    resetEmail = email;
    suc.textContent = "کد ارسال شد.";
    showPanel(panels.reset);
  } else {
    displayError(err, data.error);
  }
};

// ============================
//    RESET PASSWORD FINAL
// ============================

document.getElementById("changePasswordBtn").onclick = async () => {
  const code = document.getElementById("resetCode").value.trim();
  const p1 = document.getElementById("newPassword").value;
  const p2 = document.getElementById("newPassword2").value;
  const err = document.getElementById("resetError");
  const btn = document.getElementById("changePasswordBtn");

  err.textContent = "";

  if (p1 !== p2) return (err.textContent = "رمز عبورها یکسان نیست.");
  if (p1.length < 6)
    return (err.textContent = "رمز عبور باید حداقل ۶ کاراکتر باشد.");

  setLoading(btn, true);
  const data = await resetPassword(resetEmail, code, p1);
  setLoading(btn, false);

  if (data.success) {
    wrapper.classList.remove("forgot-mode");
    showPanel(panels.login);
    alert("رمز عبور با موفقیت تغییر کرد.");
  } else {
    displayError(err, data.error);
  }
};
