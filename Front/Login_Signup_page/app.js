const wrapper = document.getElementById("wrapper");

const panels = {
    login: document.getElementById("loginPanel"),
    signup1: document.getElementById("signupStep1Panel"),
    signup2: document.getElementById("signupStep2Panel"),
    signup3: document.getElementById("signupStep3Panel"),
    forgot: document.getElementById("forgotPanel"),
    reset: document.getElementById("resetPasswordPanel")
};

let tempEmail = "";
let resetEmail = "";

function showPanel(panel) {
    Object.values(panels).forEach(p => p.classList.remove("active"));
    panel.classList.add("active");
}

function setLoading(btn, state) {
    if (state) btn.classList.add("loading");
    else btn.classList.remove("loading");
}

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

document.getElementById("sendCodeBtn").onclick = async () => {
    const email = document.getElementById("signupEmail").value.trim();
    const btn = document.getElementById("sendCodeBtn");
    const err = document.getElementById("emailError");
    const suc = document.getElementById("emailSuccess");

    err.textContent = "";
    suc.textContent = "";
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email) {
        return err.textContent = "ایمیل را وارد کنید";
    }
    if (!emailRegex.test(email)) {
        return err.textContent = "لطفاً یک ایمیل معتبر وارد کنید";
    }

    setLoading(btn, true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/send-signup-code", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        });
        const data = await res.json();

        if (data.success) {
            tempEmail = email;
            suc.textContent = "کد ارسال شد!";
            setTimeout(() => showPanel(panels.signup2), 1000);
        } else {
            err.textContent = data.error || "خطا در ارسال کد";
        }
    } catch {
        err.textContent = "خطای اتصال به سرور";
    }
    setLoading(btn, false);
};

document.getElementById("verifyCodeBtn").onclick = async () => {
    const code = document.getElementById("verifyCode").value.trim();
    const btn = document.getElementById("verifyCodeBtn");
    const err = document.getElementById("verifyError");

    err.textContent = "";
    if (code.length !== 6) return err.textContent = "کد باید ۶ رقم باشد";

    setLoading(btn, true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/verify-signup-code", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: tempEmail, code})
        });
        const data = await res.json();

        if (data.success) {
            setTimeout(() => showPanel(panels.signup3), 600);
        } else {
            err.textContent = data.error || "کد اشتباه است";
        }
    } catch {
        err.textContent = "خطای اتصال";
    }
    setLoading(btn, false);
};

document.getElementById("resendCode").onclick = () => {
    document.getElementById("signupEmail").value = tempEmail;
    showPanel(panels.signup1);
};

document.getElementById("completeSignupBtn").onclick = async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const btn = document.getElementById("completeSignupBtn");
    const err = document.getElementById("signupError");

    err.textContent = "";
    if (!username) return err.textContent = "نام کاربری را وارد کنید!";
    if (!password) return err.textContent = "رمز عبور را وارد کنید!";
    if (password !== password2) return err.textContent = "رمزها برابر نیستند";
    if (password.length < 6) return err.textContent = "رمز باید حداقل ۶ کاراکتر باشد!";

    setLoading(btn, true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/complete-signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: tempEmail, username, password})
        });
        const data = await res.json();

        if (data.success) {
            alert("ثبت‌نام با موفقیت انجام شد!");
            location.href = "/dashboard.html";
        } else {
            err.textContent = data.error || "خطا در ثبت‌نام!";
        }
    } catch {
        err.textContent = "خطای اتصال به سرور!";
    }
    setLoading(btn, false);
};

document.getElementById("loginBtn").onclick = async () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const btn = document.getElementById("loginBtn");
    const err = document.getElementById("loginError");

    if (!username || !password) return err.textContent = "همه فیلدها الزامی هستند!";

    err.textContent = "";
    setLoading(btn, true);

    try {
        const res = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();

        if (data.success) {
            location.href = "/dashboard.html";
        } else {
            err.textContent = data.error || "اطلاعات نادرست!";
        }
    } catch {
        err.textContent = "خطای اتصال";
    }
    setLoading(btn, false);
};

document.getElementById("sendResetCodeBtn").onclick = async () => {
    const email = document.getElementById("forgotEmail").value.trim();
    const btn = document.getElementById("sendResetCodeBtn");
    const err = document.getElementById("forgotError");
    const suc = document.getElementById("forgotSuccess");

    err.textContent = "";
    suc.textContent = "";
    if (!email) return err.textContent = "ایمیل الزامی است!";

    setLoading(btn, true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/forgot-password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        });
        const data = await res.json();

        if (data.success) {
            resetEmail = email;
            suc.textContent = "کد ارسال شد";
            showPanel(panels.reset);
        } else err.textContent = data.error;
    } catch {
        err.textContent = "خطای اتصال";
    }
    setLoading(btn, false);
};

document.getElementById("changePasswordBtn").onclick = async () => {
    const code = document.getElementById("resetCode").value.trim();
    const p1 = document.getElementById("newPassword").value;
    const p2 = document.getElementById("newPassword2").value;
    const btn = document.getElementById("changePasswordBtn");
    const err = document.getElementById("resetError");

    err.textContent = "";
    if (p1 !== p2) return err.textContent = "رمزها برابر نیستند";
    if (p1.length < 6) return err.textContent = "رمز باید حداقل ۶ کاراکتر باشد!";

    setLoading(btn, true);
    try {
        const res = await fetch("http://127.0.0.1:5000/api/reset-password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: resetEmail, code, newPassword: p1})
        });
        const data = await res.json();

        if (data.success) {
            wrapper.classList.remove("forgot-mode");
            alert("رمز عبور با موفقیت تغییر کرد!");
            showPanel(panels.login);
        } else err.textContent = data.error;
    } catch {
        err.textContent = "خطای اتصال";
    }
    setLoading(btn, false);
};