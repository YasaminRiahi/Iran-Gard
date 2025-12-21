/* ================================================================
   TRIP DETAIL PAGE - JAVASCRIPT
   ================================================================ */

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

const tripData = {
    id: 1,
    name: 'سفر به تهران',
    startDate: '1403/09/10',
    endDate: '1403/09/15',
    cities: ['تهران'],
    participants: [
        {
            id: 1,
            name: 'علی احمدی',
            username: '@ali_ahmadi',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            isCreator: true
        },
        {
            id: 2,
            name: 'سارا محمدی',
            username: '@sara_m',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            isCreator: false
        },
        {
            id: 3,
            name: 'رضا کریمی',
            username: '@reza_k',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            isCreator: false
        },
        {
            id: 4,
            name: 'مینا رضایی',
            username: '@mina_r',
            avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            isCreator: false
        }
    ]
};

const allLocationsData = [
    {
        id: 1,
        name: 'برج میلاد',
        category: 'تجاری',
        city: 'تهران',
        image: '../src/assets/images/88bfd4e9d10d431265e291bc107e47d7.jpg',
        description: 'برج مخابراتی تهران',
        lat: 35.7447,
        lng: 51.3753,
        votes: {likes: 0, dislikes: 0}
    },
    {
        id: 2,
        name: 'کاخ گلستان',
        category: 'تاریخی',
        city: 'تهران',
        image: '../src/assets/images/man-walking-stone-pathway-surrou.jpg',
        description: 'کاخ قاجاری',
        lat: 35.6795,
        lng: 51.4209,
        votes: {likes: 0, dislikes: 0}
    },
    {
        id: 3,
        name: 'دربند',
        category: 'طبیعت',
        city: 'تهران',
        image: '../src/assets/images/45677.jpg',
        description: 'تله‌کابین و پیست اسکی',
        lat: 35.8367,
        lng: 51.3897,
        votes: {likes: 0, dislikes: 0}
    },
    {
        id: 4,
        name: 'موزه ملی ایران',
        category: 'فرهنگی',
        city: 'تهران',
        image: '../src/assets/images/man-walking-stone-pathway-surrou.jpg',
        description: 'موزه باستان‌شناسی',
        lat: 35.6892,
        lng: 51.4158,
        votes: {likes: 0, dislikes: 0}
    },
    {
        id: 5,
        name: 'باغ موزه هنر',
        category: 'هنری',
        city: 'تهران',
        image: '../src/assets/images/45677.jpg',
        description: 'باغ موزه هنرهای معاصر',
        lat: 35.7264,
        lng: 51.4089,
        votes: {likes: 0, dislikes: 0}
    }
];

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
            <div class="location-rank">#${index + 1}</div>
            
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
                        <span class="vote-count">${location.votes.likes}</span>
                    </button>
                    <button class="vote-btn ${location.userVote === 'dislike' ? 'disliked' : ''}" 
                            onclick="voteLocation(${location.id}, 'dislike')">
                        <i class="fas fa-thumbs-down"></i>
                        <span class="vote-count">${location.votes.dislikes}</span>
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

function removeLocation(locationId) {
    const location = selectedLocations.find(loc => loc.id === locationId);

    Swal.fire({
        title: 'حذف مکان',
        html: `آیا مطمئن هستید که می‌خواهید <strong>${location.name}</strong> را از سفر حذف کنید؟`,
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
    }).then((result) => {
        if (result.isConfirmed) {
            const index = selectedLocations.findIndex(loc => loc.id === locationId);
            selectedLocations.splice(index, 1);

            Swal.fire({
                icon: 'success',
                title: 'مکان حذف شد',
                text: `${location.name} از سفر حذف شد`,
                confirmButtonText: 'باشه',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                timer: 2000,
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            renderLocations();
            updateMapMarkers();
        }
    });
}

function toggleVisited(locationId) {
    const location = selectedLocations.find(loc => loc.id === locationId);
    if (!location) return;

    location.visited = !location.visited;

    const message = location.visited
        ? `${location.name} به عنوان مشاهده شده علامت‌گذاری شد`
        : `علامت مشاهده شده از ${location.name} برداشته شد`;

    Swal.fire({
        icon: 'success',
        text: message,
        confirmButtonText: 'باشه',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        timer: 2000,
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn'
        }
    });

    renderLocations();
}

function voteLocation(locationId, voteType) {
    const location = selectedLocations.find(loc => loc.id === locationId);
    if (!location) return;

    // اگر قبلاً رای داده، رای قبلی رو حذف کن
    if (location.userVote === voteType) {
        location.votes[voteType === 'like' ? 'likes' : 'dislikes']--;
        location.userVote = null;
    } else {
        // اگر رای مخالف داده بود، اون رو حذف کن
        if (location.userVote) {
            location.votes[location.userVote === 'like' ? 'likes' : 'dislikes']--;
        }

        // رای جدید رو اضافه کن
        location.votes[voteType === 'like' ? 'likes' : 'dislikes']++;
        location.userVote = voteType;
    }

    renderLocations();
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

function renderAvailableLocations() {
    const grid = document.getElementById('availableLocationsGrid');

    const availableLocations = allLocationsData.filter(
        loc => !selectedLocations.find(selected => selected.id === loc.id)
    );

    if (availableLocations.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>همه مکان‌ها اضافه شده‌اند!</h3>
            </div>
        `;
        return;
    }

    // گروه‌بندی بر اساس شهر
    const locationsByCity = {};
    tripData.cities.forEach(city => {
        locationsByCity[city] = availableLocations.filter(loc => loc.city === city);
    });

    const cityNames = {
        'تهران': 'تهران',
        'شیراز': 'شیراز',
        'اصفهان': 'اصفهان'
    };

    grid.innerHTML = Object.keys(locationsByCity).map(city => {
        const cityLocs = locationsByCity[city];
        if (cityLocs.length === 0) return '';

        return `
            <div class="city-locations-section">
                <h3 class="city-section-title">
                    <i class="fas fa-city"></i> ${cityNames[city] || city}
                    <span class="city-count">${cityLocs.length} مکان</span>
                </h3>
                <div class="city-locations-grid">
                    ${cityLocs.map(location => `
                        <div class="available-location-card" onclick="addLocationToTrip(${location.id})">
                            <img src="${location.image}" alt="${location.name}">
                            <div class="available-location-info">
                                <h4>${location.name}</h4>
                                <p><i class="fas fa-tag"></i> ${location.category}</p>
                                <p style="font-size: 0.85rem; margin-top: 0.5rem;">${location.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function addLocationToTrip(locationId) {
    const location = allLocationsData.find(loc => loc.id === locationId);
    if (!location) return;

    // مطمئن شوید city کپی می‌شود
    selectedLocations.push({
        ...location, // این تمام property ها از جمله city را کپی می‌کند
        userVote: null
    });

    console.log('Location added:', location.name, 'City:', location.city);
    console.log('Current selectedLocations:', selectedLocations);

    Swal.fire({
        icon: 'success',
        title: 'مکان اضافه شد!',
        text: `${location.name} به لیست سفر اضافه شد`,
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn'
        }
    });

    renderLocations();
    updateMapMarkers();
    addLocationModal.classList.remove('active');
}

/* ================================================================
   7. AUTO GENERATE LOCATIONS
   ================================================================ */

document.getElementById('autoGenerateBtn').addEventListener('click', () => {
    Swal.fire({
        title: 'اتو جنریت مکان‌ها',
        text: 'آیا می‌خواهید بهترین مکان‌های این شهر به صورت خودکار اضافه شوند؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، اضافه کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#f5c9b0',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            autoGenerateLocations();
        }
    });
});

function autoGenerateLocations() {
    // شبیه‌سازی: اضافه کردن 3 مکان برتر که هنوز اضافه نشده‌اند
    const availableLocations = allLocationsData.filter(
        loc => !selectedLocations.find(selected => selected.id === loc.id)
    );

    const topLocations = availableLocations.slice(0, 3);

    topLocations.forEach(location => {
        selectedLocations.push({
            ...location,
            userVote: null,
            votes: {likes: Math.floor(Math.random() * 50) + 20, dislikes: Math.floor(Math.random() * 10)}
        });
    });

    Swal.fire({
        icon: 'success',
        title: 'مکان‌ها اضافه شدند!',
        text: `${topLocations.length} مکان برتر به سفر شما اضافه شد`,
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn'
        }
    });

    renderLocations();
    updateMapMarkers();
}

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

function addLocationToPlan(planId, locationId) {
    const plan = dailyPlans.find(p => p.id === planId);
    const location = selectedLocations.find(loc => loc.id === locationId);

    if (!plan || !location) return;

    // چک کنیم که قبلاً اضافه نشده باشه
    if (plan.locations.find(loc => loc.id === locationId)) {
        Swal.fire({
            icon: 'info',
            text: 'این مکان قبلاً به پلن اضافه شده است',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            timer: 2000,
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
        return;
    }

    plan.locations.push({
        ...location,
        estimatedTime: 'زمان تخمینی: 2 ساعت'
    });

    Swal.fire({
        icon: 'success',
        title: 'مکان اضافه شد!',
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

    renderDailyPlans();
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

function savePlanOrder(planId) {
    const plan = dailyPlans.find(p => p.id === planId);
    const container = document.getElementById(`plan-locations-edit-${planId}`);
    const items = container.querySelectorAll('.plan-location-item');

    const newOrder = [];
    items.forEach((item, index) => {
        const locationId = parseInt(item.dataset.locationId);
        const location = plan.locations.find(loc => loc.id === locationId);
        if (location) {
            newOrder.push(location);
        }
    });

    plan.locations = newOrder;

    Swal.fire({
        icon: 'success',
        title: 'ترتیب ذخیره شد!',
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
    renderDailyPlans();
}

function removeLocationFromPlan(planId, locationId) {
    const plan = dailyPlans.find(p => p.id === planId);
    plan.locations = plan.locations.filter(loc => loc.id !== locationId);

    // بلافاصله رندر مجدد
    const container = document.getElementById(`plan-locations-edit-${planId}`);
    const items = container.querySelectorAll('.plan-location-item');
    items.forEach((item, index) => {
        if (parseInt(item.dataset.locationId) === locationId) {
            item.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                renderDailyPlans();
            }, 300);
        }
    });
}

function deletePlan(planId) {
    const plan = dailyPlans.find(p => p.id === planId);

    Swal.fire({
        title: 'حذف پلن',
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
    }).then((result) => {
        if (result.isConfirmed) {
            const index = dailyPlans.findIndex(p => p.id === planId);
            dailyPlans.splice(index, 1);

            Swal.fire({
                icon: 'success',
                title: 'پلن حذف شد',
                confirmButtonText: 'باشه',
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                timer: 2000,
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            renderDailyPlans();
        }
    });
}

function votePlan(planId, voteType) {
    const plan = dailyPlans.find(p => p.id === planId);
    if (!plan) return;

    if (plan.userVote === voteType) {
        plan.votes[voteType === 'like' ? 'likes' : 'dislikes']--;
        plan.userVote = null;
    } else {
        if (plan.userVote) {
            plan.votes[plan.userVote === 'like' ? 'likes' : 'dislikes']--;
        }
        plan.votes[voteType === 'like' ? 'likes' : 'dislikes']++;
        plan.userVote = voteType;
    }

    renderDailyPlans();
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
    document.getElementById('availableLocationsGrid').innerHTML =
        '<p style="text-align: center; color: #9ca3af; padding: 2rem;">ابتدا یک شهر انتخاب کنید</p>';

    selectedPlanLocations = [];
    updatePlanLocationsList();
}

/* ================================================================
   10. PLAN LOCATION SELECTION
   ================================================================ */

document.getElementById('planCitySelect').addEventListener('change', function () {
    const city = this.value;
    const grid = document.getElementById('availableLocationsGrid');

    console.log('════════════════════════════════════');
    console.log('🔍 PLAN CITY SELECT CHANGED');
    console.log('════════════════════════════════════');
    console.log('📍 Selected city:', `"${city}"`);
    console.log('📦 Total selectedLocations:', selectedLocations.length);
    console.log('📋 All locations with cities:');
    selectedLocations.forEach((loc, index) => {
        console.log(`  ${index + 1}. ${loc.name} - city: "${loc.city}" (type: ${typeof loc.city})`);
    });
    console.log('🎯 Comparison:', selectedLocations.map(loc => `"${loc.city}" === "${city}" ? ${loc.city === city}`));
    console.log('════════════════════════════════════');

    if (!city) {
        grid.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">ابتدا یک شهر انتخاب کنید</p>';
        return;
    }

    // فیلتر مکان‌ها
    const cityLocations = selectedLocations.filter(loc => {
        const matches = loc.city === city;
        console.log(`  ✓ ${loc.name}: "${loc.city}" === "${city}" = ${matches}`);
        return matches;
    });

    console.log('✅ Filtered result:', cityLocations.length, 'locations found');

    if (cityLocations.length === 0) {
        grid.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem; display: block;"></i>
                <h3 style="color: #4b5563; margin-bottom: 0.5rem;">مکانی در ${city} یافت نشد</h3>
                <p style="color: #9ca3af;">لطفاً ابتدا از تب "مکان‌ها" مکان‌هایی از ${city} اضافه کنید</p>
            </div>
        `;
        return;
    }

    console.log('🎨 Starting to render HTML...');

    // رندر HTML - ساده‌تر و واضح‌تر
    let html = `
        <div class="city-locations-section">
            <h3 class="city-section-title">
                <i class="fas fa-map-marked-alt"></i> مکان‌های ${city}
                <span class="city-count">${cityLocations.length} مکان</span>
            </h3>
            <div class="city-locations-grid">
    `;

    cityLocations.forEach(location => {
        const isSelected = selectedPlanLocations.includes(location.id);
        console.log(`  Rendering: ${location.name}, selected: ${isSelected}`);

        html += `
            <div class="available-location-card ${isSelected ? 'selected' : ''}" 
                 onclick="togglePlanLocation(${location.id})"
                 style="cursor: pointer;">
                <img src="${location.image}" alt="${location.name}">
                <div class="available-location-info">
                    <h4>${location.name}</h4>
                    <p><i class="fas fa-tag"></i> ${location.category}</p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.85rem;">
                        <span style="color: #a6b28b;">
                            <i class="fas fa-thumbs-up"></i> ${location.votes.likes}
                        </span>
                        <span style="color: #f5c9b0;">
                            <i class="fas fa-thumbs-down"></i> ${location.votes.dislikes}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    console.log('📝 HTML generated, length:', html.length);
    grid.innerHTML = html;
    console.log('✅ HTML injected into grid');
    console.log('════════════════════════════════════\n');
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

document.getElementById('savePlanBtn').addEventListener('click', () => {
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

    const newPlan = {
        id: dailyPlans.length + 1,
        day: day,
        city: city,
        locations: selectedPlanLocations.map(locId => {
            const loc = selectedLocations.find(l => l.id === locId);
            return {
                ...loc,
                estimatedTime: 'زمان تخمینی: 2 ساعت'
            };
        }),
        votes: {likes: 0, dislikes: 0},
        userVote: null
    };

    dailyPlans.push(newPlan);

    Swal.fire({
        icon: 'success',
        title: 'پلن ایجاد شد!',
        text: `پلن ${day} با موفقیت ذخیره شد`,
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn'
        }
    });

    createPlanModal.classList.remove('active');
    selectedPlanLocations = [];
    renderDailyPlans();
});

/* ================================================================
   11. AUTO GENERATE PLANS
   ================================================================ */

document.getElementById('autoPlanBtn').addEventListener('click', () => {
    Swal.fire({
        title: 'اتو جنریت پلن روزانه',
        text: 'آیا می‌خواهید پلن روزانه به صورت خودکار ایجاد شود؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، ایجاد کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#f5c9b0',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            autoGeneratePlans();
        }
    });
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
        title: 'پلن‌ها ایجاد شدند!',
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
            return participant ? `${participant.name} (${p.share.toLocaleString()}تومان)` : '';
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
                            <i class="fas fa-user"></i> ${payer.name}
                        </span>
                        <span class="expense-meta-item" style="max-width: 400px; white-space: normal;">
                            <i class="fas fa-users"></i> ${participantNames}
                        </span>
                    </div>
                </div>
                <div class="expense-amount">
                    ${expense.amount.toLocaleString()} تومان
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

    // تغییر دکمه ذخیره به ویرایش
    const saveBtn = document.getElementById('saveExpenseBtn');
    saveBtn.textContent = 'ویرایش هزینه';
    saveBtn.onclick = () => updateExpense(expenseId);
}

function updateExpense(expenseId) {
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
            participantsData.push({id: pId, share: share});
            totalShares += share;
        }
    });

    if (!description || !amount || amount <= 0 || participantsData.length === 0 || totalShares !== amount) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً تمام فیلدها را به درستی پر کنید و مجموع سهم‌ها با مبلغ کل برابر باشد',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {popup: 'my-swal-popup', confirmButton: 'my-confirm-btn'}
        });
        return;
    }

    const expenseIndex = expenses.findIndex(e => e.id === expenseId);
    expenses[expenseIndex] = {
        id: expenseId,
        category: category,
        description: description,
        amount: amount,
        payerId: payerId,
        participants: participantsData
    };

    Swal.fire({
        icon: 'success',
        title: 'هزینه ویرایش شد!',
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {popup: 'my-swal-popup', confirmButton: 'my-confirm-btn'}
    });

    addExpenseModal.classList.remove('active');

    // بازگردانی دکمه به حالت اولیه
    const saveBtn = document.getElementById('saveExpenseBtn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> ثبت هزینه';
    saveBtn.onclick = null;

    renderExpenses();
}

function deleteExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);

    Swal.fire({
        title: 'حذف هزینه',
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
    }).then((result) => {
        if (result.isConfirmed) {
            const index = expenses.findIndex(e => e.id === expenseId);
            expenses.splice(index, 1);

            renderExpenses();
        }
    });
}

function updateExpensesSummary() {
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPerson = totalExpense / tripData.participants.length;

    document.getElementById('totalExpense').textContent =
        `${totalExpense.toLocaleString()} تومان`;
    document.getElementById('perPersonExpense').textContent =
        `${Math.round(perPerson).toLocaleString()} تومان`;
}

function calculateSettlement() {
    const settlementList = document.getElementById('settlementList');

    if (expenses.length === 0) {
        settlementList.innerHTML = '<p style="text-align: center; color: #9ca3af;">هزینه‌ای برای تسویه وجود ندارد</p>';
        return;
    }

    const balances = {};
    tripData.participants.forEach(p => {
        balances[p.id] = 0;
    });

    expenses.forEach(expense => {
        // پرداخت‌کننده طلبکار می‌شه
        balances[expense.payerId] += expense.amount;

        // شرکت‌کننده‌ها بدهکار می‌شن (با سهم مشخص)
        expense.participants.forEach(p => {
            balances[p.id] -= p.share;
        });
    });

    // بقیه کد مثل قبل...
    const settlements = [];
    const debtors = Object.keys(balances)
        .filter(id => balances[id] < -0.01)
        .map(id => ({id: parseInt(id), amount: -balances[id]}));
    const creditors = Object.keys(balances)
        .filter(id => balances[id] > 0.01)
        .map(id => ({id: parseInt(id), amount: balances[id]}));

    debtors.forEach(debtor => {
        creditors.forEach(creditor => {
            if (debtor.amount > 0 && creditor.amount > 0) {
                const amount = Math.min(debtor.amount, creditor.amount);
                const debtorName = tripData.participants.find(p => p.id === debtor.id).name;
                const creditorName = tripData.participants.find(p => p.id === creditor.id).name;

                settlements.push({
                    from: debtorName,
                    to: creditorName,
                    amount: Math.round(amount)
                });

                debtor.amount -= amount;
                creditor.amount -= amount;
            }
        });
    });

    if (settlements.length === 0) {
        settlementList.innerHTML = '<p style="text-align: center; color: #10b981; font-weight: 600;">✓ همه حساب‌ها تسویه است!</p>';
        return;
    }

    settlementList.innerHTML = settlements.map(s => `
        <div class="settlement-item">
            <p>
                <strong>${s.from}</strong> باید 
                <strong style="font-size: 1.2rem;">${s.amount.toLocaleString()} تومان</strong> 
                به <strong>${s.to}</strong> بدهد
            </p>
        </div>
    `).join('');
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
        `<option value="${p.id}">${p.name}</option>`
    ).join('');

    // تغییر: به جای چک‌باکس، اینپوت مبلغ برای هر نفر
    const participantsDiv = document.getElementById('expenseParticipants');
    participantsDiv.innerHTML = tripData.participants.map(p => `
        <div class="expense-participant-item">
            <label>
                <input type="checkbox" value="${p.id}" checked onchange="toggleParticipantShare(${p.id})">
                <span>${p.name}</span>
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

document.getElementById('saveExpenseBtn').addEventListener('click', () => {
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
            participantsData.push({id: pId, share: share});
            totalShares += share;
        }
    });

    if (!description || !amount || amount <= 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً تمام فیلدها را به درستی پر کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {popup: 'my-swal-popup', confirmButton: 'my-confirm-btn'}
        });
        return;
    }

    if (participantsData.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'حداقل یک نفر با سهم مشخص باید انتخاب شود',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {popup: 'my-swal-popup', confirmButton: 'my-confirm-btn'}
        });
        return;
    }

    if (totalShares !== amount) {
        Swal.fire({
            icon: 'warning',
            text: `مجموع سهم‌ها (${totalShares.toLocaleString()}) با مبلغ کل (${amount.toLocaleString()}) برابر نیست!`,
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {popup: 'my-swal-popup', confirmButton: 'my-confirm-btn'}
        });
        return;
    }

    const newExpense = {
        id: expenses.length + 1,
        category: category,
        description: description,
        amount: amount,
        payerId: payerId,
        participants: participantsData // حالا شامل {id, share}
    };

    expenses.push(newExpense);
    Swal.fire({
        icon: 'success',
        title: 'هزینه ثبت شد!',
        text: `هزینه "${description}" با موفقیت ثبت شد`,
        confirmButtonText: 'عالی',
        confirmButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {popup: 'my-swal-popup', confirmButton: 'my-confirm-btn'}
    });

    addExpenseModal.classList.remove('active');
    renderExpenses();
});

/* ================================================================
   14. PARTICIPANTS TAB
   ================================================================ */

function renderParticipants() {
    const participantsGrid = document.getElementById('participantsGrid');

    // ابتدا تمام اعضا
    const participantsHTML = tripData.participants.map(participant => `
        <div class="participant-card">
            <img src="${participant.avatar}" alt="${participant.name}" class="participant-avatar">
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
    `).join('');

    // سپس کارت دعوت
    const inviteCardHTML = `
        <div class="invite-card">
            <div class="invite-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <h3>دعوت دوستان</h3>
            <p>دوستان خود را به این سفر دعوت کنید</p>
            <button class="btn-invite-link" onclick="copyInviteLink()">
                <i class="fas fa-link"></i> کپی لینک دعوت
            </button>
            <button class="btn-invite-manual" onclick="openInviteFriendsModal()">
                <i class="fas fa-users"></i> انتخاب از دوستان
            </button>
        </div>
    `;

    participantsGrid.innerHTML = participantsHTML + inviteCardHTML;
}

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

    // اضافه کردن چند مکان برای شروع - با city صحیح
    selectedLocations = [
        {
            ...allLocationsData[0],
            userVote: null,
            votes: {likes: 15, dislikes: 2},
            visited: false
        },
        {
            ...allLocationsData[1],
            userVote: null,
            votes: {likes: 12, dislikes: 3},
            visited: false
        },
        {
            ...allLocationsData[2],
            userVote: null,
            votes: {likes: 18, dislikes: 1},
            visited: false
        }
    ];

    console.log('Selected locations initialized:', selectedLocations);
    console.log('Cities:', selectedLocations.map(loc => loc.city));

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

    // اضافه کردن چند هزینه نمونه
    expenses = [
        {
            id: 1,
            category: 'food',
            description: 'ناهار در رستوران',
            amount: 500000,
            payerId: 1,
            participants: [
                {id: 1, share: 125000},
                {id: 2, share: 125000},
                {id: 3, share: 125000},
                {id: 4, share: 125000}
            ]
        },
        {
            id: 2,
            category: 'transport',
            description: 'بنزین و پارکینگ',
            amount: 200000,
            payerId: 2,
            participants: [
                {id: 1, share: 50000},
                {id: 2, share: 50000},
                {id: 3, share: 50000},
                {id: 4, share: 50000}
            ]
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
            <button class="btn-invite-link" onclick="copyInviteLink()">
                <i class="fas fa-link"></i> کپی لینک دعوت
            </button>
            <button class="btn-invite-manual" onclick="openInviteModal()">
                <i class="fas fa-user-plus"></i> دعوت دستی
            </button>
        </div>

        ${tripData.participants.map(participant => `
            <div class="participant-card">
                <img src="${participant.avatar}" alt="${participant.name}" class="participant-avatar">
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
                title: 'لینک کپی شد!',
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

function openInviteModal() {
    Swal.fire({
        title: 'دعوت دوستان',
        html: `
            <div style="direction: rtl; text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        <i class="fas fa-search"></i> جستجوی کاربر
                    </label>
                    <input type="text" id="search-user-input" 
                           placeholder="نام کاربری یا نام دوست خود را وارد کنید..."
                           style="width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 0.8rem; font-family: 'Anjoman';">
                </div>
                <div id="search-results" style="margin-top: 1rem; max-height: 300px; overflow-y: auto;">
                    <p style="text-align: center; color: #9ca3af; padding: 2rem;">
                        <i class="fas fa-user-friends" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        برای جستجو شروع به تایپ کنید
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        background: '#f0f0f0',
        width: '600px',
        didOpen: () => {
            const searchInput = document.getElementById('search-user-input');
            searchInput.addEventListener('input', (e) => {
                searchUsers(e.target.value);
            });
        }
    });
}

// داده‌های فیک برای جستجوی کاربران
const allUsers = [
    {id: 101, name: 'محمد رضایی', username: '@mohammad_r', avatar: 'https://randomuser.me/api/portraits/men/10.jpg'},
    {id: 102, name: 'فاطمه احمدی', username: '@fateme_a', avatar: 'https://randomuser.me/api/portraits/women/11.jpg'},
    {id: 103, name: 'علی کریمی', username: '@ali_karimi', avatar: 'https://randomuser.me/api/portraits/men/12.jpg'},
    {id: 104, name: 'زهرا محمدی', username: '@zahra_m', avatar: 'https://randomuser.me/api/portraits/women/13.jpg'},
    {id: 105, name: 'حسین جعفری', username: '@hosein_j', avatar: 'https://randomuser.me/api/portraits/men/14.jpg'},
];

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
                title: 'دعوتنامه ارسال شد!',
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

function initMobileMenu(){
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
    initScrollAnimations();

    setTimeout(() => {
        if (!document.getElementById('mobileMenu')) {
            console.log('Retrying mobile menu initialization...');
            initMobileMenu();
        }
    }, 1000);
});