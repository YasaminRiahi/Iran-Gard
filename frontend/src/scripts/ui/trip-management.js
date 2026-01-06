/* ================================================================
   TRIP DETAIL PAGE - JAVASCRIPT
   ================================================================ */

import {
    getTripDetails,
    getUserFullInfo,
    getURL,
    voteOnLocation,
    autoGeneratePlaces,
    removeLocationFromTrip,
    updateVisitedStatus,
    getTripPlans,
    getTripExpenses,
    createExpense,
    updateExpense as updateExpenseAPI,
    deleteExpense as deleteExpenseAPI,
    getSettlement,
    addLocationToTrip,
    getPlacesForTrip,
    getAvailableFriends,
    inviteFriendToTrip,
    getPreviewPlaces,
    createTripPlan,
    votePlan as votePlanAPI,
    autoGeneratePlans as autoGeneratePlansAPI,
    deletePlan as deletePlanAPI,
    removeLocationFromPlan as removeLocationFromPlanAPI,
    updatePlanOrder,
    addLocationToPlan as addLocationToPlanAPI
} from '/src/scripts/services/trips-service.js';
/* ================================================================
   1. SCROLL MANAGEMENT
   ================================================================ */

window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 25) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
});

/* ================================================================
   2. FAKE DATA
   ================================================================ */

const urlParams = new URLSearchParams(window.location.search);
const TRIP_ID = urlParams.get('id');
let tripData = {};

async function fetchAndAssignTripData() {
    try {

        const response = await getTripDetails(TRIP_ID);

        // بر اساس اسکیمای شما، دیتا مستقیماً در response است یا اگر از Axios استفاده می‌کنی در response.data
        const data = response.data ? response.data : response;

        console.log('📦 دیتای دریافت شده از API:', data);


        const participantIds = data.participants || [];

        const participantsDetails = await Promise.all(
            participantIds.map(async (id) => {
                try {
                    const userRes = await getUserFullInfo(id);
                    const userData = userRes.data || userRes;
                    return {
                        id: userData.user_id,
                        name: userData.full_name || userData.username,
                        username: `${userData.username}`,
                        avatar: userData.profile_url || '/src/assets/images/default-avatar.png',
                        isCreator: userData.user_id === data.owner_id
                    };
                } catch (err) {
                    console.error(`خطا در دریافت اطلاعات کاربر ${id}:`, err);
                    return {
                        id,
                        name: `کاربر ${id}`,
                        avatar: '../src/assets/images/default-avatar.png',
                        isCreator: id === data.owner_id
                    };
                }
            })
        );
        tripData = {
            id: data.trip_id,
            ownerId: data.owner_id,
            name: data.city_names && data.city_names.length > 0
                ? `سفر به ${data.city_names.join(' و ')}`
                : 'جزئیات سفر',
            startDate: convertToPersianDate(data.start_date),
            endDate: convertToPersianDate(data.end_date),
            cities: data.city_names || [],
            status: data.status,
            coverImage: data.cover_image,
            participants: participantsDetails
        };

        if (data.places && Array.isArray(data.places)) {
            selectedLocations = data.places.map(place => ({
                id: place.id,
                name: place.name,
                category: getCategoryName(place.category),
                city: place.city,
                image: place.image || '',
                description: place.description,
                lat: place.lat,
                lng: place.lng,
                votes: place.votes || {likes: 0, dislikes: 0},
                userVote: place.userVote, // 'like', 'dislike' یا null
                visited: place.visited // true یا false
            }));
        } else {
            selectedLocations = [];
        }

        try {
            const expensesResponse = await getTripExpenses(TRIP_ID);
            const expensesData = expensesResponse.data || expensesResponse;

            expenses = expensesData.map(exp => ({
                id: exp.expense_id,
                category: exp.category,
                description: exp.description,
                amount: exp.amount,
                payerId: exp.payer_id,
                participants: exp.participants.map(p => ({
                    id: p.user_id,
                    share: p.share
                })),
                createdAt: exp.created_at
            }));

            console.log('✅ هزینه‌ها با موفقیت دریافت شدند:', expenses);
        } catch (expError) {
            console.warn('⚠️ خطا در دریافت هزینه‌ها:', expError);
            expenses = [];
        }

        updateHeroSection();
        renderLocations();
        renderParticipants();
        renderExpenses();

        if (typeof initMap === 'function') {
            initMap();
        }
        if (typeof initMap === 'function') {
            initMap();
        }

        console.log('✅ دیتای TripData با موفقیت آماده شد');

    } catch (error) {
        console.error('❌ خطا در fetchAndAssignTripData:', error);
        Swal.fire({
            icon: 'error',
            title: `${error} خطا در دریافت اطلاعات`,
            text: 'ساختار پاسخ سرور با کلاینت هماهنگ نیست یا سفر یافت نشد.',
            confirmButtonColor: '#A6B28B'
        });
    }
}

function populateDaySelect(data) {
    const daySelect = document.getElementById('planDaySelect');
    if (!daySelect || !data.start_date || !data.end_date) return;

    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    daySelect.innerHTML = '<option value="">انتخاب روز سفر</option>';

    for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(start.getTime() + (i * 24 * 60 * 60 * 1000));
        const dateString = currentDate.toISOString().split('T')[0];

        // تبدیل تاریخ به شمسی فقط برای نمایش به کاربر
        const persianDateLabel = convertToPersianDate(dateString);

        const option = document.createElement('option');
        option.value = dateString;
        option.textContent = `روز ${englishToPersianNumber(i + 1)} (${persianDateLabel})`;
        daySelect.appendChild(option);
    }
}

// ============ LOAD PLANS FROM API ============

let isEditing = false;
async function fetchAndRenderPlans() {
    try {
        if (isEditing) return;
        const response = await getTripPlans(TRIP_ID);
        const plansData = response.data?.plans || response.plans;

        // تبدیل داده‌های API به فرمت محلی
        dailyPlans = plansData.map(plan => ({
            id: plan.id,
            day: plan.title,
            city: plan.city,
            locations: plan.locations.map(loc => ({
                id: loc.id,
                name: loc.name,
                category: getCategoryName(loc.category),
                city: loc.city,
                image: loc.image || '',
                description: loc.description,
                lat: loc.lat,
                lng: loc.lng,
                votes: loc.votes || {likes: 0, dislikes: 0},
                estimatedTime: loc.estimatedTime || 'زمان تخمینی: 2 ساعت',
                order: loc.order
            })),
            votes: plan.votes || {likes: 0, dislikes: 0},
            userVote: plan.userVote
        }));

        renderDailyPlans();
        console.log('✅ Plans loaded successfully');

    } catch (error) {
        console.error('❌ Error loading plans:', error);
        dailyPlans = [];
        renderDailyPlans();
    }
}

// تابع جدید برای بروزرسانی Hero Section
function updateHeroSection() {
    // بروزرسانی عنوان
    const titleElement = document.querySelector('.trip-hero-title');
    if (titleElement) {
        titleElement.textContent = tripData.name;
    }

    // بروزرسانی تاریخ
    const dateElement = document.querySelector('.meta-item-hero:nth-child(1) .meta-value');
    if (dateElement) {
        dateElement.textContent = `${tripData.startDate} تا ${tripData.endDate}`;
    }

    // بروزرسانی مقصد
    const destinationElement = document.querySelector('.meta-item-hero:nth-child(2) .meta-value');
    if (destinationElement) {
        destinationElement.textContent = tripData.cities.join('، ');
    }

    // بروزرسانی تعداد همسفران
    const participantsElement = document.querySelector('.meta-item-hero:nth-child(3) .meta-value');
    if (participantsElement) {
        participantsElement.textContent = `${englishToPersianNumber(tripData.participants.length)} نفر`;
    }
}

function convertToPersianDate(dateString) {
    if (!dateString) return '---';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
}


let allLocationsData = [];
let selectedLocations = [];
let dailyPlans = [];
let expenses = [];
let map = null;

/* ================================================================
   3. TABS MANAGEMENT
   ================================================================ */

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
    document.getElementById(targetTab).classList.remove('hidden');

    updateIndicator(activeButton);

    // رفرش کردن نقشه وقتی به تب مکان‌ها برمی‌گردیم
    if (targetTab === 'locations' && map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
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

/* ================================================================
   4. MAP INITIALIZATION
   ================================================================ */

function initMap() {
    if (map) {
        map.remove();
    }

    map = L.map('locationsMap').setView([35.6892, 51.3890], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    updateMapMarkers();
}

function updateMapMarkers() {
    if (!map) return;

    // حذف مارکرهای قبلی
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // اضافه کردن مارکرهای جدید
    selectedLocations.forEach((location, index) => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Anjoman';">
                <strong>${location.name}</strong><br>
                <span style="color: #666;">${location.category}</span>
            </div>
        `);
    });

    // تنظیم view به تمام مارکرها
    if (selectedLocations.length > 0) {
        const bounds = L.latLngBounds(selectedLocations.map(loc => [loc.lat, loc.lng]));
        map.fitBounds(bounds, {padding: [50, 50]});
    }
}

/* ================================================================
   5. LOCATIONS TAB
   ================================================================ */

function renderLocations() {
    const locationsList = document.getElementById('locationsList');

    if (selectedLocations.length === 0) {
        locationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marked-alt"></i>
                <h3>هنوز مکانی انتخاب نشده است</h3>
                <p>برای شروع، روی دکمه "افزودن مکان" کلیک کنید</p>
            </div>
        `;
        return;
    }

    const sortedLocations = [...selectedLocations].sort((a, b) => {
        if (a.visited && !b.visited) return 1;
        if (!a.visited && b.visited) return -1;
        const aScore = a.votes.likes - a.votes.dislikes;
        const bScore = b.votes.likes - b.votes.dislikes;
        return bScore - aScore;
    });

    locationsList.innerHTML = sortedLocations.map((location, index) => `
        <div class="location-item ${location.visited ? 'visited' : ''}">
            <div class="location-rank">#${englishToPersianNumber(index + 1)}</div>
            
            <!-- دکمه حذف -->
            <button class="btn-remove-location" onclick="removeLocation(${location.id})" title="حذف مکان">
                <i class="fas fa-times"></i>
            </button>
            
            <!-- تیک مشاهده شده -->
            <button class="btn-visited-check ${location.visited ? 'checked' : ''}" 
                    onclick="toggleVisited(${location.id})" 
                    title="${location.visited ? 'مشاهده شده' : 'علامت‌گذاری به عنوان مشاهده شده'}">
                <i class="fas fa-check"></i>
            </button>
            
            <!-- تصویر کلیکی -->
            <div class="location-image-wrapper" onclick="viewLocation(${location.id})">
                <img src="${location.image}" alt="${location.name}" class="location-image">
                <div class="image-overlay">
                    <i class="fas fa-eye"></i>
                    <span>مشاهده جزئیات</span>
                </div>
            </div>
            
            <div class="location-info">
                <h3 class="location-name">${location.name}</h3>
                <p class="location-category">
                    <i class="fas fa-tag"></i> ${location.category}
                </p>
                <div class="location-voting">
                    <button class="vote-btn ${location.userVote === 'like' ? 'liked' : ''}" 
                            onclick="voteLocation(${location.id}, 'like')">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="vote-count">${englishToPersianNumber(location.votes.likes)}</span>
                    </button>
                    <button class="vote-btn ${location.userVote === 'dislike' ? 'disliked' : ''}" 
                            onclick="voteLocation(${location.id}, 'dislike')">
                        <i class="fas fa-thumbs-down"></i>
                        <span class="vote-count">${englishToPersianNumber(location.votes.dislikes)}</span>
                    </button>
                </div>
            </div>
            <div class="location-actions">
                <button class="btn-show-map" onclick="showLocationOnMap(${location.id})">
                    <i class="fas fa-map-marker-alt"></i> روی نقشه
                </button>
            </div>
        </div>
    `).join('');
}

async function removeLocation(locationId) {
    try {
        const location = selectedLocations.find(loc => loc.id === locationId);
        const locationName = location ? location.name : 'این مکان';

        const result = await Swal.fire({
            title: 'حذف مکان',
            html: `آیا مطمئن هستید که می‌خواهید <strong>${locationName}</strong> را از سفر حذف کنید؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف کن',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#f5c9b0',
            cancelButtonColor: '#a6b28b',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });

        if (result.isConfirmed) {

            const response = await removeLocationFromTrip(TRIP_ID, locationId);

            if (response && response.success) {
                selectedLocations = selectedLocations.filter(loc => loc.id !== locationId);

                renderLocations();
                if (typeof initMap === 'function') initMap();

                Swal.fire({
                    icon: 'success',
                    text: 'مکان مورد نظر با موفقیت از سفر شما حذف گردید.',
                    confirmButtonText: 'باشه',
                    confirmButtonColor: '#A6B28B',
                    background: '#f0f0f0',
                    timer: 2000,
                    customClass: {
                        popup: 'my-swal-popup',
                        confirmButton: 'my-confirm-btn'
                    }
                });
            }
        }
    } catch (error) {
        console.error(' Delete Location Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در حذف مکان',
            text: error.response?.data?.detail || 'متأسفانه مشکلی در حذف مکان پیش آمد.',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
    }
}


async function toggleVisited(locationId) {
    try {
        const location = selectedLocations.find(loc => loc.id === locationId);
        if (!location) return;

        const newStatus = !location.visited;

        const response = await updateVisitedStatus(TRIP_ID, locationId, newStatus);

        const result = response.data && response.data.data ? response.data.data : response.data;

        if (result) {
            location.visited = result.visited;

            renderLocations();
        }

    } catch (error) {
        console.error('Update Visited Error:', error);

        Swal.fire({
            icon: 'error',
            title: 'خطا در بروزرسانی',
            text: 'مشکلی در ثبت وضعیت بازدید به وجود آمد.',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            timer: 2000,
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

async function voteLocation(locationId, voteType) {
    try {
        const location = selectedLocations.find(loc => loc.id === locationId);
        if (!location) return;

        const finalVote = location.userVote === voteType ? null : voteType;

        const response = await voteOnLocation(TRIP_ID, locationId, finalVote);

        const result = response.data && response.data.data ? response.data.data : response.data;

        if (result) {
            location.votes = result.votes;
            location.userVote = result.userVote;
            renderLocations();
        }

    } catch (error) {
        console.error('❌ Vote Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ثبت رای',
            text: error.response?.data?.detail || 'مشکلی در ارتباط با سرور پیش آمد.',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

function viewLocation(locationId) {
    window.location.href = `../places/each-place.html?id=${locationId}`;
}

function showLocationOnMap(locationId) {
    const location = selectedLocations.find(loc => loc.id === locationId);
    if (!location || !map) return;

    map.setView([location.lat, location.lng], 15);

    window.scrollTo({
        top: document.querySelector('.locations-map').offsetTop - 150,
        behavior: 'smooth'
    });
}

/* ================================================================
   6. ADD LOCATION MODAL
   ================================================================ */

const addLocationModal = document.getElementById('addLocationModal');
const addLocationBtn = document.getElementById('addLocationBtn');
const closeLocationModal = document.getElementById('closeLocationModal');

addLocationBtn.addEventListener('click', () => {
    addLocationModal.classList.add('active');
    renderAvailableLocations();
});

closeLocationModal.addEventListener('click', () => {
    addLocationModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === addLocationModal) {
        addLocationModal.classList.remove('active');
    }
});

async function renderAvailableLocations() {
    const grid = document.getElementById('availableLocationsGrid');

    grid.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #A6B28B;"></i>
            <p style="margin-top: 1rem; color: #666;">در حال بارگذاری مکان‌ها...</p>
        </div>
    `;

    try {
        const response = await getPlacesForTrip(TRIP_ID);
        const data = response.data || response;

        if (!data.cities || data.cities.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>همه مکان‌ها اضافه شده‌اند</h3>
                    <p>در شهرهای ${tripData.cities.join('، ')} مکان دیگری برای افزودن وجود ندارد</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="modal-selected-header" style="${selectedLocationIds.length === 0 ? 'display: none;' : ''}">
                <span id="selectedCount">
                    <i class="fas fa-check-circle"></i>
                    ${englishToPersianNumber(selectedLocationIds.length)} مکان انتخاب شده
                </span>
            </div>
        `;

        html += data.cities.map(cityData => {
            const cityPlaces = cityData.places;

            return `
                <div class="city-locations-section">
                    <h3 class="city-section-title">
                        <i class="fas fa-city"></i>
                        ${cityData.city_name}
                        <span class="city-count">${englishToPersianNumber(cityPlaces.length)} مکان</span>
                    </h3>
                    <div class="city-locations-grid">
                        ${cityPlaces.map(place => `
                            <div class="available-location-card ${selectedLocationIds.includes(place.place_id) ? 'selected' : ''}" 
                                 data-place-id="${place.place_id}" 
                                 onclick="toggleLocationSelection(${place.place_id})">
                                <img src="${place.first_picture_url}" 
                                     alt="${place.place_name}"
                                     onerror="this.src='../src/assets/images/default-place.jpg'">
                                <div class="available-location-info">
                                    <h5>${place.place_name}</h5>
                                    <p><i class="fas fa-tag"></i> ${getCategoryName(place.category_id.toString()) || 'گردشگری'}</p>
                                    <div class="rating-container">
                                        ${place.avg_rating ? generateStarRating(place.avg_rating) : ""}
                                    <span class="rating-number">${place.avg_rating ? englishToPersianNumber(place.avg_rating.toFixed(1)) : ""}</span>
                                    </div>
                                    ${place.description ? `<p style="font-size: 0.8rem; margin-top: 0.5rem;">${place.description}</p>` : ''}
                                </div>
                            </div>
                            
                                
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // ✅ دکمه افزودن در پایین
        html += `
            <div class="modal-footer-actions" style="${selectedLocationIds.length === 0 ? 'display: none;' : ''}">
                <button id="addSelectedLocationsBtn" class="btn-add-selected">
                    <i class="fas fa-plus-circle"></i>
                    افزودن ${englishToPersianNumber(selectedLocationIds.length)} مکان به سفر
                </button>
            </div>
        `;

        grid.innerHTML = html;

        document.getElementById('addSelectedLocationsBtn')?.addEventListener('click', addSelectedLocationsToTrip);

    } catch (error) {
        console.error('❌ خطا در دریافت مکان‌ها:', error);
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #f87171;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h3>خطا در دریافت مکان‌ها</h3>
                <p style="margin-top: 0.5rem; color: #666;">
                    ${error.response?.data?.detail || error.message}
                </p>
                <button onclick="renderAvailableLocations()" 
                        style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #A6B28B; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-family: Anjoman;">
                    <i class="fas fa-redo"></i> تلاش مجدد
                </button>
            </div>
        `;
    }
}

function generateStarRating(rating) {
    console.log("ااهه")
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star-filled"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star-half"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star-empty"></i>';
    }

    return stars;
}

function toggleLocationSelection(placeId) {
    const card = document.querySelector(`.available-location-card[data-place-id="${placeId}"]`);

    if (selectedLocationIds.includes(placeId)) {
        selectedLocationIds = selectedLocationIds.filter(id => id !== placeId);
        card.classList.remove('selected');
    } else {
        selectedLocationIds.push(placeId);
        card.classList.add('selected');
    }

    updateSelectionUI();
}

// ✅ آپدیت UI
function updateSelectionUI() {
    const selectedHeader = document.querySelector('.modal-selected-header');
    const footer = document.querySelector('.modal-footer-actions');
    const countText = document.getElementById('selectedCount');
    const addBtn = document.getElementById('addSelectedLocationsBtn');

    if (selectedLocationIds.length > 0) {
        if (selectedHeader) selectedHeader.style.display = 'flex';
        if (footer) footer.style.display = 'block';
        if (countText) {
            countText.innerHTML = `
                <i class="fas fa-check-circle"></i>
                ${englishToPersianNumber(selectedLocationIds.length)} مکان انتخاب شده
            `;
        }
        if (addBtn) {
            addBtn.innerHTML = `
                <i class="fas fa-plus-circle"></i>
                افزودن ${englishToPersianNumber(selectedLocationIds.length)} مکان به سفر
            `;
        }
    } else {
        if (selectedHeader) selectedHeader.style.display = 'none';
        if (footer) footer.style.display = 'none';
    }
}

let selectedLocationIds = [];


async function addSelectedLocationsToTrip() {
    if (selectedLocationIds.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً حداقل یک مکان انتخاب کنید',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
        return;
    }

    try {
        Swal.fire({
            title: 'در حال افزودن...',
            text: `${englishToPersianNumber(selectedLocationIds.length)} مکان در حال افزودن`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });

        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (const locationId of selectedLocationIds) {
            try {
                const response = await addLocationToTrip(TRIP_ID, locationId);
                const result = response.data || response;
                if (result) {
                    const newLocation = {
                        id: result.id,
                        name: result.name,
                        category: result.category,
                        city: result.city,
                        image: result.image,
                        description: result.description,
                        lat: result.lat,
                        lng: result.lng,
                        votes: result.votes,
                        userVote: result.userVote,
                        visited: result.visited
                    };
                    selectedLocations.push(newLocation);
                    successCount++;
                }
            } catch (err) {
                failCount++;
                errors.push(err.response?.data?.detail || 'خطای نامشخص');
                console.error('خطا در افزودن مکان:', locationId, err);
            }
        }

        if (successCount > 0) {
            Swal.fire({
                icon: successCount === selectedLocationIds.length ? 'success' : 'warning',
                title: `  اضافه شد`,
                html: failCount > 0
                    ? `<p style="color: #f87171; margin-top: 0.5rem;">${englishToPersianNumber(failCount)} مکان اضافه نشد</p>`
                    : '',
                confirmButtonText: 'عالی',
                timer: 2000,
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            selectedLocationIds = [];
            renderLocations();
            updateMapMarkers();
            addLocationModal.classList.remove('active');
        } else {
            throw new Error('هیچ مکانی اضافه نشد');
        }

    } catch (error) {
        console.error('❌ خطا در افزودن مکان‌ها:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در افزودن مکان‌ها',
            text: error.message,
            confirmButtonText: 'عالی',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
    }
}
window.toggleLocationSelection = toggleLocationSelection;



/* ================================================================
   7. AUTO GENERATE LOCATIONS
   ================================================================ */

document.getElementById('autoGenerateBtn').addEventListener('click', async () => {
    const {value: topN} = await Swal.fire({
        text: 'در هر شهر چند مورد از برترین مکان‌ها اضافه شود؟ (این مکان ها بر اساس علاقه شما و دیگر کاربران به سفر افزوده میشوند)',
        input: 'number',
        inputAttributes: {
            min: 1,
            max: 20,
            lang: 'fa',
            dir: 'rtl',
            style: 'border-color: #A6B28B; direction: rtl; font-family: "Vazir", "Tahoma", sans-serif;'
        },
        inputValue: 3,
        showCancelButton: true,
        confirmButtonText: 'تولید برنامه',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#f5c9b0',
        background: '#f0f0f0',
        customClass: {
            input: 'custom-swal-input',
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }

    });

    if (topN) {
        autoGenerateLocationsReal(parseInt(topN));
    }
});

/* ================================================================
   8. DAILY PLANS TAB
   ================================================================ */

function renderDailyPlans() {
    const plansGrid = document.getElementById('plansGrid');

    if (dailyPlans.length === 0) {
        plansGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>هنوز پلن روزانه‌ای ایجاد نشده</h3>
                <p>برای ایجاد برنامه روزانه، روی دکمه "ایجاد پلن" کلیک کنید</p>
            </div>
        `;
        return;
    }

    const plansByDay = {};
    dailyPlans.forEach(plan => {
        if (!plansByDay[plan.day]) {
            plansByDay[plan.day] = [];
        }
        plansByDay[plan.day].push(plan);
    });

    const dayOrder = ['روز اول', 'روز دوم', 'روز سوم', 'روز چهارم', 'روز پنجم'];
    const sortedDays = Object.keys(plansByDay).sort((a, b) => {
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });

    plansGrid.innerHTML = sortedDays.map(day => {
        const dayPlans = plansByDay[day];

        const sortedDayPlans = dayPlans.sort((a, b) => {
            const aScore = a.votes.likes - a.votes.dislikes;
            const bScore = b.votes.likes - b.votes.dislikes;
            return bScore - aScore;
        });

        return `
            <div class="day-plans-section">
                <div class="day-header">
                    <div class="day-title">
                        <i class="fas fa-calendar-day"></i>
                        <span>${day}</span>
                    </div>
                    <div class="day-stats">
                        <span class="stat-badge">
                            <i class="fas fa-route"></i>
                            ${dayPlans.length} پلن
                        </span>
                        <span class="stat-badge">
                            <i class="fas fa-map-marker-alt"></i>
                            ${dayPlans.reduce((sum, plan) => sum + plan.locations.length, 0)} مکان
                        </span>
                    </div>
                </div>
                
                <div class="day-plans-grid">
                    ${sortedDayPlans.map(plan => `
                        <div class="plan-card" data-plan-id="${plan.id}">
                            <div class="plan-header">
                                <div class="plan-info">
                                    <div class="plan-title">${plan.city}</div>
                                    <div class="plan-subtitle">${plan.locations.length} مکان</div>
                                </div>
                                <div class="plan-header-actions">
                                    <button class="btn-edit-plan-inline" onclick="toggleEditPlan(${plan.id})" title="ویرایش">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete-plan" onclick="deletePlan(${plan.id})" title="حذف">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- حالت مشاهده عادی -->
                            <div class="plan-view-mode" id="plan-view-${plan.id}">
                                <div class="plan-locations" id="plan-locations-${plan.id}">
                                    ${plan.locations.map((loc, index) => `
                                        <div class="plan-location-item draggable" 
                                             draggable="false"
                                             data-location-id="${loc.id}"
                                             data-index="${index}">
                                            <div class="drag-handle">
                                                <i class="fas fa-grip-vertical"></i>
                                            </div>
                                            <div class="plan-location-number">${index + 1}</div>
                                            <div class="plan-location-info">
                                                <div class="plan-location-name">${loc.name}</div>
                                                <div class="plan-location-time">
                                                    <i class="fas fa-clock"></i>
                                                    ${loc.estimatedTime || 'زمان تخمینی: 2 ساعت'}
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- حالت ویرایش -->
                            <div class="plan-edit-mode hidden" id="plan-edit-${plan.id}">
                                <div class="edit-mode-header">
                                    <i class="fas fa-info-circle"></i>
                                    <span>مکان‌ها را بکشید و رها کنید تا ترتیب آن‌ها را تغییر دهید</span>
                                </div>
                                
                                <!-- دکمه افزودن مکان جدید -->
                                <div class="add-location-to-plan">
                                    <button class="btn-add-to-plan" onclick="showAddLocationToPlan(${plan.id})">
                                        <i class="fas fa-plus-circle"></i>
                                        افزودن مکان به این پلن
                                    </button>
                                </div>
                                
                                <!-- مکان‌های موجود برای افزودن -->
                                <div class="available-plan-locations hidden" id="available-locations-${plan.id}">
                                    <h4 style="margin-bottom: 1rem; color: var(--color-primary);">
                                        <i class="fas fa-map-marked-alt"></i>
                                        مکان‌های قابل افزودن از ${plan.city}:
                                    </h4>
                                    <div class="quick-add-locations">
                                        ${selectedLocations
            .filter(loc => loc.city === plan.city && !plan.locations.find(pl => pl.id === loc.id))
            .map(loc => `
                                                <div class="quick-add-location-item" onclick="addLocationToPlan(${plan.id}, ${loc.id})">
                                                    <img src="${loc.image}" alt="${loc.name}">
                                                    <div class="quick-add-info">
                                                        <span class="quick-add-name">${loc.name}</span>
                                                        <span class="quick-add-category">${loc.category}</span>
                                                    </div>
                                                    <button class="btn-quick-add">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            `).join('') || '<p style="text-align: center; color: #9ca3af; padding: 1rem;">همه مکان‌های این شهر قبلاً اضافه شده‌اند</p>'}
                                    </div>
                                </div>
                                
                                <div class="plan-locations editable" id="plan-locations-edit-${plan.id}">
                                    ${plan.locations.map((loc, index) => `
                                        <div class="plan-location-item draggable editable" 
                                             draggable="true"
                                             data-location-id="${loc.id}"
                                             data-index="${index}">
                                            <div class="drag-handle active">
                                                <i class="fas fa-grip-vertical"></i>
                                            </div>
                                            <div class="plan-location-number">${index + 1}</div>
                                            <div class="plan-location-info">
                                                <div class="plan-location-name">${loc.name}</div>
                                                <div class="plan-location-time">
                                                    <i class="fas fa-clock"></i>
                                                    ${loc.estimatedTime || 'زمان تخمینی: 2 ساعت'}
                                                </div>
                                            </div>
                                            <button class="btn-remove-from-plan" onclick="removeLocationFromPlan(${plan.id}, ${loc.id})">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="edit-mode-actions">
                                    <button class="btn-save-plan-order" onclick="savePlanOrder(${plan.id})">
                                        <i class="fas fa-check"></i> ذخیره تغییرات
                                    </button>
                                    <button class="btn-cancel-edit" onclick="toggleEditPlan(${plan.id})">
                                        <i class="fas fa-times"></i> انصراف
                                    </button>
                                </div>
                            </div>
                            
                            <div class="plan-voting">
                                <button class="plan-vote-btn ${plan.userVote === 'like' ? 'liked' : ''}" 
                                        onclick="votePlan(${plan.id}, 'like')">
                                    <i class="fas fa-thumbs-up"></i>
                                    <span class="vote-count">${plan.votes.likes}</span>
                                </button>
                                <button class="plan-vote-btn ${plan.userVote === 'dislike' ? 'disliked' : ''}" 
                                        onclick="votePlan(${plan.id}, 'dislike')">
                                    <i class="fas fa-thumbs-down"></i>
                                    <span class="vote-count">${plan.votes.dislikes}</span>
                                </button>
                            </div>
                            <div class="plan-actions">
                                <button class="btn-view-plan" onclick="viewPlanOnPlanMap(${plan.id})">
                                    <i class="fas fa-map"></i> مشاهده روی نقشه
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    initDragAndDrop();
}

function showAddLocationToPlan(planId) {
    const availableSection = document.getElementById(`available-locations-${planId}`);
    availableSection.classList.toggle('hidden');
}

async function addLocationToPlan(planId, locationId) {
    try {
        await addLocationToPlanAPI(TRIP_ID, planId, locationId);

        const location = selectedLocations.find(loc => loc.id === locationId);

        Swal.fire({
            icon: 'success',
            text: `${location.name} به پلن اضافه شد`,
            confirmButtonText: 'عالی',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            timer: 2000,
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });

        await fetchAndRenderPlans();

    } catch (error) {
        console.error('❌ Error adding location:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

let draggedElement = null;

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable[draggable="true"]');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
        draggable.addEventListener('dragover', handleDragOver);
        draggable.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('.draggable').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(this.parentElement, e.clientY);
    if (afterElement == null) {
        this.parentElement.appendChild(draggedElement);
    } else {
        this.parentElement.insertBefore(draggedElement, afterElement);
    }

    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    return false;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}

function toggleEditPlan(planId) {
    const viewMode = document.getElementById(`plan-view-${planId}`);
    const editMode = document.getElementById(`plan-edit-${planId}`);

    if (viewMode.classList.contains('hidden')) {
        // بستن حالت ویرایش
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
    } else {
        // باز کردن حالت ویرایش
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
        initDragAndDrop();
    }
}

async function savePlanOrder(planId) {
    const container = document.getElementById(`plan-locations-edit-${planId}`);
    const items = container.querySelectorAll('.plan-location-item');

    const locationIds = Array.from(items).map(item =>
        parseInt(item.dataset.locationId)
    );

    try {
        await updatePlanOrder(TRIP_ID, planId, locationIds);

        Swal.fire({
            icon: 'success',
            text: 'ترتیب مکان‌ها با موفقیت به‌روزرسانی شد',
            confirmButtonText: 'عالی',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            timer: 2000,
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });

        toggleEditPlan(planId);
        await fetchAndRenderPlans();

    } catch (error) {
        console.error('❌ Error updating order:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در بروزرسانی',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}


async function removeLocationFromPlan(planId, locationId) {
    try {
        await removeLocationFromPlanAPI(TRIP_ID, planId, locationId);

        const container = document.getElementById(`plan-locations-edit-${planId}`);
        const items = container.querySelectorAll('.plan-location-item');

        items.forEach((item) => {
            if (parseInt(item.dataset.locationId) === locationId) {
                item.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(async () => {
                    await fetchAndRenderPlans();
                }, 300);
            }
        });

    } catch (error) {
        console.error('❌ Error removing location:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

async function deletePlan(planId) {
    const plan = dailyPlans.find(p => p.id === planId);

    const result = await Swal.fire({
        text: `آیا مطمئن هستید که می‌خواهید پلن "${plan.day}" را حذف کنید؟`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#f5c9b0',
        cancelButtonColor: '#a6b28b',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    });

    if (result.isConfirmed) {
        try {
            await deletePlanAPI(TRIP_ID, planId);

            Swal.fire({
                icon: 'success',
                text: 'پلن با موفقیت حذف شد',
                confirmButtonText: 'باشه',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                timer: 2000,
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            await fetchAndRenderPlans();

        } catch (error) {
            console.error('❌ Error deleting plan:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا در حذف پلن',
                text: error.response?.data?.detail || 'مشکلی پیش آمد',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });
        }
    }
}

async function votePlan(planId, voteType) {
    try {
        const plan = dailyPlans.find(p => p.id === planId);
        const finalVote = plan.userVote === voteType ? null : voteType;

        await votePlanAPI(TRIP_ID, planId, finalVote);
        await fetchAndRenderPlans();

    } catch (error) {
        console.error('❌ Error voting:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

let plansMap = null;

function initPlansMap() {
    if (plansMap) {
        plansMap.remove();
    }

    plansMap = L.map('plansMap').setView([35.6892, 51.3890], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(plansMap);
}

function viewPlanOnPlanMap(planId) {
    const plan = dailyPlans.find(p => p.id === planId);
    if (!plan) return;

    if (!plansMap) {
        initPlansMap();
    }

    // پاک کردن لایه‌های قبلی
    plansMap.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            plansMap.removeLayer(layer);
        }
    });

    const latlngs = plan.locations.map(loc => [loc.lat, loc.lng]);

    // اضافه کردن مارکرها
    plan.locations.forEach((loc, index) => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(plansMap);
        marker.bindPopup(`
                <div style="text-align: center; font-family: 'Anjoman';">
                    <strong>${index + 1}. ${loc.name}</strong><br>
                    <span style="color: #666;">${loc.estimatedTime || 'زمان تخمینی: 2 ساعت'}</span>
                </div>
            `);
    });

    // اضافه کردن خط مسیر
    const polyline = L.polyline(latlngs, {
        color: '#A6B28B',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(plansMap);

    // اضافه کردن فلش‌ها برای نشان دادن جهت
    const decorator = L.polylineDecorator(polyline, {
        patterns: [
            {
                offset: 25,
                repeat: 100,
                symbol: L.Symbol.arrowHead({
                    pixelSize: 15,
                    pathOptions: {
                        fillOpacity: 1,
                        weight: 0,
                        color: '#A6B28B'
                    }
                })
            }
        ]
    }).addTo(plansMap);

    plansMap.fitBounds(polyline.getBounds(), {padding: [50, 50]});

    document.querySelector('.plans-map').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// اضافه کردن به event listener تب‌ها
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        switchTab(targetTab);

        // اگر به تب پلن‌ها رفتیم، مپ رو init کن
        if (targetTab === 'daily-plans' && !plansMap) {
            setTimeout(() => {
                initPlansMap();
            }, 100);
        }
    });
});


/* ================================================================
   9. CREATE PLAN MODAL
   ================================================================ */

const createPlanModal = document.getElementById('createPlanModal');
const createPlanBtn = document.getElementById('createPlanBtn');
const closePlanModal = document.getElementById('closePlanModal');
let selectedPlanLocations = [];

createPlanBtn.addEventListener('click', () => {
    createPlanModal.classList.add('active');
    initPlanModal();
});

closePlanModal.addEventListener('click', () => {
    createPlanModal.classList.remove('active');
    selectedPlanLocations = [];
});

window.addEventListener('click', (e) => {
    if (e.target === createPlanModal) {
        createPlanModal.classList.remove('active');
        selectedPlanLocations = [];
    }
});

function initPlanModal() {
    const daySelect = document.getElementById('planDaySelect');
    daySelect.innerHTML = '<option value="">روز را انتخاب کنید...</option>';

    const days = ['روز اول', 'روز دوم', 'روز سوم', 'روز چهارم', 'روز پنجم'];
    days.forEach((day, index) => {
        daySelect.innerHTML += `<option value="${day}">${day}</option>`;
    });

    const citySelect = document.getElementById('planCitySelect');
    citySelect.innerHTML = '<option value="">شهر را انتخاب کنید...</option>';
    tripData.cities.forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });

    // ریست گرید
    document.getElementById('availablePlanLocationsGrid').innerHTML =
        '<p style="text-align: center; color: #9ca3af; padding: 2rem;">ابتدا یک شهر انتخاب کنید</p>';

    selectedPlanLocations = [];
    updatePlanLocationsList();
}

/* ================================================================
   10. PLAN LOCATION SELECTION
   ================================================================ */

document.getElementById('planCitySelect').addEventListener('change', async function () {
    const city = this.value;
    const grid = document.getElementById('availablePlanLocationsGrid');

    if (!city) {
        grid.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">ابتدا یک شهر انتخاب کنید</p>';
        return;
    }

    grid.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #A6B28B;"></i>
            <p style="margin-top: 1rem; color: #666;">در حال بارگذاری مکان‌ها...</p>
        </div>
    `;

    try {
        // استفاده از preview-places برای نمایش مکان‌های شهر
        const response = await getPreviewPlaces([city]);
        const data = response.data || response;

        const cityData = data.cities.find(c => c.city_name === city);

        if (!cityData || cityData.places.length === 0) {
            grid.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem; display: block;"></i>
                    <h3 style="color: #4b5563; margin-bottom: 0.5rem;">مکانی در ${city} یافت نشد</h3>
                </div>
            `;
            return;
        }

        // رندر مکان‌ها
        let html = `
            <div class="city-locations-section">
                <h3 class="city-section-title">
                    <i class="fas fa-map-marked-alt"></i> مکان‌های ${city}
                    <span class="city-count">${cityData.places.length} مکان</span>
                </h3>
                <div class="city-locations-grid">
        `;

        cityData.places.forEach(place => {
            const isSelected = selectedPlanLocations.includes(place.place_id);
            html += `
                <div class="available-location-card ${isSelected ? 'selected' : ''}" 
                     onclick="togglePlanLocation(${place.place_id})"
                     style="cursor: pointer;">
                    <img src="${place.first_picture_url}" alt="${place.place_name}">
                    <div class="available-location-info">
                        <h4>${place.place_name}</h4>
                        <p><i class="fas fa-tag"></i> ${getCategoryName(place.category_id.toString())}</p>
                        ${place.avg_rating ? `
                            <div class="rating-container">
                                ${generateStarRating(place.avg_rating)}
                                <span class="rating-number">${englishToPersianNumber(place.avg_rating.toFixed(1))}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        console.log(html);

        grid.innerHTML = html;

    } catch (error) {
        console.error('❌ Error loading places:', error);
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #f87171;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h3>خطا در دریافت مکان‌ها</h3>
                <p style="margin-top: 0.5rem; color: #666;">
                    ${error.response?.data?.detail || error.message}
                </p>
            </div>
        `;
    }
});
function togglePlanLocation(locationId) {
    console.log('🔄 Toggle plan location:', locationId);
    console.log('  Current selectedPlanLocations:', selectedPlanLocations);

    const index = selectedPlanLocations.indexOf(locationId);

    if (index > -1) {
        selectedPlanLocations.splice(index, 1);
        console.log('  ➖ Removed from selection');
    } else {
        selectedPlanLocations.push(locationId);
        console.log('  ➕ Added to selection');
    }

    console.log('  New selectedPlanLocations:', selectedPlanLocations);

    updatePlanLocationsList();

    // آپدیت ویژوال کارت‌ها
    document.querySelectorAll('.available-location-card').forEach(card => {
        const cardOnclick = card.getAttribute('onclick');
        if (cardOnclick) {
            const cardLocationId = parseInt(cardOnclick.match(/\d+/)[0]);
            if (selectedPlanLocations.includes(cardLocationId)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        }
    });
}

function updatePlanLocationsList() {
    const listContainer = document.getElementById('planLocationsList');

    console.log('📋 Updating plan locations list');
    console.log('  Selected IDs:', selectedPlanLocations);

    if (selectedPlanLocations.length === 0) {
        listContainer.innerHTML = '<p style="color: #9ca3af;">هیچ مکانی انتخاب نشده</p>';
        return;
    }

    listContainer.innerHTML = selectedPlanLocations.map(locId => {
        const location = selectedLocations.find(loc => loc.id === locId);
        if (!location) {
            console.warn('⚠️ Location not found for ID:', locId);
            return '';
        }
        return `
            <span class="plan-location-tag">
                ${location.name}
                <button onclick="removePlanLocation(${locId}); event.stopPropagation();" style="background: none; border: none; color: #f5c9b0; cursor: pointer; margin-right: 0.5rem;">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `;
    }).join('');

    console.log('✅ Plan locations list updated');
}

function removePlanLocation(locationId) {
    console.log('🗑️ Remove plan location:', locationId);
    const index = selectedPlanLocations.indexOf(locationId);
    if (index > -1) {
        selectedPlanLocations.splice(index, 1);
        updatePlanLocationsList();

        // آپدیت ویژوال
        document.querySelectorAll('.available-location-card').forEach(card => {
            const cardOnclick = card.getAttribute('onclick');
            if (cardOnclick) {
                const cardLocationId = parseInt(cardOnclick.match(/\d+/)[0]);
                if (cardLocationId === locationId) {
                    card.classList.remove('selected');
                }
            }
        });
    }
}

document.getElementById('savePlanBtn').addEventListener('click', async () => {
    const day = document.getElementById('planDaySelect').value;
    const city = document.getElementById('planCitySelect').value;

    if (!day || !city) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً روز و شهر را انتخاب کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
        return;
    }

    if (selectedPlanLocations.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً حداقل یک مکان انتخاب کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
        return;
    }

    try {
        Swal.fire({
            title: 'در حال ذخیره...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const planPayload = {
            title: day,
            city: city,
            locationIds: selectedPlanLocations
        };

        const response = await createTripPlan(TRIP_ID, planPayload);
        const createdPlan = response.data || response;

        Swal.fire({
            icon: 'success',
            text: `پلن ${day} با موفقیت ذخیره شد`,
            confirmButtonText: 'عالی',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            timer: 2000,
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });

        createPlanModal.classList.remove('active');
        selectedPlanLocations = [];

        // رفرش لیست پلن‌ها
        await fetchAndRenderPlans();

    } catch (error) {
        console.error('❌ Error creating plan:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ایجاد پلن',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
});

/* ================================================================
   11. AUTO GENERATE PLANS
   ================================================================ */

document.getElementById('autoPlanBtn').addEventListener('click', async () => {
    const {value: locationsPerDay} = await Swal.fire({
        text: 'در هر روز چند مکان قرار گیرد؟',
        input: 'number',
        inputAttributes: {
            min: 1,
            max: 10,
            lang: 'fa',
            dir: 'rtl',
            style: 'border-color: #A6B28B; direction: rtl; font-family: "Vazir", "Tahoma", sans-serif;'
        },
        inputValue: 3,
        showCancelButton: true,
        confirmButtonText: 'تولید برنامه',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#f5c9b0',
        background: '#f0f0f0',
        customClass: {
            input: 'custom-swal-input',
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    });

    if (locationsPerDay) {
        try {
            Swal.fire({
                title: 'در حال تولید...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await autoGeneratePlansAPI(TRIP_ID, parseInt(locationsPerDay));

            Swal.fire({
                icon: 'success',
                text: 'پلن‌های روزانه به صورت خودکار ایجاد شد',
                confirmButtonText: 'عالی',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                timer: 2000,
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            await fetchAndRenderPlans();

        } catch (error) {
            console.error('❌ Error auto-generating:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: error.response?.data?.detail || 'مشکلی پیش آمد',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });
        }
    }
});

function autoGeneratePlans() {
    if (selectedLocations.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'ابتدا باید مکان‌هایی به سفر اضافه کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
        return;
    }

    // شبیه‌سازی: تقسیم مکان‌ها به روزهای مختلف
    const locationsPerDay = 3;
    const days = ['روز اول', 'روز دوم', 'روز سوم'];
    let locationIndex = 0;

    days.forEach((day, dayIndex) => {
        const dayLocations = selectedLocations.slice(
            locationIndex,
            locationIndex + locationsPerDay
        );

        if (dayLocations.length > 0) {
            const newPlan = {
                id: dailyPlans.length + dayIndex + 1,
                day: day,
                city: tripData.cities[0],
                locations: dayLocations.map(loc => ({
                    ...loc,
                    estimatedTime: 'زمان تخمینی: 2 ساعت'
                })),
                votes: {
                    likes: Math.floor(Math.random() * 30) + 10,
                    dislikes: Math.floor(Math.random() * 5)
                },
                userVote: null
            };

            dailyPlans.push(newPlan);
            locationIndex += locationsPerDay;
        }
    });

    Swal.fire({
        icon: 'success',
        text: 'پلن‌های روزانه به صورت خودکار ایجاد شد',
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn'
        }
    });

    renderDailyPlans();
}

/* ================================================================
   12. EXPENSES TAB
   ================================================================ */
let editingExpenseId = null;
function renderExpenses() {
    const expensesList = document.getElementById('expensesList');

    if (expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-wallet"></i>
                <h3>هنوز هزینه‌ای ثبت نشده</h3>
                <p>برای ثبت هزینه، روی دکمه "ثبت هزینه جدید" کلیک کنید</p>
            </div>
        `;
        updateExpensesSummary();
        return;
    }

    const categoryIcons = {
        food: 'fa-utensils',
        transport: 'fa-car',
        accommodation: 'fa-bed',
        entertainment: 'fa-ticket-alt',
        shopping: 'fa-shopping-bag',
        other: 'fa-ellipsis-h'
    };

    const categoryNames = {
        food: 'غذا',
        transport: 'حمل‌ونقل',
        accommodation: 'اقامت',
        entertainment: 'سرگرمی',
        shopping: 'خرید',
        other: 'سایر'
    };

    expensesList.innerHTML = expenses.map(expense => {
        const payer = tripData.participants.find(p => p.id === expense.payerId);
        const participantNames = expense.participants.map(p => {
            const participant = tripData.participants.find(part => part.id === p.id);
            return participant ? `${participant.username} (${englishToPersianNumber(p.share.toLocaleString())}تومان)` : '';
        }).filter(Boolean).join('، ');

        return `
            <div class="expense-item">
                <div class="expense-category-icon ${expense.category}">
                    <i class="fas ${categoryIcons[expense.category]}"></i>
                </div>
                <div class="expense-details">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-meta">
                        <span class="expense-meta-item">
                            <i class="fas fa-tag"></i> ${categoryNames[expense.category]}
                        </span>
                        <span class="expense-meta-item">
                            <i class="fas fa-user"></i> ${payer.username}
                        </span>
                        <span class="expense-meta-item" style="max-width: 400px; white-space: normal;">
                            <i class="fas fa-users"></i> ${participantNames}
                        </span>
                    </div>
                </div>
                <div class="expense-amount">
                    ${englishToPersianNumber(expense.amount.toLocaleString())} تومان
                </div>
                <div class="expense-actions">
                    <button class="btn-edit-expense" onclick="editExpense(${expense.id})" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-expense" onclick="deleteExpense(${expense.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    updateExpensesSummary();
    calculateSettlement();
}


function editExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    // ✅ ست کردن ID برای ویرایش
    editingExpenseId = expenseId;

    addExpenseModal.classList.add('active');
    initExpenseModal();

    // پر کردن فرم با اطلاعات قبلی
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expensePayer').value = expense.payerId;

    // تنظیم سهم‌ها
    expense.participants.forEach(p => {
        const checkbox = document.querySelector(`#expenseParticipants input[value="${p.id}"]`);
        const shareInput = document.getElementById(`share-${p.id}`);
        if (checkbox && shareInput) {
            checkbox.checked = true;
            shareInput.value = p.share;
            shareInput.disabled = false;
        }
    });

    // تنظیم چک‌باکس‌های غیرفعال
    tripData.participants.forEach(p => {
        if (!expense.participants.find(ep => ep.id === p.id)) {
            const checkbox = document.querySelector(`#expenseParticipants input[value="${p.id}"]`);
            const shareInput = document.getElementById(`share-${p.id}`);
            if (checkbox && shareInput) {
                checkbox.checked = false;
                shareInput.value = '0';
                shareInput.disabled = true;
            }
        }
    });

    // ✅ تغییر متن دکمه
    const saveBtn = document.getElementById('saveExpenseBtn');
    saveBtn.innerHTML = '<i class="fas fa-save"></i> ویرایش هزینه';
}

document.getElementById('saveExpenseBtn').addEventListener('click', async () => {
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const amount = parseInt(document.getElementById('expenseAmount').value);
    const payerId = parseInt(document.getElementById('expensePayer').value);

    const participantCheckboxes = document.querySelectorAll('#expenseParticipants input[type="checkbox"]:checked');
    const participantsData = [];
    let totalShares = 0;

    participantCheckboxes.forEach(cb => {
        const pId = parseInt(cb.value);
        const share = parseInt(document.getElementById(`share-${pId}`).value) || 0;
        if (share > 0) {
            participantsData.push({user_id: pId, share: share});
            totalShares += share;
        }
    });

    // Validation
    if (!description || !amount || amount <= 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً تمام فیلدها را به درستی پر کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
        });
        return;
    }

    if (participantsData.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'حداقل یک نفر با سهم مشخص باید انتخاب شود',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
        });
        return;
    }

    if (totalShares !== amount) {
        Swal.fire({
            icon: 'warning',
            text: `مجموع سهم‌ها (${totalShares.toLocaleString()}) با مبلغ کل (${amount.toLocaleString()}) برابر نیست!`,
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
        });
        return;
    }

    try {
        const expensePayload = {
            category: category,
            description: description,
            amount: amount,
            payer_id: payerId,
            participants: participantsData
        };

        // ✅ تشخیص اینکه ویرایش است یا ایجاد
        if (editingExpenseId !== null) {
            // ویرایش
            const response = await updateExpenseAPI(TRIP_ID, editingExpenseId, expensePayload);
            const updatedExpense = response.data || response;

            const expenseIndex = expenses.findIndex(e => e.id === editingExpenseId);
            expenses[expenseIndex] = {
                id: updatedExpense.expense_id,
                category: updatedExpense.category,
                description: updatedExpense.description,
                amount: updatedExpense.amount,
                payerId: updatedExpense.payer_id,
                participants: updatedExpense.participants.map(p => ({
                    id: p.user_id,
                    share: p.share
                })),
                createdAt: updatedExpense.created_at
            };

            Swal.fire({
                icon: 'success',
                title: 'هزینه ویرایش شد!',
                confirmButtonText: 'عالی',
                confirmButtonColor: '#A6B28B',
                timer: 2000,
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            });
        } else {
            // ایجاد جدید
            const response = await createExpense(TRIP_ID, expensePayload);
            const createdExpense = response.data || response;

            expenses.push({
                id: createdExpense.expense_id,
                category: createdExpense.category,
                description: createdExpense.description,
                amount: createdExpense.amount,
                payerId: createdExpense.payer_id,
                participants: createdExpense.participants.map(p => ({
                    id: p.user_id,
                    share: p.share
                })),
                createdAt: createdExpense.created_at
            });

            Swal.fire({
                icon: 'success',
                text: `هزینه "${description}" با موفقیت ثبت شد`,
                confirmButtonText: 'عالی',
                confirmButtonColor: '#A6B28B',
                timer: 2000,
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            });
        }

        // ✅ ریست کردن حالت
        editingExpenseId = null;
        addExpenseModal.classList.remove('active');
        renderExpenses();

        // بازگردانی متن دکمه
        const saveBtn = document.getElementById('saveExpenseBtn');
        saveBtn.innerHTML = '<i class="fas fa-check"></i> ثبت هزینه';

    } catch (error) {
        console.error('❌ خطا در ثبت/ویرایش هزینه:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ثبت هزینه',
            text: error.response?.data?.detail || 'مشکلی در ارتباط با سرور پیش آمد.',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
    }
});

document.getElementById('closeExpenseModal').addEventListener('click', () => {
    editingExpenseId = null;
    addExpenseModal.classList.remove('active');
    const saveBtn = document.getElementById('saveExpenseBtn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> ثبت هزینه';
});


async function deleteExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);

    const result = await Swal.fire({
        text: `آیا مطمئن هستید که می‌خواهید هزینه "${expense.description}" را حذف کنید؟`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#f5c9b0',
        cancelButtonColor: '#a6b28b',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    });

    if (result.isConfirmed) {
        try {
            // 🆕 ارسال به API
            await deleteExpenseAPI(TRIP_ID, expenseId);

            // حذف از لیست محلی
            const index = expenses.findIndex(e => e.id === expenseId);
            expenses.splice(index, 1);

            Swal.fire({
                icon: 'success',
                text: 'هزینه با موفقیت حذف شد',
                confirmButtonText: 'باشه',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                timer: 2000,
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            renderExpenses();

        } catch (error) {
            console.error('❌ خطا در حذف هزینه:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا در حذف هزینه',
                text: error.response?.data?.detail || 'مشکلی پیش آمد.',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            });
        }
    }
}

function updateExpensesSummary() {
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    document.getElementById('totalExpense').textContent =
        `${englishToPersianNumber(totalExpense).toLocaleString()} تومان`;
}

async function calculateSettlement() {
    const settlementList = document.getElementById('settlementList');

    if (expenses.length === 0) {
        settlementList.innerHTML = '<p style="text-align: center; color: #9ca3af;">هزینه‌ای برای تسویه وجود ندارد</p>';
        return;
    }

    try {
        const response = await getSettlement(TRIP_ID);
        const data = response.data || response;

        console.log('📊 Settlement API Response:', data);

        let settlements = [];

        if (Array.isArray(data)) {
            settlements = data;
        } else if (data.settlements && Array.isArray(data.settlements)) {
            settlements = data.settlements;
        } else {
            console.error('❌ ساختار نامعتبر settlement:', data);
            settlementList.innerHTML = '<p style="text-align: center; color: #f87171;">خطا در دریافت تسویه</p>';
            return;
        }

        if (settlements.length === 0) {
            settlementList.innerHTML = '<p style="text-align: center; color: #10b981; font-weight: 600;">✓ همه حساب‌ها تسویه است!</p>';
            return;
        }

        // نمایش تسویه‌ها
        settlementList.innerHTML = settlements.map(s => {

            const fromName =  `کاربر ${s.from_name}`;
            const toName = `کاربر ${s.to_name}`;

            return `
                <div class="settlement-item">
                    <p>
                        <strong>${fromName}</strong> باید 
                        <strong style="font-size: 1.2rem;">${englishToPersianNumber(s.amount).toLocaleString()} تومان</strong> 
                        به <strong>${toName}</strong> بدهد
                    </p>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('❌ خطا در محاسبه تسویه:', error);
        settlementList.innerHTML = '<p style="text-align: center; color: #f87171;">خطا در محاسبه تسویه</p>';
    }
}

/* ================================================================
   13. ADD EXPENSE MODAL
   ================================================================ */

const addExpenseModal = document.getElementById('addExpenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const closeExpenseModal = document.getElementById('closeExpenseModal');

addExpenseBtn.addEventListener('click', () => {
    addExpenseModal.classList.add('active');
    initExpenseModal();
});

closeExpenseModal.addEventListener('click', () => {
    addExpenseModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === addExpenseModal) {
        addExpenseModal.classList.remove('active');
    }
});

function initExpenseModal() {
    const payerSelect = document.getElementById('expensePayer');
    payerSelect.innerHTML = tripData.participants.map(p =>
        `<option value="${p.id}">${p.username}</option>`
    ).join('');

    const participantsDiv = document.getElementById('expenseParticipants');
    participantsDiv.innerHTML = tripData.participants.map(p => `
        <div class="expense-participant-item">
            <label>
                <input type="checkbox" value="${p.id}" checked onchange="toggleParticipantShare(${p.id})">
                <span>${p.username}</span>
            </label>
            <input type="number" id="share-${p.id}" class="participant-share-input" placeholder="مبلغ سهم (تومان)" value="0">
        </div>
    `).join('');

    document.getElementById('expenseCategory').value = 'food';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
}

function toggleParticipantShare(participantId) {
    const checkbox = document.querySelector(`#expenseParticipants input[value="${participantId}"]`);
    const shareInput = document.getElementById(`share-${participantId}`);

    if (!checkbox.checked) {
        shareInput.value = '0';
        shareInput.disabled = true;
    } else {
        shareInput.disabled = false;
    }
}



/* ================================================================
   14. PARTICIPANTS TAB
   ================================================================ */


function openInviteFriendsModal() {
    Swal.fire({
        title: 'دعوت دوستان',
        html: `
            <div style="direction: rtl;">
                <p style="text-align: center; color: #666; margin-bottom: 1.5rem;">
                    دوستان خود را برای این سفر انتخاب کنید
                </p>
                <div id="friends-list" style="max-height: 400px; overflow-y: auto;">
                    ${renderFriendsList()}
                </div>
            </div>
        `,
        width: '700px',
        showConfirmButton: false,
        showCloseButton: true,
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup'
        }
    });
}

function renderFriendsList() {
    // لیست دوستان (مثل my-trips)
    const friends = [
        {
            id: 101,
            name: 'محمد رضایی',
            username: '@mohammad_r',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
        },
        {
            id: 102,
            name: 'فاطمه احمدی',
            username: '@fateme_a',
            avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
        },
        {id: 103, name: 'علی کریمی', username: '@ali_karimi', avatar: 'https://randomuser.me/api/portraits/men/12.jpg'},
        {id: 104, name: 'زهرا محمدی', username: '@zahra_m', avatar: 'https://randomuser.me/api/portraits/women/13.jpg'},
        {id: 105, name: 'حسین جعفری', username: '@hosein_j', avatar: 'https://randomuser.me/api/portraits/men/14.jpg'},
        {id: 106, name: 'نرگس حسینی', username: '@narges_h', avatar: 'https://randomuser.me/api/portraits/women/15.jpg'}
    ];

    // فیلتر کردن کسانی که قبلاً عضو هستند
    const existingIds = tripData.participants.map(p => p.id);
    const availableFriends = friends.filter(f => !existingIds.includes(f.id));

    if (availableFriends.length === 0) {
        return `
            <div style="text-align: center; padding: 3rem; color: #9ca3af;">
                <i class="fas fa-user-check" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>همه دوستان شما قبلاً به این سفر اضافه شده‌اند</p>
            </div>
        `;
    }

    return `
        <div style="display: grid; gap: 1rem;">
            ${availableFriends.map(friend => `
                <div class="friend-invite-item" onclick="inviteFriend(${friend.id})">
                    <img src="${friend.avatar}" alt="${friend.name}">
                    <div class="friend-invite-info">
                        <div class="friend-invite-name">${friend.name}</div>
                        <div class="friend-invite-username">${friend.username}</div>
                    </div>
                    <button class="btn-invite-friend">
                        <i class="fas fa-user-plus"></i>
                        دعوت
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function inviteFriend(friendId) {
    const friends = [
        {
            id: 101,
            name: 'محمد رضایی',
            username: '@mohammad_r',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
        },
        {
            id: 102,
            name: 'فاطمه احمدی',
            username: '@fateme_a',
            avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
        },
        {id: 103, name: 'علی کریمی', username: '@ali_karimi', avatar: 'https://randomuser.me/api/portraits/men/12.jpg'},
        {id: 104, name: 'زهرا محمدی', username: '@zahra_m', avatar: 'https://randomuser.me/api/portraits/women/13.jpg'},
        {id: 105, name: 'حسین جعفری', username: '@hosein_j', avatar: 'https://randomuser.me/api/portraits/men/14.jpg'},
        {id: 106, name: 'نرگس حسینی', username: '@narges_h', avatar: 'https://randomuser.me/api/portraits/women/15.jpg'}
    ];

    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    // اضافه کردن به لیست اعضا
    tripData.participants.push({
        id: friend.id,
        name: friend.name,
        username: friend.username,
        avatar: friend.avatar,
        isCreator: false
    });

    Swal.fire({
        icon: 'success',
        title: 'دعوتنامه ارسال شد!',
        html: `
            <p>${friend.name} به سفر اضافه شد</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">
                <i class="fas fa-bell"></i> یک اعلان برای ${friend.name} ارسال شد
            </p>
        `,
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        timer: 2500,
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn'
        }
    });

    renderParticipants();

    // بستن مودال و باز کردن دوباره با لیست جدید
    setTimeout(() => {
        openInviteFriendsModal();
    }, 2600);
}

/* ================================================================
   15. END TRIP
   ================================================================ */

document.getElementById('endTripBtn').addEventListener('click', () => {
    Swal.fire({
        title: 'پایان سفر',
        html: `
            <p>آیا مطمئن هستید که می‌خواهید این سفر را به پایان برسانید؟</p>
            <p style="color: #f5c9b0; margin-top: 1rem;">
                <i class="fas fa-exclamation-triangle"></i>
                پس از پایان سفر، امکان ویرایش آن وجود نخواهد داشت
            </p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، پایان دهید',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#f5c9b0',
        cancelButtonColor: '#a6b28b',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // نمایش خلاصه سفر
            const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

            Swal.fire({
                icon: 'success',
                title: 'سفر به پایان رسید!',
                html: `
                    <div style="text-align: right; direction: rtl; padding: 1rem;">
                        <h3 style="margin-bottom: 1rem; color: #A6B28B;">
                            <i class="fas fa-check-circle"></i> خلاصه سفر
                        </h3>
                        <p><strong>نام سفر:</strong> ${tripData.name}</p>
                        <p><strong>تاریخ:</strong> ${tripData.startDate} تا ${tripData.endDate}</p>
                        <p><strong>تعداد شرکت‌کنندگان:</strong> ${tripData.participants.length} نفر</p>
                        <p><strong>تعداد مکان‌های بازدید شده:</strong> ${selectedLocations.length}</p>
                        <p><strong>تعداد پلن‌های روزانه:</strong> ${dailyPlans.length}</p>
                        <p><strong>کل هزینه‌ها:</strong> ${totalExpense.toLocaleString()} تومان</p>
                        <p style="margin-top: 1rem; color: #10b981; font-weight: 600;">
                            <i class="fas fa-heart"></i> خاطرات خوبی داشته باشید!
                        </p>
                    </div>
                `,
                confirmButtonText: 'بازگشت به سفرهای من',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            }).then(() => {
                window.location.href = 'my-trips.html';
            });
        }
    });
});


/* ================================================================
   16. INITIALIZE PAGE
   ================================================================ */

window.addEventListener('load', () => {
    console.log('=== INITIALIZING PAGE ===');

    // اضافه کردن یک پلن نمونه
    dailyPlans = [
        {
            id: 1,
            day: 'روز اول',
            city: 'تهران',
            locations: [
                {...selectedLocations[0], estimatedTime: 'زمان تخمینی: 3 ساعت'},
                {...selectedLocations[1], estimatedTime: 'زمان تخمینی: 2 ساعت'}
            ],
            votes: {likes: 10, dislikes: 1},
            userVote: null
        }
    ];

    // رندر کردن همه چیز
    initMap();
    renderLocations();
    renderDailyPlans();
    renderExpenses();
    renderParticipants();

    // تنظیم اندیکیتور تب
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) {
        updateIndicator(activeButton);
    }

    console.log('✅ Trip Detail Page Initialized Successfully!');
});

function renderParticipants() {
    const participantsGrid = document.getElementById('participantsGrid');

    participantsGrid.innerHTML = `
        <!-- کارت دعوت اعضای جدید -->
        <div class="invite-card">
            <div class="invite-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <h3>دعوت دوستان</h3>
            <p>دوستان خود را به این سفر دعوت کنید</p>
            <!--<button class="btn-invite-link" onclick="copyInviteLink()">
                <i class="fas fa-link"></i> کپی لینک دعوت
            </button><-->
            <button class="btn-invite-manual" onclick="openInviteModal()">
                <i class="fas fa-user-plus"></i> دعوت 
            </button>
        </div>

        ${tripData.participants.map(participant => `
            <div class="participant-card">
                <img src="${getURL() + participant.avatar}" alt="${participant.name}" class="participant-avatar">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-username">${participant.username}</div>
                ${participant.isCreator ?
        '<div class="participant-badge"><i class="fas fa-crown"></i> سازنده سفر</div>'
        : ''}
                ${!participant.isCreator ?
        `<button class="btn-remove-participant" onclick="removeParticipant(${participant.id})">
                        <i class="fas fa-user-times"></i> حذف از سفر
                    </button>`
        : ''}
            </div>
        `).join('')}
    `;
}

function copyInviteLink() {
    // ساخت لینک اختصاصی با ID سفر
    const tripId = tripData.id || 1;
    const inviteLink = `${window.location.origin}/trips/join-trip.html?trip=${tripId}&code=${generateInviteCode()}`;

    // کپی کردن به کلیپبورد
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(inviteLink).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'لینک کپی شد',
                html: `
                    <div style="direction: rtl; text-align: center;">
                        <p>لینک دعوت با موفقیت کپی شد</p>
                        <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.8rem; margin-top: 1rem; word-break: break-all; font-size: 0.85rem;">
                            ${inviteLink}
                        </div>
                        <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                            <i class="fas fa-info-circle"></i>
                            این لینک را با دوستان خود به اشتراک بگذارید
                        </p>
                    </div>
                `,
                confirmButtonText: 'عالی',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });
        }).catch(() => {
            showInviteLinkFallback(inviteLink);
        });
    } else {
        showInviteLinkFallback(inviteLink);
    }
}

function showInviteLinkFallback(inviteLink) {
    Swal.fire({
        icon: 'info',
        title: 'لینک دعوت',
        html: `
            <div style="direction: rtl; text-align: center;">
                <p>لینک زیر را کپی کنید:</p>
                <input type="text" id="invite-link-input" value="${inviteLink}" 
                       style="width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; margin-top: 1rem; text-align: center; font-family: monospace;">
                <button onclick="document.getElementById('invite-link-input').select(); document.execCommand('copy'); Swal.fire({icon: 'success', title: 'کپی شد!', timer: 1500});" 
                        style="width: 100%; margin-top: 1rem; padding: 0.8rem; background: #A6B28B; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-copy"></i> کپی لینک
                </button>
            </div>
        `,
        showConfirmButton: false,
        background: '#f0f0f0'
    });
}

function generateInviteCode() {
    // تولید کد تصادفی 8 کاراکتری
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

let cachedAvailableFriends = []; // برای ذخیره لیست دوستان جهت جستجوی سریع‌تر

async function openInviteModal() {
    Swal.fire({
        title: 'دعوت دوستان به سفر',
        html: `
            <div style="direction: rtl; text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">
                        <i class="fas fa-search"></i> جستجو در لیست دوستان
                    </label>
                    <input type="text" id="search-friend-input" 
                           placeholder="نام یا نام کاربری دوست خود را وارد کنید..."
                           style="width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 0.8rem; font-family: 'Anjoman'; outline: none;">
                </div>
                <div id="friends-results" style="margin-top: 1rem; max-height: 350px; overflow-y: auto; padding: 5px;">
                    <div class="loading-friends text-center py-10">
                        <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: #A6B28B;"></i>
                        <p style="margin-top: 10px; color: #666;">در حال دریافت لیست دوستان...</p>
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        background: '#f9fafb',
        width: '550px',
        didOpen: async () => {
            const resultsDiv = document.getElementById('friends-results');
            const searchInput = document.getElementById('search-friend-input');

            try {
                const response = await getAvailableFriends(TRIP_ID);
                cachedAvailableFriends = response.data || response;
                displayFriends(cachedAvailableFriends);

                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();
                    const filtered = cachedAvailableFriends.filter(f =>
                        f.username.toLowerCase().includes(query) ||
                        (f.full_name && f.full_name.toLowerCase().includes(query))
                    );
                    displayFriends(filtered);
                });

            } catch (error) {
                resultsDiv.innerHTML = `<p class="text-center text-red-500 py-10">خطا در دریافت اطلاعات</p>`;
            }
        }
    });
}

function displayFriends(friends) {
    const resultsDiv = document.getElementById('friends-results');

    if (!friends || friends.length === 0) {
        resultsDiv.innerHTML = `
            <div style="text-align: center; color: #9ca3af; padding: 2rem;">
                <i class="fas fa-user-slash" style="font-size: 2.5rem; margin-bottom: 0.8rem; display: block;"></i>
                کاربری برای دعوت یافت نشد.
            </div>`;
        return;
    }

    resultsDiv.innerHTML = friends.map(friend => `
        <div class="friend-invite-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #eee; border-radius: 12px; margin-bottom: 10px; background: white; transition: 0.3s;">
            <img src="${getURL() + friend.profile_url || '/src/assets/images/default-avatar.png'}" 
                 style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #A6B28B;">
            <div style="flex: 1;">
                <div style="font-weight: 700; color: #1f2937;">${friend.full_name || friend.username}</div>
                <div style="font-size: 0.8rem; color: #6b7280;">${friend.username}</div>
            </div>
            <button onclick="inviteUserAction(${friend.user_id}, '${friend.full_name || friend.username}')" 
                    class="btn-invite-user" style="background: #A6B28B; color: white; border: none; padding: 6px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;">
                <i class="fas fa-paper-plane"></i> دعوت
            </button>
        </div>
    `).join('');
}

// تابع نهایی برای فراخوانی API دعوت
window.inviteUserAction = async function(friendId, name) {
    const result = await Swal.fire({
        title: 'ارسال دعوت‌نامه',
        text: `آیا می‌خواهید ${name} را به این سفر دعوت کنید؟`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، ارسال کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#9ca3af',
    });

    if (result.isConfirmed) {
        try {
            Swal.showLoading();
            const response = await inviteFriendToTrip(TRIP_ID, friendId);

            if (response.data || response) {
                Swal.fire({
                    icon: 'success',
                    title: 'ارسال شد!',
                    text: `دعوت‌نامه با موفقیت برای ${name} ارسال شد.`,
                    confirmButtonColor: '#A6B28B',
                });

                // بستن مودال اصلی و رفرش لیست در صورت نیاز
                // نکته: تا زمانی که دوست دعوت را نپذیرد، به لیست Participants اضافه نمی‌شود.
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: error.response?.data?.detail || 'ارسال دعوت‌نامه با خطا مواجه شد.',
                confirmButtonColor: '#f5c9b0',
            });
        }
    }
}


function searchUsers(query) {
    const resultsDiv = document.getElementById('search-results');

    if (!query || query.length < 2) {
        resultsDiv.innerHTML = `
            <p style="text-align: center; color: #9ca3af; padding: 2rem;">
                <i class="fas fa-user-friends" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                برای جستجو شروع به تایپ کنید
            </p>
        `;
        return;
    }

    // فیلتر کردن کاربرانی که قبلاً عضو نیستند
    const existingIds = tripData.participants.map(p => p.id);
    const filteredUsers = allUsers.filter(user =>
        !existingIds.includes(user.id) &&
        (user.name.includes(query) || user.username.includes(query))
    );

    if (filteredUsers.length === 0) {
        resultsDiv.innerHTML = `
            <p style="text-align: center; color: #9ca3af; padding: 2rem;">
                <i class="fas fa-user-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                کاربری یافت نشد
            </p>
        `;
        return;
    }

    resultsDiv.innerHTML = filteredUsers.map(user => `
        <div class="search-result-item" onclick="inviteUser(${user.id})">
            <img src="${user.avatar}" alt="${user.name}">
            <div class="search-result-info">
                <div class="search-result-name">${user.name}</div>
                <div class="search-result-username">${user.username}</div>
            </div>
            <button class="btn-invite-user">
                <i class="fas fa-user-plus"></i> دعوت
            </button>
        </div>
    `).join('');
}

function inviteUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    Swal.fire({
        title: 'ارسال دعوتنامه',
        text: `آیا می‌خواهید ${user.name} را به این سفر دعوت کنید؟`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، دعوت کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#9ca3af',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // اضافه کردن کاربر به لیست اعضا
            tripData.participants.push({
                id: user.id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                isCreator: false
            });

            Swal.fire({
                icon: 'success',
                title: 'دعوتنامه ارسال شد',
                html: `
                    <p>${user.name} به سفر اضافه شد</p>
                    <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">
                        <i class="fas fa-bell"></i> یک اعلان برای ${user.name} ارسال شد
                    </p>
                `,
                confirmButtonText: 'عالی',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            renderParticipants();

            // بستن مودال جستجو
            Swal.close();
        }
    });
}

function initMobileMenu() {
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
                <a href="/index.html" class="mobile-menu-item">خانه</a>
                <a href="/profile.html" class="mobile-menu-item">پروفایل من</a>
                <a href="/trips/my-trips.html" class="mobile-menu-item active">سفرهای من</a>
                <a href="/bookmarks.html" class="mobile-menu-item">بوک‌مارک‌ها</a>
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

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); // برای دیباگ
    initMobileMenu();
    fetchAndAssignTripData();

    setTimeout(() => {
        if (!document.getElementById('mobileMenu')) {
            console.log('Retrying mobile menu initialization...');
            initMobileMenu();
        }
    }, 1000);
});

function getCategoryName(categoryId) {
    if (categoryId === "1") {
        return "طبیعت‌گردی";
    } else if (categoryId === "2") {
        return "تاریخی";
    } else if (categoryId === "3") {
        return "تجاری و تفریحی";
    } else {
        return "مذهبی";
    }
}

async function init() {
    console.log("Initializing app with Trip ID:", TRIP_ID);
    initMobileMenu();

    if (TRIP_ID) {
        await fetchAndAssignTripData();
        await fetchAndRenderPlans();
    } else {
        console.error("No Trip ID found in URL. Use ?id=1");
    }
}

async function autoGenerateLocationsReal(topN) {
    try {

        const response = await autoGeneratePlaces(TRIP_ID, {top_n: topN});

        console.log('API Response:', response);

        if (response.status === 200 || response.status === 201 || response.success) {

            try {
                await fetchAndAssignTripData();
            } catch (renderError) {
                console.warn('دیتای جدید اضافه شد ولی در بازسازی صفحه خطایی رخ داد:', renderError);
                window.location.reload();
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'با موفقیت اضافه شد',
                text: `مکان‌های جدید به برنامه سفر شما اضافه گردید.`,
                confirmButtonText: 'باشه',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });
        }

    } catch (error) {
        console.error('❌ Error in Auto-Generate API call:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در عملیات',
            text: error.message,
            confirmButtonColor: '#f5c9b0',
            cancelButtonColor: '#a6b28b',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
    }
}

function englishToPersianNumber(input) {
    let str = String(input);

    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i]);
    }
    return str;
}


let initTimeout;
document.addEventListener('DOMContentLoaded', () => {
    clearTimeout(initTimeout);
    initTimeout = setTimeout(() => {
        if (!window.alreadyInitialized) {
            init();
            window.alreadyInitialized = true;
        }
    }, 100);
});

window.viewLocation = viewLocation;
window.showLocationOnMap = showLocationOnMap;
window.voteLocation = voteLocation;
window.removeLocation = removeLocation;
window.toggleVisited = toggleVisited;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.openInviteModal = openInviteModal;
window.deletePlan = deletePlan;
window.savePlanOrder = savePlanOrder;
window.addLocationToPlan = addLocationToPlan;
window.removeLocationFromPlan = removeLocationFromPlan;
window.votePlan = votePlan;
window.toggleEditPlan = toggleEditPlan;
window.showAddLocationToPlan = showAddLocationToPlan;
window.togglePlanLocation = togglePlanLocation;
window.removePlanLocation = removePlanLocation;
window.viewPlanOnPlanMap =viewPlanOnPlanMap;