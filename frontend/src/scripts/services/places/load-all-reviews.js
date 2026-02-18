import { apiClient } from "/src/scripts/services/api-client.js";
import { getUserFullInfo, getURL } from "/src/scripts/services/users-service.js";


let reviewsData = [];
let allRatingsData = [];

function toPersianDigits(n) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, x => farsiDigits[x]);
}

function getInitials(username) {
    if (!username) return 'U';
    const words = username.trim().split(' ');
    return words.length >= 2
        ? (words[0][0] + words[1][0]).toUpperCase()
        : username.substring(0, 2).toUpperCase();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'دیروز';
    if (diffDays < 7) {
        return `${toPersianDigits(diffDays)} روز پیش`;
    }
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${toPersianDigits(weeks)} هفته پیش`;
    }
    const months = Math.floor(diffDays / 30);
    return `${toPersianDigits(months)} ماه پیش`;
}

function getRatingText(rating) {
    if (rating >= 4.5) return 'عالی';
    if (rating >= 3.5) return 'خوب';
    if (rating >= 2.5) return 'متوسط';
    if (rating >= 1.5) return 'ضعیف';
    return 'خیلی بد';
}

function createStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) starsHTML += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) starsHTML += '<i class="fas fa-star-half-alt"></i>';
        else starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

async function handleLike(reviewId, buttonElement) {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/login-signup.html";
        return;
    }

    if (buttonElement.disabled) return;
    buttonElement.disabled = true;

    const span = buttonElement.querySelector('span');
    const isLiked = buttonElement.classList.contains('liked');
    let currentCount = parseInt(buttonElement.getAttribute('data-like-count')) || 0;
    const newCount = isLiked ? currentCount - 1 : currentCount + 1;

    buttonElement.classList.toggle('liked');
    buttonElement.setAttribute('data-like-count', newCount);
    span.textContent = `مفید بود (${toPersianDigits(newCount)})`;

    try {
        await apiClient.post(`/places/reviews/${reviewId}/like`, {}, { includeAuth: true });
    } catch (error) {
        buttonElement.classList.toggle('liked');
        buttonElement.setAttribute('data-like-count', currentCount);
        span.textContent = `مفید بود (${toPersianDigits(currentCount)})`;

        if (error.status === 401) {
            window.location.href = "/login-signup.html";
        }
    } finally {
        buttonElement.disabled = false;
    }
}

function renderStats(allReviews) {
    const statsContainer = document.querySelector('.header-stats');
    if (allReviews.length === 0) {
        if (statsContainer) statsContainer.style.display = 'none';
        return;
    }
    if (statsContainer) statsContainer.style.display = 'block';

    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / allReviews.length).toFixed(1);

    document.querySelector('.rating-value').textContent = toPersianDigits(avg);
    document.querySelector('.rating-count').textContent = `${allReviews.length.toLocaleString('fa-IR')} امتیاز و نظر`;

    const starPercentage = (avg / 5) * 100;
    const mainStarsInner = document.getElementById('mainStarsInner');
    if (mainStarsInner) {
        mainStarsInner.style.width = starPercentage + "%";
    }

    const bars = document.querySelectorAll('.bar-fill');
    const labels = document.querySelectorAll('.distribution-label');

    [5, 4, 3, 2, 1].forEach((star, index) => {
        const count = allReviews.filter(r => Math.round(r.rating) === star).length;
        const percent = ((count / allReviews.length) * 100).toFixed(1);

        if (bars[index]) bars[index].style.width = `${percent}%`;
        if (labels[index]) {
            const starText = star === 5 ? 'عالی' : star === 4 ? 'خوب' : star === 3 ? 'متوسط' : star === 2 ? 'ضعیف' : 'خیلی بد';
            labels[index].textContent = `${starText} (${toPersianDigits(percent)}%)`;
        }
    });
}

function renderReviews(reviews) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (reviews.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="empty-state-container animate__animated animate__fadeIn">
                <div class="empty-state-icon">
                    <i class="fas fa-comment-slash"></i>
                </div>
                <h3 class="empty-state-title">نظری یافت نشد</h3>
                <p class="empty-state-text">نظری با این مشخصات در سیستم ثبت نشده است.</p>
            </div>`;
        return;
    }
    reviewsGrid.innerHTML = reviews.map(r => renderReviewCard(r)).join('');
    loadUserInfos(reviews);
}

function renderReviewCard(review) {
    const likedClass = review.is_liked_by_user ? 'liked' : '';
    const likeCountFarsi = toPersianDigits(review.like_count || 0);
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar" id="avatar-${review.review_id}">
                        <i class="fas fa-circle-notch fa-spin" style="font-size: 12px;"></i>
                    </div>
                    <div class="reviewer-details">
                        <h3 class="reviewer-name" id="username-${review.review_id}">...</h3>
                        <div class="review-date">${formatDate(review.created_at)}</div>
                    </div>
                </div>
                <div class="review-rating">
                    <div class="review-stars">${createStarsHTML(review.rating)}</div>
                    <span class="rating-text">${getRatingText(review.rating)}</span>
                </div>
            </div>
            <div class="review-content">
                <p class="review-text">${review.review}</p>
                ${review.images && review.images.length > 0 ? `
                    <div class="review-images">
                        ${review.images.map(img => `<div class="review-image"><img src="${img}" alt="محیط"></div>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="review-footer">
                <button class="helpful-btn ${likedClass}" 
                        data-review-id="${review.review_id}" 
                        data-like-count="${review.like_count || 0}">
                    <i class="fas fa-thumbs-up"></i>
                    <span>مفید بود (${likeCountFarsi})</span>
                </button>
            </div>
        </div>`;
}

async function loadUserInfos(reviews) {
    const userCache = {};
    const baseUrl = getURL();

    for (const review of reviews) {
        const userId = review.user_id;

        if (!userCache[userId]) {
            try {
                userCache[userId] = await getUserFullInfo(userId);
            } catch (e) {
                console.error(`Error fetching user ${userId}:`, e);
                userCache[userId] = { username: `کاربر ${userId}`, profile_url: null };
            }
        }

        const user = userCache[userId];
        const nameElem = document.getElementById(`username-${review.review_id}`);
        const avatarElem = document.getElementById(`avatar-${review.review_id}`);

        if (nameElem) nameElem.textContent = user.full_name || user.username;

        if (avatarElem) {
            if (user.profile_url) {
                const imageUrl = user.profile_url.startsWith('http')
                    ? user.profile_url
                    : baseUrl + user.profile_url;

                avatarElem.innerHTML = `<img src="${imageUrl}" 
                                             alt="${user.username}" 
                                             style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                avatarElem.style.background = "transparent";
            } else {
                avatarElem.innerHTML = `<span style="font-family:Vazirmatn; font-size:14px">${getInitials(user.username)}</span>`;
            }
        }
    }
}

function setupFiltersAndSort() {
    const tags = document.querySelectorAll('.filter-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const filterText = tag.textContent.trim();
            let filtered = [...reviewsData];

            if (filterText.includes('5')) {
                filtered = reviewsData.filter(r => r.rating === 5);
            } else if (filterText.includes('4')) {
                filtered = reviewsData.filter(r => r.rating === 4);
            } else if (filterText.includes('3') && !filterText.includes('کمتر')) {
                filtered = reviewsData.filter(r => r.rating === 3);
            } else if (filterText.includes('کمتر')) {
                filtered = reviewsData.filter(r => r.rating < 3);
            }

            renderReviews(filtered);
        });
    });

    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
        const sortType = e.target.value;
        let sorted = [...reviewsData];

        if (sortType === 'highest') sorted.sort((a, b) => b.rating - a.rating);
        else if (sortType === 'lowest') sorted.sort((a, b) => a.rating - b.rating);
        else if (sortType === 'newest') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        else if (sortType === 'most-helpful') sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));

        renderReviews(sorted);
    });
}

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    const reviewsGrid = document.getElementById('reviewsGrid');
    const headerStats = document.querySelector('.header-stats');

    if (!placeId) {
        if (reviewsGrid) reviewsGrid.innerHTML = '<p class="error">شناسه مکان یافت نشد.</p>';
        return;
    }

    document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());

    reviewsGrid?.addEventListener('click', async (e) => {
        const btn = e.target.closest('.helpful-btn');
        if (btn) await handleLike(btn.dataset.reviewId, btn);
    });

    try {
        const response = await apiClient.get(`/places/${placeId}/reviews`, { includeAuth: true });
        const rawData = Array.isArray(response) ? response : [];

        allRatingsData = rawData;
        reviewsData = rawData.filter(r => r.review !== null && r.review !== undefined && r.review.trim() !== "");
        reviewsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (allRatingsData.length > 0) {
            if (headerStats) headerStats.style.display = 'block';

            renderStats(allRatingsData);
            setupFiltersAndSort();
            renderReviews(reviewsData);
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) sortSelect.value = 'newest';

        } else {
            if (headerStats) headerStats.style.display = 'none';
            reviewsGrid.innerHTML = `
                <div class="empty-state-container animate__animated animate__fadeIn">
                    <div class="empty-state-icon"><i class="fas fa-comments"></i></div>
                    <h3 class="empty-state-title">هنوز امتیازی ثبت نشده</h3>
                    <p class="empty-state-text">اولین نفری باشید که تجربه خود را به اشتراک می‌گذارد.</p>
                </div>`;
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        if (headerStats) headerStats.style.display = 'none';
        if (reviewsGrid) reviewsGrid.innerHTML = '<p class="error">خطا در بارگذاری اطلاعات.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);