async function checkLoginStatus() {
    const token = localStorage.getItem("access_token");
    console.log("Token found:", !!token);

    if (!token) {
        console.log("No token, showing auth buttons");
        showAuthButtons();
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
            console.log("User is authenticated, hiding buttons");
            hideAuthButtons();
        } else {
            console.log("Auth failed, showing buttons");
            localStorage.removeItem("access_token");
            showAuthButtons();
        }
    } catch (error) {
        console.error("Error checking login:", error);
        showAuthButtons();
    }
}

function hideAuthButtons() {
    const signupBtn = document.querySelector(".sign-un-button");
    const loginBtn = document.querySelector(".log-in-button");

    if (signupBtn) {
        signupBtn.style.visibility = "hidden";
    }
    if (loginBtn) {
        loginBtn.style.visibility = "hidden";
    }
}

function showAuthButtons() {
    const signupBtn = document.querySelector(".sign-un-button");
    const loginBtn = document.querySelector(".log-in-button");

    if (signupBtn) {
        signupBtn.style.visibility = "visible";
    }
    if (loginBtn) {
        loginBtn.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);