import {
    getFinishedTrips,
    getOngoingTrips,
    createTrip,
    inviteFriend,
    getMyInvitations,
    getAvailableFriends,
    getCitiesWithCounts,
    getCityPlaces,
    buildTripPayload,
    validateTripData
} from '/src/scripts/services/trips-service.js';

// ============ Global Variables ============
let selectedStartDate = null;
let selectedEndDate = null;
let selectedCities = []; // Array of city names
let selectedLocations = []; // Array of place IDs
let selectedFriends = []; // Array of friend IDs
let createdTripId = null;
let citiesData = {}; // Cache for cities and their places

// ============ Page Load & Scroll Management ============
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

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

// ============ Tab Management ============
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

    // بارگذاری داده‌ها
    if (targetTab === 'past-trips') loadFinishedTripsData();
    else if (targetTab === 'current-trips') loadOngoingTripsData();
    else if (targetTab === 'trip-requests') loadInvitationsData();
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

window.addEventListener('load', () => {
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) updateIndicator(activeButton);
});

// ============ Helper Functions ============
function showLoading(tabId) {
    const tab = document.getElementById(tabId);
    const grid = tab.querySelector('.trips-grid, .requests-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; color: var(--color-text-medium);">در حال بارگذاری...</p>
            </div>
        `;
    }
}

function hideLoading(tabId) {
    const tab = document.getElementById(tabId);
    const loading = tab?.querySelector('.loading-state');
    if (loading) loading.remove();
}

function showError(tabId, message) {
    const tab = document.getElementById(tabId);
    const grid = tab.querySelector('.trips-grid, .requests-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #f5c9b0; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--color-text-dark); margin-bottom: 0.5rem;">خطا در بارگذاری</h3>
                <p style="color: var(--color-text-medium);">${message}</p>
            </div>
        `;
    }
}

function convertToJalali(gregorianDate) {
    if (!gregorianDate) return 'نامشخص';
    try {
        if (typeof persianDate !== 'undefined') {
            const pDate = new persianDate(new Date(gregorianDate));
            return pDate.format('DD MMMM YYYY');
        }
        return new Intl.DateTimeFormat('fa-IR').format(new Date(gregorianDate));
    } catch (error) {
        return gregorianDate;
    }
}

// ============ Create Trip Card ============
function createTripCard(trip, type = 'finished') {
    const card = document.createElement('div');
    card.className = 'trip-card';
    if (type === 'current') card.classList.add('current');

    const startDate = convertToJalali(trip.start_date);
    const endDate = convertToJalali(trip.end_date);
    const cities = trip.city_names?.join('، ') || 'نامشخص';
    const placesCount = trip.place_ids?.length || 0;
    const coverImage = trip.cover_image || '../src/assets/images/default-trip.jpg';

    card.innerHTML = `
        ${type === 'current' ? '<div class="current-badge">در حال انجام</div>' : ''}
        <img src="${coverImage}" class="trip-image" alt="${cities}" 
             onerror="this.src='../src/assets/images/default-trip.jpg'">
        <div class="trip-details">
            <h3 class="trip-title">سفر به ${cities}</h3>
            <p class="trip-date"><i class="fas fa-calendar"></i> ${startDate} تا ${endDate}</p>
            <p class="trip-locations"><i class="fas fa-map-marker-alt"></i> 
                ${placesCount} مکان ${type === 'finished' ? 'بازدید شده' : 'انتخاب شده'}
            </p>
        </div>
        <div class="trip-actions">
            ${type === 'finished' ? `
                <button class="btn-view" data-trip-id="${trip.trip_id}">
                    <i class="fas fa-eye"></i>
                </button>
            ` : `
                <button class="btn-edit" data-trip-id="${trip.trip_id}">
                    <i class="fas fa-edit"></i>
                </button>
            `}
        </div>
    `;
    return card;
}

// ============ Load Finished Trips ============
async function loadFinishedTripsData() {
    try {
        showLoading('past-trips');
        const response = await getFinishedTrips();
        const trips = response.data || response;

        const tripsGrid = document.querySelector('#past-trips .trips-grid');
        tripsGrid.innerHTML = '';

        if (!trips || trips.length === 0) {
            tripsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-suitcase-rolling"></i>
                    <h3>هنوز سفر گذشته‌ای ندارید</h3>
                    <p>سفرهای انجام شده شما اینجا نمایش داده می‌شود</p>
                </div>
            `;
            return;
        }

        trips.forEach(trip => {
            const card = createTripCard(trip, 'finished');
            tripsGrid.appendChild(card);
        });

        // Event listeners
        document.querySelectorAll('#past-trips .btn-view').forEach(btn => {
            btn.addEventListener('click', () => viewTrip(btn.dataset.tripId));
        });

        console.log(`✅ ${trips.length} finished trips loaded`);
    } catch (error) {
        console.error('Error loading finished trips:', error);
        showError('past-trips', 'خطا در بارگذاری سفرها');
    } finally {
        hideLoading('past-trips');
    }
}

// ============ Load Ongoing Trips ============
async function loadOngoingTripsData() {
    try {
        showLoading('current-trips');
        const response = await getOngoingTrips();
        const trips = response.data || response;

        const tripsGrid = document.querySelector('#current-trips .trips-grid');
        tripsGrid.innerHTML = '';

        if (!trips || trips.length === 0) {
            tripsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-suitcase-rolling"></i>
                    <h3>سفر جاری دیگری ندارید</h3>
                    <p>برای ایجاد سفر جدید به تب "ایجاد سفر" بروید</p>
                </div>
            `;
            return;
        }

        trips.forEach(trip => {
            const card = createTripCard(trip, 'current');
            tripsGrid.appendChild(card);
        });

        // Event listeners
        document.querySelectorAll('#current-trips .btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editTrip(btn.dataset.tripId));
        });

        console.log(`✅ ${trips.length} ongoing trips loaded`);
    } catch (error) {
        console.error('Error loading ongoing trips:', error);
        showError('current-trips', 'خطا در بارگذاری سفرها');
    } finally {
        hideLoading('current-trips');
    }
}

// ============ Load Invitations ============
async function loadInvitationsData() {
    try {
        showLoading('trip-requests');
        const response = await getMyInvitations();
        const invitations = response.data || response;

        const requestsGrid = document.querySelector('#trip-requests .requests-grid');
        requestsGrid.innerHTML = '';

        const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

        if (!pendingInvitations || pendingInvitations.length === 0) {
            requestsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope-open"></i>
                    <h3>درخواست جدیدی ندارید</h3>
                    <p>دعوت‌های سفر شما اینجا نمایش داده می‌شود</p>
                </div>
            `;
            updateInvitationsBadge(0);
            return;
        }

        // TODO: باید اطلاعات کامل سفر از API بگیری
        // فعلاً فقط invitation_id داریم

        updateInvitationsBadge(pendingInvitations.length);
        console.log(`✅ ${pendingInvitations.length} invitations loaded`);
    } catch (error) {
        console.error('Error loading invitations:', error);
        showError('trip-requests', 'خطا در بارگذاری درخواست‌ها');
    } finally {
        hideLoading('trip-requests');
    }
}

function updateInvitationsBadge(count) {
    const badge = document.querySelector('[data-tab="trip-requests"] .badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// ============ Navigation Functions ============
function viewTrip(tripId) {
    window.location.href = `/trips/each-trip.html?id=${tripId}`;
}

function editTrip(tripId) {
    window.location.href = `/trips/trip-management.html?id=${tripId}`;
}

// ============ Create Trip Modal ============
const modal = document.getElementById('createTripModal');
const openModalBtn = document.getElementById('openCreateTripModal');
const closeModalBtn = document.getElementById('closeModal');

openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
    resetModal();
    setTimeout(() => initializeDatePickers(), 100);
});

closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

function resetModal() {
    selectedStartDate = null;
    selectedEndDate = null;
    selectedCities = [];
    selectedLocations = [];
    selectedFriends = [];
    createdTripId = null;
    showStep(0);

    $('#startDate').val('');
    $('#endDate').val('');
    document.getElementById('startDate').classList.remove('filled');
    document.getElementById('endDate').classList.remove('filled');
    document.getElementById('dateSummary').style.display = 'none';

    document.querySelectorAll('.city-card').forEach(card => {
        card.classList.remove('selected');
    });

    updateSelectedCitiesBar();
}

function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// ============ Step 0: Date Picker ============
function initializeDatePickers() {
    $('#startDate').persianDatepicker({
        format: 'YYYY/MM/DD',
        initialValue: false,
        autoClose: true,
        calendar: {
            persian: {
                locale: 'fa'
            }
        },
        onSelect: function(unix) {
            selectedStartDate = new Date(unix);
            document.getElementById('startDate').classList.add('filled');
            updateDateSummary();
            checkDateContinueButton();
        }
    });

    $('#endDate').persianDatepicker({
        format: 'YYYY/MM/DD',
        initialValue: false,
        autoClose: true,
        calendar: {
            persian: {
                locale: 'fa'
            }
        },
        onSelect: function(unix) {
            selectedEndDate = new Date(unix);
            document.getElementById('endDate').classList.add('filled');
            updateDateSummary();
            checkDateContinueButton();
        }
    });
}

function updateDateSummary() {
    const summaryDiv = document.getElementById('dateSummary');
    const summaryText = document.getElementById('dateSummaryText');

    if (selectedStartDate && selectedEndDate) {
        const diffTime = Math.abs(selectedEndDate - selectedStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        summaryText.textContent = `مدت سفر: ${diffDays} روز (از ${$('#startDate').val()} تا ${$('#endDate').val()})`;
        summaryDiv.style.display = 'flex';
    } else {
        summaryDiv.style.display = 'none';
    }
}

function checkDateContinueButton() {
    const continueBtn = document.getElementById('continueToStep1');
    continueBtn.disabled = !(selectedStartDate && selectedEndDate);
}

document.getElementById('continueToStep1').addEventListener('click', () => {
    if (selectedStartDate && selectedEndDate) {
        if (selectedStartDate >= selectedEndDate) {
            Swal.fire({
                icon: 'warning',
                text: 'تاریخ پایان باید بعد از تاریخ شروع باشد',
                confirmButtonText: 'باشه',
                confirmButtonColor: '#a6b28b'
            });
            return;
        }
        loadCitiesForSelection();
        showStep(1);
    }
});

document.getElementById('backToStep0').addEventListener('click', () => showStep(0));

/* ================================================================
   MY TRIPS - PART 2: Steps & Create Trip Flow
   این بخش رو به انتهای my-trips.js اضافه کن
   ================================================================ */

// ============ Step 1: Load and Select Cities ============
async function loadCitiesForSelection() {
    try {
        const response = await getCitiesWithCounts();
        const cities = response.data || response;

        const citiesGrid = document.querySelector('.cities-grid');
        citiesGrid.innerHTML = '';

        if (!cities || cities.length === 0) {
            citiesGrid.innerHTML = '<p>شهری یافت نشد</p>';
            return;
        }

        cities.forEach(city => {
            citiesData[city.city_name] = city; // Cache city data

            const cityCard = document.createElement('div');
            cityCard.className = 'city-card';
            cityCard.dataset.city = city.city_name;

            const imageUrl = city.city_pic_url || '../src/assets/images/default-city.jpg';

            cityCard.innerHTML = `
                <img src="${imageUrl}" alt="${city.city_name}"
                     onerror="this.src='../src/assets/images/default-city.jpg'">
                <h4>${city.city_name}</h4>
                <p>${city.places_count} مکان گردشگری</p>
            `;

            cityCard.addEventListener('click', function() {
                const cityName = this.dataset.city;

                if (selectedCities.includes(cityName)) {
                    selectedCities = selectedCities.filter(c => c !== cityName);
                    this.classList.remove('selected');
                } else {
                    selectedCities.push(cityName);
                    this.classList.add('selected');
                }

                updateSelectedCitiesBar();
                updateContinueButton();
            });

            citiesGrid.appendChild(cityCard);
        });

        console.log(`✅ ${cities.length} cities loaded`);
    } catch (error) {
        console.error('Error loading cities:', error);
        Swal.fire({
            icon: 'error',
            text: 'خطا در بارگذاری شهرها',
            confirmButtonColor: '#a6b28b'
        });
    }
}

function updateSelectedCitiesBar() {
    const bar = document.getElementById('selectedCitiesBar');
    const list = document.getElementById('selectedCitiesList');

    if (selectedCities.length === 0) {
        bar.style.display = 'none';
        return;
    }

    bar.style.display = 'flex';
    list.innerHTML = selectedCities.map(city =>
        `<span class="city-tag">${city}</span>`
    ).join('');
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continueToLocations');
    continueBtn.disabled = selectedCities.length === 0;
}

document.getElementById('continueToLocations').addEventListener('click', () => {
    loadLocationsForSelectedCities();
    showStep(2);
});

document.getElementById('backToStep1').addEventListener('click', () => showStep(1));

// ============ Step 2: Load and Select Locations ============
async function loadLocationsForSelectedCities() {
    const locationsGrid = document.getElementById('locationsGrid');
    const cityNameSpan = document.getElementById('selectedCityName');

    cityNameSpan.textContent = selectedCities.join(' - ');
    locationsGrid.innerHTML = '<div class="loading-state">در حال بارگذاری...</div>';

    try {
        const citySections = await Promise.all(
            selectedCities.map(async (cityName) => {
                try {
                    const response = await getCityPlaces(cityName);
                    const places = response.data || response;
                    return { cityName, places };
                } catch (error) {
                    console.error(`Error loading places for ${cityName}:`, error);
                    return { cityName, places: [] };
                }
            })
        );

        locationsGrid.innerHTML = '';

        citySections.forEach(({ cityName, places }) => {
            if (!places || places.length === 0) return;

            const citySection = document.createElement('div');
            citySection.className = 'city-section';

            citySection.innerHTML = `
                <h4 class="city-section-title">
                    <i class="fas fa-city"></i> ${cityName}
                </h4>
                <div class="city-locations-grid">
                    ${places.map(place => `
                        <div class="location-card" data-location-id="${place.place_id}">
                            <img src="${place.image_url || '../src/assets/images/default-place.jpg'}" 
                                 alt="${place.place_name}"
                                 onerror="this.src='../src/assets/images/default-place.jpg'">
                            <div class="location-info">
                                <h5>${place.place_name}</h5>
                                <p><i class="fas fa-tag"></i> ${place.category || 'گردشگری'}</p>
                                ${place.description ? `<p style="font-size: 0.8rem; margin-top: 0.5rem;">${place.description}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            locationsGrid.appendChild(citySection);
        });

        // Add event listeners
        document.querySelectorAll('.location-card').forEach(card => {
            card.addEventListener('click', function() {
                const locationId = parseInt(this.dataset.locationId);
                toggleLocationSelection(locationId, this);
            });
        });

        console.log('✅ Locations loaded for selected cities');
    } catch (error) {
        console.error('Error loading locations:', error);
        locationsGrid.innerHTML = '<p>خطا در بارگذاری مکان‌ها</p>';
    }
}

function toggleLocationSelection(locationId, cardElement) {
    const index = selectedLocations.indexOf(locationId);

    if (index > -1) {
        selectedLocations.splice(index, 1);
        cardElement.classList.remove('selected');
    } else {
        selectedLocations.push(locationId);
        cardElement.classList.add('selected');
    }

    updateSelectedLocationsList();
    updateNextButton();
}

function updateSelectedLocationsList() {
    const listContainer = document.getElementById('selectedLocationsList');

    if (selectedLocations.length === 0) {
        listContainer.innerHTML = '<span style="color: rgba(255,255,255,0.7);">هیچ مکانی انتخاب نشده</span>';
        return;
    }

    // TODO: نام مکان‌ها رو از DOM بگیر یا cache کن
    listContainer.innerHTML = selectedLocations.map(id =>
        `<span class="location-tag">مکان ${id}</span>`
    ).join('');
}

function updateNextButton() {
    const nextBtn = document.getElementById('nextToStep3');
    nextBtn.disabled = selectedLocations.length === 0;
}

document.getElementById('nextToStep3').addEventListener('click', () => {
    loadFriendsForInvitation();
    showStep(3);
});

document.getElementById('backToStep2').addEventListener('click', () => showStep(2));

// ============ Step 3: Load and Select Friends ============
async function loadFriendsForInvitation() {
    const friendsGrid = document.getElementById('friendsGrid');
    friendsGrid.innerHTML = '<div class="loading-state">در حال بارگذاری...</div>';

    try {
        const response = await getAvailableFriends();
        const friends = response.data || response;

        if (!friends || friends.length === 0) {
            friendsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends"></i>
                    <p>دوستی برای دعوت وجود ندارد</p>
                </div>
            `;
            return;
        }

        friendsGrid.innerHTML = friends.map(friend => `
            <div class="friend-card-modal" data-friend-id="${friend.user_id}">
                <img src="${friend.profile_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(friend.full_name)}" 
                     alt="${friend.full_name}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(friend.full_name)}'">
                <h4>${friend.full_name}</h4>
                <p>@${friend.username}</p>
            </div>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.friend-card-modal').forEach(card => {
            card.addEventListener('click', function() {
                const friendId = parseInt(this.dataset.friendId);
                toggleFriendSelection(friendId, this);
            });
        });

        console.log(`✅ ${friends.length} friends loaded`);
    } catch (error) {
        console.error('Error loading friends:', error);
        friendsGrid.innerHTML = '<p>خطا در بارگذاری دوستان</p>';
    }
}

function toggleFriendSelection(friendId, cardElement) {
    const index = selectedFriends.indexOf(friendId);

    if (index > -1) {
        selectedFriends.splice(index, 1);
        cardElement.classList.remove('selected');
    } else {
        selectedFriends.push(friendId);
        cardElement.classList.add('selected');
    }
}

// ============ Finish Trip: Create & Invite ============
document.getElementById('finishTrip').addEventListener('click', async () => {
    if (selectedLocations.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً حداقل یک مکان انتخاب کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#a6b28b'
        });
        return;
    }

    // ساخت payload
    const tripPayload = buildTripPayload({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        cityNames: selectedCities,
        placeIds: selectedLocations,
        coverImage: null // TODO: اگر عکس کاور داری اینجا اضافه کن
    });

    // اعتبارسنجی
    const validation = validateTripData(tripPayload);
    if (!validation.valid) {
        Swal.fire({
            icon: 'error',
            title: 'خطا در اطلاعات سفر',
            html: validation.errors.map(err => `<p>• ${err}</p>`).join(''),
            confirmButtonColor: '#a6b28b'
        });
        return;
    }

    // نمایش لودینگ
    Swal.fire({
        title: 'در حال ایجاد سفر...',
        html: 'لطفاً صبر کنید',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        // ایجاد سفر
        const response = await createTrip(tripPayload);
        const createdTrip = response.data || response;
        createdTripId = createdTrip.trip_id;

        console.log('✅ Trip created:', createdTrip);

        // دعوت دوستان (اگر انتخاب شده باشند)
        if (selectedFriends.length > 0) {
            const invitationPromises = selectedFriends.map(friendId =>
                inviteFriend(createdTripId, friendId)
                    .catch(err => console.error(`Failed to invite friend ${friendId}:`, err))
            );

            await Promise.all(invitationPromises);
            console.log(`✅ ${selectedFriends.length} friends invited`);
        }

        // نمایش پیام موفقیت
        Swal.fire({
            icon: 'success',
            title: 'سفر با موفقیت ایجاد شد!',
            html: `
                <p>تاریخ: <strong>${$('#startDate').val()} تا ${$('#endDate').val()}</strong></p>
                <p>شهرها: <strong>${selectedCities.join('، ')}</strong></p>
                <p>تعداد مکان‌ها: <strong>${selectedLocations.length}</strong></p>
                ${selectedFriends.length > 0 ? `<p>دعوت شده: <strong>${selectedFriends.length} نفر</strong></p>` : ''}
            `,
            confirmButtonText: 'عالی!',
            confirmButtonColor: '#a6b28b'
        }).then(() => {
            modal.classList.remove('active');
            switchTab('current-trips');
        });

    } catch (error) {
        console.error('Error creating trip:', error);

        Swal.fire({
            icon: 'error',
            title: 'خطا در ایجاد سفر',
            text: error.response?.data?.detail || 'لطفاً دوباره تلاش کنید',
            confirmButtonColor: '#a6b28b'
        });
    }
});

// ============ Mobile Menu ============
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

    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);

    const menuToggle = document.querySelector('.menu-toggle-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);
}

// ============ CSS for Spinner ============
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinnerStyle);

// ============ Initialize on DOM Load ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ My Trips page loaded');

    initMobileMenu();
    loadFinishedTripsData(); // بارگذاری اولیه تب فعال

    // برای اطمینان
    setTimeout(() => {
        if (!document.getElementById('mobileMenu')) {
            initMobileMenu();
        }
    }, 1000);
});