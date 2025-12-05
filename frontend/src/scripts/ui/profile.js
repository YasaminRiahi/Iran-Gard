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
   9. Search Functionality
   10. Friend Request Actions
   11. Event Listeners & Initialization
   
   ================================================================ */


/* ================================================================
   1. PAGE LOAD & SCROLL MANAGEMENT
   ================================================================ */

/**
 * Force scroll to top before page unload
 * Prevents browser from remembering scroll position
 */
window.addEventListener('beforeunload', function() {
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show success message
            const submitBtn = form.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-check"></i> ذخیره شد!';
            submitBtn.classList.add('success-state');

            // Reset button after 2 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.classList.remove('success-state');
            }, 2000);
        });
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
                const duration = 2000; // Animation duration in ms
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
    }, { threshold: 0.5 }); // Trigger when 50% visible

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
        button.addEventListener('mousedown', function(e) {
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
   9. SEARCH FUNCTIONALITY
   ================================================================ */

// Get search elements
const searchInput = document.querySelector('.search-input');
const searchResults = document.getElementById('search-results');

/**
 * Fake user database for search demonstration
 * In production, this would come from an API
 */
const users = [
    {
        name: 'حسین کاظمی',
        bio: 'عاشق طبیعت و کوه',
        avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
    },
    {
        name: 'زهرا احمدی',
        bio: 'گردشگر و بلاگر',
        avatar: 'https://randomuser.me/api/portraits/women/15.jpg'
    },
    {
        name: 'علی رضایی',
        bio: 'عکاس حرفه‌ای',
        avatar: 'https://randomuser.me/api/portraits/men/20.jpg'
    },
    {
        name: 'مینا جعفری',
        bio: 'عاشق سفر و ماجراجویی',
        avatar: 'https://randomuser.me/api/portraits/women/30.jpg'
    }
];

/**
 * Search input event handler
 * Filters users based on query and displays results
 */
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Show empty state if no query
    if (query.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-friends"></i>
                <h3>جستجوی دوستان جدید</h3>
                <p>برای یافتن دوستان جدید، نام کاربری آن‌ها را جستجو کنید</p>
            </div>
        `;
        return;
    }

    // Filter users based on query
    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query)
    );

    // Show no results message
    if (filtered.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>نتیجه‌ای یافت نشد</h3>
                <p>کاربری با این مشخصات پیدا نشد</p>
            </div>
        `;
        return;
    }

    // Display search results
    searchResults.innerHTML = filtered.map(user => `
        <div class="search-result-card">
            <img src="${user.avatar}" class="search-result-avatar" alt="${user.name}">
            <div class="search-result-info">
                <h4 class="search-result-name">${user.name}</h4>
                <p class="search-result-bio">${user.bio}</p>
            </div>
            <div class="search-result-actions">
                <button class="btn-icon btn-add" onclick="sendRequest(this)" title="ارسال درخواست">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="btn-icon btn-view" title="مشاهده پروفایل">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `).join('');
});


/* ================================================================
   10. FRIEND REQUEST ACTIONS
   ================================================================ */

/**
 * Send friend request
 * Changes button state to indicate request sent
 * @param {HTMLElement} button - The clicked add friend button
 */
function sendRequest(button) {
    const card = button.closest('.search-result-card');

    // Update button to show success state
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#10b981';
    button.disabled = true;
    button.title = 'درخواست ارسال شد';

    // Fade out card after delay
    setTimeout(() => {
        card.style.opacity = '0.5';
    }, 500);
}

/**
 * Handle accept/reject friend requests
 * Animates card removal on action
 */
document.addEventListener('click', (e) => {
    // Accept friend request
    if (e.target.closest('.btn-icon.btn-add') && e.target.closest('#received-requests')) {
        const card = e.target.closest('.search-result-card');
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 400);
    }

    // Reject friend request
    if (e.target.closest('.btn-icon.btn-view') && e.target.closest('#received-requests')) {
        const card = e.target.closest('.search-result-card');
        card.style.transform = 'translateX(-100%)';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 400);
    }
});


/* ================================================================
   11. EVENT LISTENERS & INITIALIZATION
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
    initMobileMenu();
    initTypingAnimation();
    initScrollAnimations();
    initTabs();
    initFormHandler();
    initStatsAnimation();
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
