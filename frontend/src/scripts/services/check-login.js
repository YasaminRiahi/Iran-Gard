import { apiClient } from "/src/scripts/services/api-client.js";

async function checkLoginStatus() {
    const token = localStorage.getItem("access_token");

    try {
        const response = await apiClient.get('/users/me');

        if (response && response.success !== false) {
            console.log("User is authenticated");
            changeSignupToLogout();
            hideLoginButton();
            setupLogoutButton();
        } else {
            console.log("Auth failed");
            localStorage.removeItem("access_token");
            showAuthButtons();
            setupBookmarkButtonRedirect();
            setupRateReviewButtonRedirect();
            setupViewProfileButtonRedirect();
            setupViewTripsButtonRedirect();
            setupViewBookmarksButtonRedirect();
        }
    } catch (error) {
        console.error("Error checking login:", error);
        showAuthButtons();
        setupBookmarkButtonRedirect();
        setupRateReviewButtonRedirect();
        setupViewProfileButtonRedirect();
        setupViewTripsButtonRedirect();
        setupViewBookmarksButtonRedirect();
    }
}

function changeSignupToLogout() {
    const signupBtn = document.querySelector(".sign-up-button a.u-btn-1");

    if (signupBtn) {
        signupBtn.textContent = "خروج";
        signupBtn.classList.add("logout-btn");

        const newBtn = signupBtn.cloneNode(true);
        signupBtn.parentNode.replaceChild(newBtn, signupBtn);

        newBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            Swal.fire({
                text: "آیا می‌خواهید از حساب خود خارج شوید؟",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'خروج',
                cancelButtonText: 'انصراف',
                reverseButtons: true,
                confirmButtonColor: '#f5c9b0',
                cancelButtonColor: '#a6b28b',
                background: '#f0f0f0',
                color: '#4b5563',
                backdrop: 'rgba(0,0,0,0.5)',
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster'
                },
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("access_token");
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 100);
                }
            });
        });
    }
}


function setupLogoutButton() {
    const logoutBtn = document.querySelector(".logout-button");

    if (logoutBtn) {
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);

        newBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            Swal.fire({
                text: "آیا می‌خواهید از حساب خود خارج شوید؟",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'خروج',
                cancelButtonText: 'انصراف',
                reverseButtons: true,
                confirmButtonColor: '#f5c9b0',
                cancelButtonColor: '#a6b28b',
                background: '#f0f0f0',
                color: '#4b5563',
                backdrop: 'rgba(0,0,0,0.5)',
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster'
                },
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("access_token");
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 100);
                }
            });
        });
    }
}

function hideLoginButton() {
    const loginBtn = document.querySelector(".log-in-button");

    if (loginBtn) {
        loginBtn.style.display = "none";
    }
}

function showAuthButtons() {
    const signupBtn = document.querySelector(".sign-up-button a.u-btn-1");
    const loginBtn = document.querySelector(".log-in-button");

    if (signupBtn) {
        signupBtn.textContent = "ثبت‌نام";
        signupBtn.href = "/login-signup.html?mode=signup";
        signupBtn.classList.remove("logout-btn");

        const newBtn = signupBtn.cloneNode(true);
        signupBtn.parentNode.replaceChild(newBtn, signupBtn);
    }

    if (loginBtn) {
        loginBtn.style.display = "block";
    }
}

function setupBookmarkButtonRedirect() {
    const bookmarkBtn = document.querySelector(".add-bookmark-button");

    if (bookmarkBtn) {
        const newBookmarkBtn = bookmarkBtn.cloneNode(true);
        bookmarkBtn.parentNode.replaceChild(newBookmarkBtn, bookmarkBtn);
        newBookmarkBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "/login-signup.html";
        });

        newBookmarkBtn.title = "برای افزودن بوک‌مارک، ابتدا وارد شوید";
        newBookmarkBtn.style.cursor = "default";
    }
}

function setupRateReviewButtonRedirect() {
    const rateReviewBtn = document.querySelector(".add-rate-review");

    if (rateReviewBtn) {
        rateReviewBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "/login-signup.html";
        });

        rateReviewBtn.title = "برای افزودن امتیاز و نظر، ابتدا وارد شوید";
        rateReviewBtn.style.cursor = "default";
    }
}

function setupViewProfileButtonRedirect() {

    const viewProfileBtns = document.querySelectorAll(".view-profile");

    viewProfileBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "/login-signup.html";
        });

        newBtn.title = "برای مشاهده پروفایل، ابتدا وارد شوید";
        newBtn.style.cursor = "default";
    });
}

function setupViewTripsButtonRedirect() {
    const viewTripsBtns = document.querySelectorAll(".view-trips");

    viewTripsBtns.forEach(viewTripsBtn => {
        viewTripsBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "/login-signup.html";
        });

        viewTripsBtn.title = "برای مشاهده سفرها، ابتدا وارد شوید";
        viewTripsBtn.style.cursor = "default";
    });
}

function setupViewBookmarksButtonRedirect() {
    const viewBookmarksBtns = document.querySelectorAll(".view-bookmarks");

    viewBookmarksBtns.forEach(viewBookmarksBtn => {
        viewBookmarksBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = "/login-signup.html";
        });

        viewBookmarksBtn.title = "برای مشاهده بوک‌مارک‌ها، ابتدا وارد شوید";
        viewBookmarksBtn.style.cursor = "default";
    });
}

window.addEventListener("storage", function (e) {
    if (e.key === "access_token") {
        checkLoginStatus();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});