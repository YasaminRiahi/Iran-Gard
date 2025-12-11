/* ================================================================
   PROFILE PAGE JAVASCRIPT
   ================================================================
   
   Project: Iran Gard - Profile Page
   Description: Handles all interactive functionality for the profile page
   
   Table of Contents:
   1. Page Load & Scroll Management
   2. Typing Animation for Bio
   3. Scroll Animations Observer
   4. Tabs Navigation System
   5. Form Handler & Validation
   6. Stats Counter Animation
   7. Mobile Menu Management
   8. Friends Tab System
   9. Friend Request Actions
   10. Event Listeners & Initialization
   11. USER DATA INTEGRATION (API)
   ================================================================ */
import {
    getUserInformation,
    updateUserInformation,
    getURL,
} from "../services/users-service.js"

import {
    getFriends,
    removeFriend,
    getReceivedPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getSentPendingRequests,
    cancelFriendRequest
} from "../services/friendships-service.js"


/* ================================================================
   1. PAGE LOAD & SCROLL MANAGEMENT
   ================================================================ */

/**
 * Force scroll to top before page unload
 * Prevents browser from remembering scroll position
 */
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

/**
 * Disable browser scroll restoration
 * Ensures page always starts from top
 */
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}


/* ================================================================
   2. TYPING ANIMATION FOR BIO
   ================================================================ */

/**
 * Initialize typing animation effect for profile bio
 * Creates a typewriter effect with character limit and blinking cursor
 */
function initTypingAnimation() {
    const bioElement = document.querySelector('.profile-bio');

    if (bioElement) {
        const characterLimit = 80;
        let originalText = bioElement.textContent.trim();

        // Truncate text if it exceeds character limit
        if (originalText.length > characterLimit) {
            originalText = originalText.substring(0, characterLimit) + '...';
        }

        // Clear initial text
        bioElement.textContent = '';

        let charIndex = 0;
        const typingSpeed = 50; // milliseconds per character

        /**
         * Type one character at a time
         * Recursive function that adds characters with delay
         */
        function typeChar() {
            if (charIndex < originalText.length) {
                bioElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                // Remove blinking cursor after typing completes
                setTimeout(() => {
                    bioElement.style.removeProperty('position');
                    const style = document.createElement('style');
                    style.textContent = '.profile-bio::after { display: none; }';
                    document.head.appendChild(style);
                }, 500);
            }
        }

        // Start typing after initial delay
        setTimeout(typeChar, 500);
    }
}


/* ================================================================
   3. SCROLL ANIMATIONS OBSERVER
   ================================================================ */

/**
 * Initialize Intersection Observer for scroll animations
 * Adds/removes 'animate-active' class when elements enter/leave viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-active');
            } else {
                entry.target.classList.remove('animate-active');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of element is visible
    });

    // Observe all elements with data-animate attribute
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}


/* ================================================================
   4. TABS NAVIGATION SYSTEM
   ================================================================ */

/**
 * Initialize tab navigation system
 * Handles tab switching with animated indicator and content display
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const indicator = document.getElementById('indicator');

    /**
     * Update position and width of tab indicator
     * @param {HTMLElement} button - The active tab button
     */
    function updateIndicator(button) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = button.parentElement.getBoundingClientRect();
        const left = buttonRect.left - containerRect.left;

        indicator.style.width = buttonRect.width + 'px';
        indicator.style.left = left + 'px';
    }

    /**
     * Switch to specified tab
     * @param {string} targetTab - ID of the tab to switch to
     */
    function switchTab(targetTab) {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        activeButton.classList.add('active');

        // Hide all tab contents
        tabContents.forEach(content => content.classList.add('hidden'));

        // Show target content
        const targetContent = document.getElementById(targetTab);
        targetContent.classList.remove('hidden');

        // Update indicator position
        updateIndicator(activeButton);

        // Re-trigger animations for newly visible content
        const newAnimatedElements = targetContent.querySelectorAll('[data-animate]');
        newAnimatedElements.forEach(el => {
            el.classList.remove('animate-active');
            setTimeout(() => el.classList.add('animate-active'), 50);
        });
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Set initial indicator position on page load
    window.addEventListener('load', () => {
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            updateIndicator(activeButton);
        }
    });

    // Update indicator on window resize
    window.addEventListener('resize', () => {
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            updateIndicator(activeButton);
        }
    });
}


/* ================================================================
   5. FORM HANDLER & VALIDATION
   ================================================================ */

/**
 * Initialize profile form submission handler
 * Shows success message with animation on form submit
 */
function initFormHandler() {
    const form = document.querySelector('.profile-form');
    if (form) {
        form.addEventListener('submit', handleProfileSave);
    }
}


/* ================================================================
   6. STATS COUNTER ANIMATION
   ================================================================ */

/**
 * Initialize animated counter for stats numbers
 * Converts Persian numbers and animates count-up effect
 */
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;

                // Persian and English number mappings
                const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
                const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                // Convert Persian numbers to English for calculation
                let englishValue = finalValue;
                persianNumbers.forEach((num, index) => {
                    englishValue = englishValue.replace(new RegExp(num, 'g'), englishNumbers[index]);
                });

                const numValue = parseInt(englishValue);
                const duration = 1000; // Animation duration in ms
                const steps = 60; // Number of animation steps
                const stepValue = numValue / steps;
                const stepDuration = duration / steps;

                let currentValue = 0;

                // Animate counter
                const timer = setInterval(() => {
                    currentValue += stepValue;

                    if (currentValue >= numValue) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        let displayValue = Math.floor(currentValue).toString();

                        // Convert back to Persian numbers for display
                        englishNumbers.forEach((num, index) => {
                            displayValue = displayValue.replace(new RegExp(num, 'g'), persianNumbers[index]);
                        });

                        target.textContent = displayValue;
                    }
                }, stepDuration);

                // Unobserve after animation starts
                observer.unobserve(target);
            }
        });
    }, {threshold: 0.5}); // Trigger when 50% visible

    // Observe all stat number elements
    statNumbers.forEach(stat => observer.observe(stat));
}


/* ================================================================
   7. MOBILE MENU MANAGEMENT
   ================================================================ */

/**
 * Initialize mobile menu functionality
 * Creates and manages mobile navigation overlay
 */
function initMobileMenu() {
    // Mobile menu HTML structure
    const mobileMenuHTML = `
        <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-menu-header">
                <h3 style="color: white; margin: 0;">منو</h3>
                <button class="mobile-menu-close" id="mobileMenuClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mobile-menu-nav">
                <a href="./index.html" class="mobile-menu-item">خانه</a>
                <a href="./profile.html" class="mobile-menu-item active">پروفایل من</a>
                <a href="./trips/my-trips.html" class="mobile-menu-item">سفرهای من</a>
                <a href="./bookmarks.html" class="mobile-menu-item">بوک‌مارک‌ها</a>
            </nav>
        </div>
    `;

    // Inject mobile menu into DOM
    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);

    // Get menu elements
    const menuToggle = document.querySelector('.menu-toggle-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    /**
     * Close mobile menu
     * Removes active classes and restores body scroll
     */
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Open menu on toggle button click
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    }

    // Close menu on close button click
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Close menu on overlay click
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu);
    }
}


/* ================================================================
   8. FRIENDS TAB SYSTEM
   ================================================================ */

/**
 * Initialize friends section tab navigation
 * Handles switching between My Friends, Received Requests, Sent Requests, and Search
 */
const tabButtons = document.querySelectorAll('.friends-tab-btn');
const tabContents = document.querySelectorAll('.friends-tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and target content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        const cards = targetContent.querySelectorAll('.search-result-card');
        if (cards.length > 0) {
            cards.forEach((card, index) => {
                card.classList.remove('ready-to-animate', 'animated');
                card.style.opacity = '0';
                card.style.transform = 'translateX(100px)';

                setTimeout(() => {
                    card.classList.add('ready-to-animate');
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, 50);
                }, index * 100);
            });
        }
    });
});


function enhanceFriendsTabAnimations() {
    const tabButtons = document.querySelectorAll('.friends-tab-btn');
    const tabContents = document.querySelectorAll('.friends-tab-content');

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class with fade out
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Add active class with delay for smooth transition
            setTimeout(() => {
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                targetContent.classList.add('active');

                // Re-trigger animations for cards inside
                const cards = targetContent.querySelectorAll('.search-result-card, .friend-card');
                cards.forEach((card, i) => {
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 10);
                });
            }, 100);
        });

        // Add ripple effect on click
        button.addEventListener('mousedown', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple-effect 0.6s ease-out;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add this to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    enhanceFriendsTabAnimations();
});

// Add ripple animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


/* ================================================================
   9. EVENT LISTENERS & INITIALIZATION
   ================================================================ */

/**
 * Initialize all functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page load
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Initialize all modules
    loadUserData();
    initMobileMenu();
    initScrollAnimations();
    initTabs();
    initFormHandler();
});

/**
 * Smooth scroll for anchor links
 * Handles all links starting with #
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Header hide/show on scroll
 * Hides header when user scrolls down
 */
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 20) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
});


/* ================================================================
   10. USER DATA INTEGRATION (API)
   ================================================================ */

/**
 * Mappings for data translation and display
 */
const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Converts English digits in a string to Persian digits.
 * @param {string | number} input - The string or number to convert.
 * @returns {string} The string with Persian digits.
 */
function englishToPersianNumber(input) {
    let str = String(input);

    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i]);
    }
    return str;
}


/* ================================================================
   11. USER DATA INTEGRATION (API)
   ================================================================ */

function renderFriendsList(friendsData) {
    const friendsGrid = document.querySelector('.friends-grid');

    if (!friendsGrid) {
        console.error("friendsGrid not found!");
        return;
    }

    if (!friendsData || friendsData.length === 0) {
        friendsGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-users-slash"></i>
            <h3>هنوز دوستی ندارید</h3>
            <p>برای یافتن دوستان جدید به تب جستجو بروید.</p>
        </div>
    `;
        return;
    }

    const friendsHTML = friendsData.map((friend, index) => {
        const delay = index * 0.2;

        return `
            <div class="friend-card" data-animate="zoom-in" style="animation-delay: ${delay}s" data-user-id="${friend.user_id}">
                <img src="${getURL()+friend.profile_url || ""}" class="friend-image" alt="${friend.full_name}">
                
                <div class="friend-details">
                    <div class="friend-icon-wrapper">
                        <i class="fas fa-user-friends friend-icon"></i>
                    </div>
                    <h3 class="friend-name">${friend.full_name || friend.username}</h3>
                    <p class="friend-stats">${englishToPersianNumber(friend.common_number_of_trips)} سفر مشترک</p>
                </div>
                
                <div class="friend-popup">
                    <img src="${getURL()+friend.profile_url || ''}" class="popup-avatar" alt="${friend.full_name}">
                    <h3 class="popup-name">${friend.username}</h3>
                    <p class="popup-bio">${friend.about_me || 'بیوگرافی موجود نیست.'}</p>
                    <div class="popup-actions">
                        <button class="popup-btn-delete" data-username="${friend.username}" data-friendship-id="${friend.friendship_id}">
                            <i class="fas fa-user-minus"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    friendsGrid.innerHTML = friendsHTML;

    setTimeout(() => {
        const friendCards = friendsGrid.querySelectorAll('.friend-card[data-animate]');
        friendCards.forEach(card => {
            card.classList.add('animate-active');
        });
    }, 50);

    attachDeleteFriendListeners();
}
function attachDeleteFriendListeners() {
    const deleteButtons = document.querySelectorAll('.friend-card .popup-btn-delete');

    deleteButtons.forEach(button => {
        button.removeEventListener('click', deleteListener);
        button.addEventListener('click', deleteListener);
    });
}
function deleteListener(e) {
    e.stopPropagation();

    const username = this.getAttribute('data-username');
    const friendshipID = this.getAttribute('data-friendship-id');

    if (username && friendshipID) {
        handleDeleteFriend(username, friendshipID);
    }
}
async function handleDeleteFriend(username, friendshipID) {
    if (!username || !friendshipID) {
        console.error("Username or Friendship ID is missing for deletion.");
        return;
    }

    const result = await Swal.fire({
        text: `آیا مطمئن هستید که می‌خواهید ${'\u200f'}${username}${'\u200f'} را از لیست دوستان خود حذف کنید؟`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '!بله، حذف کن',
        cancelButtonText: 'انصراف',
        reverseButtons: true,
        confirmButtonColor: '#f5c9b0',
        cancelButtonColor: '#a6b28b',
        background: '#f0f0f0',
        color: '#4b5563',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        },
    });

    if (result.isConfirmed) {
        try {
            const response = await removeFriend(friendshipID);

            if (response && response.status) {
                try {
                    const friendsResponse = await getFriends();
                    console.log("Friends response:", friendsResponse);

                    if (friendsResponse && Array.isArray(friendsResponse)) {
                        renderFriendsList(friendsResponse);

                        const friendsCount = document.querySelector('.stat-item:nth-child(2) .stat-number');
                        if (friendsCount) {
                            friendsCount.textContent = englishToPersianNumber(friendsResponse.length);
                        }

                        await Swal.fire({
                            text: 'دوست شما با موفقیت حذف شد.',
                            icon: 'success',
                            confirmButtonText: 'تایید',
                            confirmButtonColor: '#a6b28b',
                            background: '#f0f0f0',
                            color: '#4b5563',
                            customClass: {
                                popup: 'my-swal-popup',
                                confirmButton: 'my-confirm-btn',
                            },
                        });
                    } else {
                        console.error("friendsResponse is not an array:", friendsResponse);
                        throw new Error("Failed to load friends list");
                    }
                } catch (fetchError) {
                    console.error("Error fetching friends:", fetchError);
                    Swal.fire({
                        text: 'دوست حذف شد. صفحه به‌روزرسانی می‌شود...',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                }

            } else {
                Swal.fire({
                    text: response.error || 'خطا در حذف دوست.',
                    icon: 'error',
                    confirmButtonText: 'تأیید',
                    iconColor: '#f5c9b0',
                    confirmButtonColor: '#a6b28b',
                    color: '#4b5563',
                    background: '#f0f0f0',
                    customClass: {
                        popup: 'my-swal-popup',
                        confirmButton: 'my-confirm-btn',
                    },
                });
            }
        } catch (error) {
            console.error('Error during friend deletion:', error);
            Swal.fire({
                text: 'در برقراری ارتباط با سرور مشکلی پیش آمد.',
                icon: 'error',
                confirmButtonText: 'تأیید',
                iconColor: '#f5c9b0',
                confirmButtonColor: '#a6b28b',
                color: '#4b5563',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                },
                buttonsStyling: false
            });
        }
    }
}

async function loadUserData() {
    try {
        // 1. Fetch data from the API
        const response = await getUserInformation();

        if (response && response.success === false) {
            console.error("API Error during data load:", response.error);
            return;
        }

        const userData = response;
        console.log('API Response Data:', userData);

        if (!userData || typeof userData.full_name === 'undefined') {
            console.error('API returned null or invalid data structure.');
            return;
        }

        // 2. Select HTML Elements )
        const profileName = document.querySelector('.profile-name');
        const profileBio = document.querySelector('.profile-bio');
        const avatarImage = document.querySelector('.organic-profile-avatar');
        const tripsCount = document.querySelector('.stat-item:nth-child(1) .stat-number');
        const friendsCount = document.querySelector('.stat-item:nth-child(2) .stat-number');

        // Form inputs
        const usernameInput = document.querySelector('input[placeholder="نام کاربری"]');
        const emailInput = document.querySelector('input[placeholder="ایمیل"]');
        const fullNameInput = document.querySelector('input[placeholder="نام و نام خانوادگی"]');
        const bioTextarea = document.querySelector('.form-textarea');
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');

        // 3. Update Elements with API Data

        // Header Section
        if (profileName) profileName.textContent = userData.full_name || 'کاربر ایران‌گرد';
        if (profileBio) profileBio.textContent = userData.about_me || "";
        if (typeof initTypingAnimation === "function") {
            initTypingAnimation();
        }
        if (avatarImage) avatarImage.src = getURL()+userData.profile_url || "";

        // Stats
        if (tripsCount)
            tripsCount.textContent = englishToPersianNumber(userData.number_of_trips);
        if (friendsCount)
            friendsCount.textContent = englishToPersianNumber(userData.number_of_friends);


        if (typeof initStatsAnimation === 'function') {
            initStatsAnimation();
        }
        // Profile Form
        if (usernameInput) usernameInput.value = userData.username || "";
        if (emailInput) emailInput.value = userData.email || "";
        if (fullNameInput) fullNameInput.value = userData.full_name || "";
        if (bioTextarea) bioTextarea.value = userData.about_me || "";

        // Gender Radio Buttons
        const apiGender = userData.gender || "";
        genderRadios.forEach(radio => {
            radio.checked = (radio.value === apiGender);
        });

        // Favorite Categories Checkboxes
        if (userData.favorite_categories && Array.isArray(userData.favorite_categories)) {
            categoryCheckboxes.forEach(checkbox => checkbox.checked = false);

            userData.favorite_categories.forEach(apiCategory => {
                const inputValue = apiCategory;
                categoryCheckboxes.forEach(checkbox => {
                    if (checkbox.value === inputValue) {
                        checkbox.checked = true;
                    }
                });
            });
        }

        //friends list
        const friendsResponse = await getFriends();

        if (friendsResponse && Array.isArray(friendsResponse)) {
            renderFriendsList(friendsResponse);
        } else {
            console.error("Failed to load friends list:", friendsResponse);
        }

        const receivedRequestsResponse = await getReceivedPendingRequests();
        let requestsData = [];

        if (receivedRequestsResponse && Array.isArray(receivedRequestsResponse)) {
            requestsData = receivedRequestsResponse;
            if (document.readyState === 'complete') {
                renderReceivedRequests(requestsData);
            } else {
                window.addEventListener('load', () => {
                    renderReceivedRequests(requestsData);
                });
            }
        } else {
            console.error("Failed to load received requests:", receivedRequestsResponse);
        }

        const sentRequestsResponse = await getSentPendingRequests();
        let sentRequests = [];
        if (sentRequestsResponse && Array.isArray(sentRequestsResponse)) {
            sentRequests = sentRequestsResponse;
            if (document.readyState === 'complete') {
                renderSentRequests(sentRequests);
            } else {
                window.addEventListener('load', () => {
                    renderSentRequests(sentRequests);
                });
            }
        } else {
            console.error("Failed to load sent requests:", sentRequestsResponse);
        }

        updateRequestsBadge(requestsData.length);
        updateSentRequestsBadge(sentRequests.length);

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}


async function handleProfileSave(e) {
    e.preventDefault();

    const submitButton = document.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;

    const fullName = document.querySelector('input[placeholder="نام و نام خانوادگی"]').value;
    const aboutMe = document.querySelector('.form-textarea').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || null;

    const favoriteCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(checkbox => checkbox.value);

    const payload = {
        full_name: fullName || null,
        about_me: aboutMe || null,
        gender: gender || null,
        favorite_categories: favoriteCategories,
    };


    try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ذخیره...';

        const response = await updateUserInformation(payload);

        if (response && response.success === false) {
            Swal.fire({
                text: response.error || 'خطا در به‌روزرسانی اطلاعات',
                icon: 'error',
                confirmButtonText: 'تأیید',
                iconColor: '#f5c9b0',
                confirmButtonColor: '#a6b28b',
                color: '#4b5563',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                },
            });
            return;
        }

        Swal.fire({
            text: 'اطلاعات پروفایل با موفقیت ذخیره شد',
            icon: 'success',
            confirmButtonText: 'تایید',
            iconColor: '#a6b28b',
            confirmButtonColor: '#a6b28b',
            color: '#4b5563',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
            },
        });

        loadUserData();

    } catch (error) {
        console.error('Error saving profile:', error);
        Swal.fire({
            text: 'خطا در ارتباط با سرور لطفا اتصال خود را بررسی کنید',
            icon: 'error',
            confirmButtonText: 'تأیید',
            iconColor: '#f5c9b0',
            confirmButtonColor: '#a6b28b',
            color: '#4b5563',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
            },
        });
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}


function renderReceivedRequests(requestsData) {
    const requestsGrid = document.getElementById('received-requests');
    if (!requestsGrid) return;

    if (!requestsData || requestsData.length === 0) {
        requestsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>درخواست دوستی جدیدی ندارید</h3>
            </div>
        `;
        return;
    }

    const requestsHTML = requestsData.map((request, index) => {
        const requester = request.requester;
        const requestDate = new Date(request.created_at).toLocaleDateString('fa-IR');

        return `
            <div class="search-result-card" data-index="${index}">
                <img src="${getURL() + requester.profile_url || ""}" class="search-result-avatar" alt="${requester.full_name}">
                
                <div class="search-result-info">
                    <h4 class="search-result-name">${requester.full_name || requester.username}</h4>
                    <p class="search-result-bio">${requester.about_me || 'بیوگرافی موجود نیست.'}</p>
                    <span class="request-badge">${englishToPersianNumber(requestDate)}</span>
                </div>
                
                <div class="search-result-actions request-actions">
                    <button class="btn-icon btn-add" title="قبول درخواست" data-action="accept" data-id="${request.friendship_id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon btn-view" title="رد درخواست" data-action="reject" data-id="${request.friendship_id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    requestsGrid.innerHTML = requestsHTML;

    requestAnimationFrame(() => {
        const cards = requestsGrid.querySelectorAll('.search-result-card');

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('ready-to-animate');
                setTimeout(() => {
                    card.classList.add('animated');
                }, 50);
            }, index * 100);
        });
    });

    attachRequestActionListeners();
}

function updateRequestsBadge(count) {
    const badgeElement = document.querySelector('.friends-tab-btn[data-tab="received-requests"] .badge');

    if (badgeElement) {
        const persianCount = englishToPersianNumber(count);
        badgeElement.textContent = persianCount;

        if (count > 0) {
            badgeElement.style.display = 'inline-flex';
        } else {
            badgeElement.style.display = 'none';
        }
    }
}

async function handleRequestAction(action, friendshipId) {
    try {
        let response;
        if (action === 'accept') {
            response = await acceptFriendRequest(friendshipId);
        } else if (action === 'reject') {
            response = await rejectFriendRequest(friendshipId);
        } else if (action === 'cancel') {
            response = await cancelFriendRequest(friendshipId);
        } else {
            return;
        }

        if (response && !response.detail && !response.error) {
            Swal.fire({
                text: `درخواست با موفقیت ${action === 'accept' ? 'پذیرفته' : 'رد'} شد.`,
                icon: 'success',
                confirmButtonText: 'تایید',
                confirmButtonColor: '#a6b28b',
                background: '#f0f0f0',
                color: '#4b5563',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                },
            });
            loadUserData();
        } else {
            Swal.fire({
                text: response.error || `خطا در ${action === 'accept' ? 'پذیرش' : 'رد'} درخواست.`,
                icon: 'error',
                confirmButtonText: 'تأیید',
                iconColor: '#f5c9b0',
                confirmButtonColor: '#a6b28b',
                color: '#4b5563',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                },
            });
        }
    } catch (error) {
        console.error(`Error during ${action} request:`, error);
    }
}

function attachRequestActionListeners() {
    const buttons = document.querySelectorAll('#received-requests .request-actions button');

    buttons.forEach(button => {
        button.removeEventListener('click', requestActionListener);

        button.addEventListener('click', requestActionListener);
    });
}

function requestActionListener(e) {
    const button = e.currentTarget;
    const action = button.getAttribute('data-action');
    const friendshipId = button.getAttribute('data-id');

    if (action && friendshipId) {
        handleRequestAction(action, friendshipId);
    }
}

function renderSentRequests(requestsData) {
    const requestsGrid = document.getElementById('sent-requests');
    if (!requestsGrid) return;

    if (!requestsData || requestsData.length === 0) {
        requestsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paper-plane"></i>
                <h3>درخواست ارسال شده‌ای ندارید</h3>
                <p>برای ارسال درخواست دوستی جدید به تب جستجو بروید.</p>
            </div>
        `;
        return;
    }

    const requestsHTML = requestsData.map((request, index) => {
        const addressee = request.addressee;
        const requestDate = new Date(request.created_at).toLocaleDateString('fa-IR');

        return `
            <div class="search-result-card" data-index="${index}">
                <img src="${getURL() + addressee.profile_url || ""}" class="search-result-avatar" alt="${addressee.full_name}">
                
                <div class="search-result-info">
                    <h4 class="search-result-name">${addressee.full_name || addressee.username}</h4>
                    <p class="search-result-bio">${addressee.about_me || 'بیوگرافی موجود نیست.'}</p>
                    <span class="request-badge">${englishToPersianNumber(requestDate)}</span>
                </div>
                
                <div class="search-result-actions request-actions">
                    <button class="btn-icon btn-view" title="لغو درخواست" data-action="cancel" data-id="${request.friendship_id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    requestsGrid.innerHTML = requestsHTML;

    requestAnimationFrame(() => {
        const cards = requestsGrid.querySelectorAll('.search-result-card');

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('ready-to-animate');
                setTimeout(() => {
                    card.classList.add('animated');
                }, 50);
            }, index * 100);
        });
    });

    attachSentRequestActionListeners();
}

function attachSentRequestActionListeners() {
    const buttons = document.querySelectorAll('#sent-requests .request-actions button');

    buttons.forEach(button => {
        button.removeEventListener('click', requestActionListener);
        button.addEventListener('click', requestActionListener);
    });
}
function updateSentRequestsBadge(count) {
    const badgeElement = document.querySelector('.friends-tab-btn[data-tab="sent-requests"] .badge');

    if (badgeElement) {
        const persianCount = englishToPersianNumber(count);
        badgeElement.textContent = persianCount;

        if (count > 0) {
            badgeElement.style.display = 'inline-flex';
        } else {
            badgeElement.style.display = 'none';
        }
    }
}
