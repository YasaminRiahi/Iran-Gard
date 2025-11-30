window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}


function initTypingAnimation() {
    const bioElement = document.querySelector('.profile-bio');

    if (bioElement) {
        const characterLimit = 80;
        let originalText = bioElement.textContent.trim();

        if (originalText.length > characterLimit) {
            originalText = originalText.substring(0, characterLimit) + '...';
        }

        bioElement.textContent = '';

        let charIndex = 0;
        const typingSpeed = 50;


        function typeChar() {
            if (charIndex < originalText.length) {
                bioElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                setTimeout(() => {
                    bioElement.style.removeProperty('position');
                    const style = document.createElement('style');
                    style.textContent = '.profile-bio::after { display: none; }';
                    document.head.appendChild(style);
                }, 500);
            }
        }

        setTimeout(typeChar, 500);
    }
}

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
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const indicator = document.getElementById('indicator');

    function updateIndicator(button) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = button.parentElement.getBoundingClientRect();
        const left = buttonRect.left - containerRect.left;

        indicator.style.width = buttonRect.width + 'px';
        indicator.style.left = left + 'px';
    }

    function switchTab(targetTab) {
        tabButtons.forEach(btn => btn.classList.remove('active'));

        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        activeButton.classList.add('active');

        tabContents.forEach(content => content.classList.add('hidden'));

        const targetContent = document.getElementById(targetTab);
        targetContent.classList.remove('hidden');

        updateIndicator(activeButton);

        const newAnimatedElements = targetContent.querySelectorAll('[data-animate]');
        newAnimatedElements.forEach(el => {
            el.classList.remove('animate-active');
            setTimeout(() => el.classList.add('animate-active'), 50);
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    window.addEventListener('load', () => {
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            updateIndicator(activeButton);
        }
    });

    window.addEventListener('resize', () => {
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            updateIndicator(activeButton);
        }
    });
}

function initFormHandler() {
    const form = document.querySelector('.profile-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // نمایش پیام موفقیت
            const submitBtn = form.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-check"></i> ذخیره شد!';
            submitBtn.classList.add('success-state');

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.classList.remove('success-state');
            }, 2000);
        });
    }
}

function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;

                const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
                const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

                let englishValue = finalValue;
                persianNumbers.forEach((num, index) => {
                    englishValue = englishValue.replace(new RegExp(num, 'g'), englishNumbers[index]);
                });

                const numValue = parseInt(englishValue);
                const duration = 2000;
                const steps = 60;
                const stepValue = numValue / steps;
                const stepDuration = duration / steps;

                let currentValue = 0;
                const timer = setInterval(() => {
                    currentValue += stepValue;

                    if (currentValue >= numValue) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        let displayValue = Math.floor(currentValue).toString();

                        englishNumbers.forEach((num, index) => {
                            displayValue = displayValue.replace(new RegExp(num, 'g'), persianNumbers[index]);
                        });

                        target.textContent = displayValue;
                    }
                }, stepDuration);

                observer.unobserve(target);
            }
        });
    }, {threshold: 0.5});

    statNumbers.forEach(stat => observer.observe(stat));
}

document.addEventListener('DOMContentLoaded', () => {
    // اسکرول به بالای صفحه
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    initTypingAnimation();
    initScrollAnimations();
    initTabs();
    initFormHandler();
    initStatsAnimation();
});

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


window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 20) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }

});