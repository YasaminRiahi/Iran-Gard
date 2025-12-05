async function checkLoginStatus() {
    const token = localStorage.getItem("access_token");
    console.log("Token found:", !!token);

    if (!token) {
        console.log("No token, showing auth buttons");
        showAuthButtons();
        setupBookmarkButtonRedirect();
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/users/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log("User is authenticated, changing UI");
            changeSignupToLogout();
            hideLoginButton();
            setupBookmarkButtonNormal();
        } else {
            console.log("Auth failed, showing buttons");
            localStorage.removeItem("access_token");
            showAuthButtons();
            setupBookmarkButtonRedirect();
        }
    } catch (error) {
        console.error("Error checking login:", error);
        showAuthButtons();
        setupBookmarkButtonRedirect();
    }
}

function changeSignupToLogout() {
    const signupBtn = document.querySelector(".sign-un-button a.u-btn-1");

    if (signupBtn) {
        signupBtn.textContent = "خروج";
        signupBtn.classList.add("logout-btn");

        const newBtn = signupBtn.cloneNode(true);
        signupBtn.parentNode.replaceChild(newBtn, signupBtn);

        newBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (confirm("آیا می‌خواهید از حساب خود خارج شوید؟")) {
                localStorage.removeItem("access_token");

                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        });

        console.log("Changed signup button to logout");
    }
}

function hideLoginButton() {
    const loginBtn = document.querySelector(".log-in-button");

    if (loginBtn) {
        loginBtn.style.display = "none";
        console.log("Login button hidden");
    }
}

function showAuthButtons() {
    const signupBtn = document.querySelector(".sign-un-button a.u-btn-1");
    const loginBtn = document.querySelector(".log-in-button");

    if (signupBtn) {
        signupBtn.textContent = "ثبت‌نام";
        signupBtn.href = "login-signup.html?mode=signup";
        signupBtn.classList.remove("logout-btn");

        const newBtn = signupBtn.cloneNode(true);
        signupBtn.parentNode.replaceChild(newBtn, signupBtn);
    }

    if (loginBtn) {
        loginBtn.style.display = "block";
    }

    console.log("Auth buttons shown in default state");
}

function setupBookmarkButtonRedirect() {
    const bookmarkBtn = document.querySelector(".add-bookmark-button");

    if (bookmarkBtn) {
        const newBookmarkBtn = bookmarkBtn.cloneNode(true);
        bookmarkBtn.parentNode.replaceChild(newBookmarkBtn, bookmarkBtn);
        newBookmarkBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "../login-signup.html";
        });

        newBookmarkBtn.title = "برای افزودن بوک‌مارک، ابتدا وارد شوید";
        newBookmarkBtn.style.cursor = "default";
    }
}

function setupBookmarkButtonNormal() {
    const bookmarkBtn = document.querySelector(".add-bookmark-button");

    if (bookmarkBtn) {
        console.log("Setting up bookmark button for normal functionality");

        const newBookmarkBtn = bookmarkBtn.cloneNode(true);
        bookmarkBtn.parentNode.replaceChild(newBookmarkBtn, bookmarkBtn);
    }
}

function checkAuthBeforeBookmarkAction() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "../login-signup.html";
        return false;
    }
    return true;
}

function initializeBookmarkButtons() {
    const bookmarkButtons = document.querySelectorAll(".add-bookmark-button, [data-bookmark-action]");

    bookmarkButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            if (!checkAuthBeforeBookmarkAction()) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });
}

window.addEventListener("storage", function (e) {
    if (e.key === "access_token") {
        checkLoginStatus();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    initializeBookmarkButtons();
});