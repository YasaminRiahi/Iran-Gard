import { state } from './core.js';
import {
    getTripPlans,
    createTripPlan as createPlan,
    updatePlanOrder,
    deletePlan as deletePlanAPI,
    addLocationToPlan as addLocationToPlanAPI,
    removeLocationFromPlan as removeLocationFromPlanAPI,
    votePlan as votePlanAPI,
    autoGeneratePlans as autoGeneratePlansAPI,
    getPreviewPlaces
} from '/src/scripts/services/trips-service.js';
import { englishToPersianNumber, getCategoryName, generateStarRating , getPersianOrdinalDay , persianOrdinalToNumber} from './utils.js';

let selectedPlanLocations = [];
let draggedElement = null;

export function renderDailyPlans() {
    const plansGrid = document.getElementById('plansGrid');

    // مطمئن شویم که dailyPlans یک آرایه است
    if (!Array.isArray(state.dailyPlans)) {
        console.warn('state.dailyPlans is not an array:', state.dailyPlans);
        state.dailyPlans = [];
    }

    if (state.dailyPlans.length === 0) {
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
    state.dailyPlans.forEach(plan => {
        const dayKey = plan.day || plan.title || 'نامشخص';
        if (!plansByDay[dayKey]) {
            plansByDay[dayKey] = [];
        }
        plansByDay[dayKey].push(plan);
    });

    const sortedDays = Object.keys(plansByDay).sort((a, b) => {
        const numA = persianOrdinalToNumber(a.substring(4));
        const numB = persianOrdinalToNumber(b.substring(4));
        return numA - numB;
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
                            ${englishToPersianNumber(dayPlans.length)} پلن
                        </span>
                        <span class="stat-badge">
                            <i class="fas fa-map-marker-alt"></i>
                            ${englishToPersianNumber(dayPlans.reduce((sum, plan) => sum + plan.locations.length, 0))} مکان
                        </span>
                    </div>
                </div>
                
                <div class="day-plans-grid">
                    ${sortedDayPlans.map(plan => `
                        <div class="plan-card" data-plan-id="${plan.id}">
                            <div class="plan-header">
                                <div class="plan-info">
                                    <div class="plan-title">${plan.city}</div>
                                    <div class="plan-subtitle">${englishToPersianNumber(plan.locations.length)} مکان</div>
                                </div>
                                ${state.isOwner ? `
                                <div class="plan-header-actions">
                                    <button class="btn-edit-plan-inline" onclick="window.toggleEditPlan(${plan.id})" title="ویرایش">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete-plan" onclick="window.deletePlan(${plan.id})" title="حذف">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- حالت مشاهده -->
                            <div class="plan-view-mode" id="plan-view-${plan.id}">
                                <div class="plan-locations">
                                    ${plan.locations.map((loc, index) => `
                                        <div class="plan-location-item">
                                            <div class="drag-handle">
                                                <i class="fas fa-grip-vertical"></i>
                                            </div>
                                            <div class="plan-location-number">${englishToPersianNumber(index + 1)}</div>
                                            <div class="plan-location-info">
                                                <div class="plan-location-name">${loc.name}</div>
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
                                
                                <div class="add-location-to-plan">
                                    <button class="btn-add-to-plan" onclick="window.showAddLocationToPlan(${plan.id})">
                                        <i class="fas fa-plus-circle"></i>
                                        افزودن مکان به این پلن
                                    </button>
                                </div>
                                
                                <div class="available-plan-locations hidden" id="available-locations-${plan.id}">
                                    <h4 style="margin-bottom: 1rem; color: var(--color-primary);">
                                        <i class="fas fa-map-marked-alt"></i>
                                        مکان‌های قابل افزودن از ${plan.city}:
                                    </h4>
                                    <div class="quick-add-locations">
                                        ${state.selectedLocations
            .filter(loc => loc.city === plan.city && !plan.locations.find(pl => pl.id === loc.id))
            .map(loc => `
                                                <div class="quick-add-location-item" onclick="window.addLocationToPlan(${plan.id}, ${loc.id})">
                                                    <img src="${loc.image}" alt="${loc.name}">
                                                    <div class="quick-add-info">
                                                        <span class="quick-add-name">${loc.name}</span>
                                                        <span class="quick-add-category">${loc.category}</span>
                                                    </div>
                                                    <button class="btn-quick-add">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            `).join('') || '<p style="text-align: center; color: #9ca3af;">همه مکان‌ها اضافه شده‌اند</p>'}
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
                                            <div class="plan-location-number">${englishToPersianNumber(index + 1)}</div>
                                            <div class="plan-location-info">
                                                <div class="plan-location-name">${loc.name}</div>
                                            </div>
                                            <button class="btn-remove-from-plan" onclick="window.removeLocationFromPlan(${plan.id}, ${loc.id})">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="edit-mode-actions">
                                    <button class="btn-save-plan-order" onclick="window.savePlanOrder(${plan.id})">
                                        <i class="fas fa-check"></i> ذخیره تغییرات
                                    </button>
                                    <button class="btn-cancel-edit" onclick="window.toggleEditPlan(${plan.id})">
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

    // راه‌اندازی drag and drop برای لیست‌های editable
    setTimeout(() => {
        state.dailyPlans.forEach(plan => {
            initDragAndDrop(plan.id);
        });
    }, 100);
}

function toggleEditPlan(planId) {
    const viewMode = document.getElementById(`plan-view-${planId}`);
    const editMode = document.getElementById(`plan-edit-${planId}`);

    if (viewMode && editMode) {
        viewMode.classList.toggle('hidden');
        editMode.classList.toggle('hidden');
    }
}

function initDragAndDrop(planId) {
    const container = document.getElementById(`plan-locations-edit-${planId}`);
    if (!container) return;

    const draggables = container.querySelectorAll('.draggable');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function (e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        draggable.addEventListener('dragend', function () {
            this.classList.remove('dragging');
            draggedElement = null;
        });
    });

    container.addEventListener('dragover', function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
    });
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

async function savePlanOrder(planId) {
    const container = document.getElementById(`plan-locations-edit-${planId}`);
    const items = container.querySelectorAll('.plan-location-item');

    const newOrder = Array.from(items).map(item => parseInt(item.dataset.locationId));

    try {
        await updatePlanOrder(state.TRIP_ID, planId, newOrder);

        Swal.fire({
            icon: 'success',
            text: 'ترتیب مکان‌ها با موفقیت ذخیره شد',
            confirmButtonColor: '#A6B28B',
            confirmButtonText: 'باشه',
            timer: 2000,
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });

        await fetchAndRenderPlans();
        toggleEditPlan(planId);

    } catch (error) {
        console.error('خطا:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ذخیره',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

function showAddLocationToPlan(planId) {
    const availableLocations = document.getElementById(`available-locations-${planId}`);
    if (availableLocations) {
        availableLocations.classList.toggle('hidden');
    }
}

async function addLocationToPlan(planId, locationId) {
    try {
        await addLocationToPlanAPI(state.TRIP_ID, planId, locationId);

        Swal.fire({
            icon: 'success',
            text: 'مکان به پلن اضافه شد',
            confirmButtonColor: '#A6B28B',
            confirmButtonText: 'باشه',
            timer: 1500,
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });

        await fetchAndRenderPlans();

    } catch (error) {
        console.error('خطا:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در افزودن مکان',
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
    const result = await Swal.fire({
        text: 'آیا از حذف این مکان مطمئن هستید؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#f5c9b0',
        cancelButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    });

    if (result.isConfirmed) {
        try {
            await removeLocationFromPlanAPI(state.TRIP_ID, planId, locationId);

            Swal.fire({
                icon: 'success',
                text: 'مکان حذف شد',
                confirmButtonColor: '#A6B28B',
                confirmButtonText: 'باشه',
                timer: 1500,
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            await fetchAndRenderPlans();

        } catch (error) {
            console.error('خطا:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا در حذف مکان',
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

async function deletePlan(planId) {
    const result = await Swal.fire({
        text: 'آیا از حذف این پلن مطمئن هستید؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#f5c9b0',
        cancelButtonColor: '#A6B28B',
        background: '#f0f0f0',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        }
    });

    if (result.isConfirmed) {
        try {
            await deletePlanAPI(state.TRIP_ID, planId);

            Swal.fire({
                icon: 'success',
                text: 'پلن حذف شد',
                confirmButtonColor: '#A6B28B',
                confirmButtonText: 'باشه',
                timer: 1500,
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            await fetchAndRenderPlans();

        } catch (error) {
            console.error('خطا:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا در حذف پلن',
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
        await votePlanAPI(state.TRIP_ID, planId, voteType);
        await fetchAndRenderPlans();
    } catch (error) {
        console.error('خطا:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ثبت رأی',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}

export async function fetchAndRenderPlans() {
    try {
        const response = await getTripPlans(state.TRIP_ID);

        // بررسی ساختار response
        let plans = [];
        if (Array.isArray(response)) {
            plans = response;
        } else if (response && Array.isArray(response.data)) {
            plans = response.data;
        } else if (response && Array.isArray(response.plans)) {
            plans = response.plans;
        } else if (response && response.success && Array.isArray(response.data)) {
            plans = response.data;
        }

        console.log('Plans received:', plans);
        state.dailyPlans = plans;
        renderDailyPlans();
    } catch (error) {
        console.error('خطا در دریافت پلن‌ها:', error);
        state.dailyPlans = [];
        renderDailyPlans();
    }
}


function populatePlanDaySelect() {
    const daySelect = document.getElementById('planDaySelect');
    if (!daySelect) return;

    const tripDuration = state.tripData?.duration;

    daySelect.innerHTML = '<option value="">روز را انتخاب کنید...</option>';

    for (let i = 1; i <= tripDuration; i++) {
        daySelect.innerHTML += `
            <option value="روز ${getPersianOrdinalDay(i)}">
                روز ${getPersianOrdinalDay(i)}
            </option>
        `;
    }
}


// پر کردن select شهرها
function populatePlanCitySelect() {
    const citySelect = document.getElementById('planCitySelect');
    if (!citySelect) return;

    // استخراج شهرهای یونیک از مکان‌های انتخاب شده
    const cities = [...new Set(state.selectedLocations.map(loc => loc.city))];

    citySelect.innerHTML = '<option value="">شهر را انتخاب کنید...</option>';

    cities.forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });
}

// Modal: Create New Plan
document.getElementById('createPlanBtn')?.addEventListener('click', () => {
    selectedPlanLocations = [];
    const modal = document.getElementById('createPlanModal');
    if (modal) {
        modal.classList.add('active');

        // پر کردن select روزها
        populatePlanDaySelect();

        // پر کردن select شهرها
        populatePlanCitySelect();

        // پاک کردن grid و list
        const availableGrid = document.getElementById('availablePlanLocationsGrid');
        const selectedList = document.getElementById('planLocationsList');
        if (availableGrid) availableGrid.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">لطفاً ابتدا شهر را انتخاب کنید</p>';
        if (selectedList) selectedList.innerHTML = '<p style="text-align: center; color: #9ca3af;">هیچ مکانی انتخاب نشده</p>';
    }
});

document.getElementById('closePlanModal')?.addEventListener('click', () => {
    document.getElementById('createPlanModal').classList.remove('active');
});

// فیلتر مکان‌ها بر اساس شهر انتخاب شده
// تعریف یک متغیر برای نگه داشتن آخرین شهر انتخاب شده
let lastSelectedCity = "";

document.getElementById('planCitySelect')?.addEventListener('change', async (e) => {
    const newCity = e.target.value;

    if (selectedPlanLocations.length > 0) {
        const result = await Swal.fire({
            text: 'با تغییر شهر، مکان‌های انتخاب شده قبلی پاک خواهند شد. ادامه می‌دهید؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، پاک کن',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            color: '#4b5563',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            },
        });

        if (!result.isConfirmed) {
            e.target.value = lastSelectedCity;
            return;
        }
    }

    lastSelectedCity = newCity;
    selectedPlanLocations = [];
    updateSelectedPlanLocationsList();
    renderPlanLocationsList(newCity);
});

function togglePlanLocation(locationId) {
    const index = selectedPlanLocations.indexOf(locationId);
    if (index > -1) {
        selectedPlanLocations.splice(index, 1);
    } else {
        selectedPlanLocations.push(locationId);
    }

    // آپدیت فقط لیست انتخاب شده‌ها
    updateSelectedPlanLocationsList();

    // آپدیت visual در grid
    const citySelect = document.getElementById('planCitySelect');
    const selectedCity = citySelect?.value;
    if (selectedCity) {
        renderPlanLocationsList(selectedCity);
    }
}

function removePlanLocation(locationId) {
    const index = selectedPlanLocations.indexOf(locationId);
    if (index > -1) {
        selectedPlanLocations.splice(index, 1);
    }

    updateSelectedPlanLocationsList();

    const citySelect = document.getElementById('planCitySelect');
    const selectedCity = citySelect?.value;
    if (selectedCity) {
        renderPlanLocationsList(selectedCity);
    }
}

function renderPlanLocationsList(filterCity = null) {
    const availableGrid = document.getElementById('availablePlanLocationsGrid');

    if (!availableGrid || !filterCity) {
        if (availableGrid) {
            availableGrid.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">لطفاً ابتدا شهر را انتخاب کنید</p>';
        }
        return;
    }

    const locationsToShow = state.selectedLocations.filter(loc => loc.city === filterCity);

    if (locationsToShow.length === 0) {
        availableGrid.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">مکانی برای این شهر انتخاب نشده است</p>';
        return;
    }

    availableGrid.innerHTML = locationsToShow.map(loc => {
        const isSelected = selectedPlanLocations.includes(loc.id);

        return `
        <div class="available-location-card ${isSelected ? 'selected' : ''}"
             onclick="togglePlanLocation(${loc.id})"
             style="cursor: pointer;">
            <img src="${loc.image}" alt="${loc.name}">
            <div class="available-location-info">
                <h4>${loc.name}</h4>
                <p>
                    <i class="fas fa-tag"></i>
                    ${loc.category}
                </p>
                ${loc.avg_rating ? `
                    <div class="rating-container">
                        ${generateStarRating(loc.avg_rating)}
                        <span class="rating-number">
                            ${englishToPersianNumber(loc.avg_rating.toFixed(1))}
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    }).join('');


    // آپدیت لیست انتخاب شده‌ها
    updateSelectedPlanLocationsList();
}

function updateSelectedPlanLocationsList() {
    const selectedList = document.getElementById('planLocationsList');
    if (!selectedList) return;

    if (selectedPlanLocations.length === 0) {
        selectedList.innerHTML = '<p style="text-align: center; color: #9ca3af;">هیچ مکانی انتخاب نشده</p>';
    } else {
        selectedList.innerHTML = selectedPlanLocations.map((id, index) => {
            const location = state.selectedLocations.find(l => l.id === id);
            if (!location) return '';
            return `
                <div class="selected-plan-location-item">
                    <span class="plan-number">${englishToPersianNumber(index + 1)}</span>
                    <span class="plan-name">${location.name}</span>
                    <button onclick="window.removePlanLocation(${id}); event.stopPropagation();" class="btn-remove-mini">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
}

document.getElementById('savePlanBtn')?.addEventListener('click', async () => {
    const day = document.getElementById('planDaySelect')?.value;
    const city = document.getElementById('planCitySelect')?.value;

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
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const planPayload = {
            title: day,
            city: city,
            locationIds: selectedPlanLocations
        };

        await createPlan(state.TRIP_ID, planPayload);

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

        document.getElementById('createPlanModal').classList.remove('active');
        selectedPlanLocations = [];

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

// Auto Generate Plans
document.getElementById('autoPlanBtn')?.addEventListener('click', async () => {
    const {value: locationsPerDay} = await Swal.fire({
        text: 'در هر روز چند مکان قرار گیرد؟',
        input: 'number',
        inputValue: 3,
        showCancelButton: true,
        confirmButtonText: 'تولید برنامه',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#A6B28B',
        cancelButtonColor: '#f5c9b0',
        background: '#f0f0f0',
        customClass: {
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
                didOpen: () => Swal.showLoading(),
                confirmButtonColor: '#A6B28B',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            await autoGeneratePlansAPI(state.TRIP_ID, parseInt(locationsPerDay));

            Swal.fire({
                icon: 'success',
                text: 'پلن‌ها با موفقیت ایجاد شدند',
                confirmButtonText: 'باشه',
                confirmButtonColor: '#A6B28B',
                timer: 2000,
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });

            await fetchAndRenderPlans();

        } catch (error) {
            console.error('خطا:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا',
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

// Map for Plans
let plansMap = null;

export function initPlansMap() {
    const mapContainer = document.getElementById('plansMap');

    if (mapContainer) {
        mapContainer.style.display = 'block';
    }

    if (plansMap) plansMap.remove();

    plansMap = L.map('plansMap').setView([35.6892, 51.3890], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(plansMap);

    setTimeout(() => {
        if (plansMap) {
            plansMap.invalidateSize();
        }
    }, 100);
}

function viewPlanOnPlanMap(planId) {
    const plan = state.dailyPlans.find(p => p.id === planId);
    if (!plan) return;

    initPlansMap();

    plansMap.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            plansMap.removeLayer(layer);
        }
    });

    const latlngs = [];
    const markers = [];

    plan.locations.forEach((planLoc, index) => {
        const fullLocation = state.selectedLocations.find(loc => loc.id === planLoc.id);

        if (fullLocation && fullLocation.lat && fullLocation.lng) {
            const latLng = [fullLocation.lat, fullLocation.lng];
            latlngs.push(latLng);

            // ایجاد مارکر
            const marker = L.marker(latLng).addTo(plansMap);
            marker.bindPopup(`
                <div style="text-align: center; font-family: 'Anjoman';">
                    <strong>${englishToPersianNumber(index + 1)}. ${planLoc.name}</strong><br>
                    ${fullLocation.category ? `<span style="color: #666;">${getCategoryName(fullLocation.category)}</span>` : ''}
                </div>
            `);
            markers.push(marker);
        }
    });

    // اگر حداقل 2 نقطه داریم، خط رسم کن
    if (latlngs.length >= 2) {
        const polyline = L.polyline(latlngs, {
            color: '#A6B28B',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(plansMap);

        plansMap.fitBounds(polyline.getBounds(), {padding: [50, 50]});
    } else if (latlngs.length === 1) {
        // اگر فقط یک نقطه داریم، روی آن متمرکز شو
        plansMap.setView(latlngs[0], 14);
    } else {
        // اگر هیچ نقطه‌ای نداریم
        Swal.fire({
            icon: 'warning',
            text: 'این پلن مختصات جغرافیایی ندارد',
            confirmButtonColor: '#A6B28B',
            confirmButtonText: 'باشه',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
        return;
    }

    // اسکرول به نقشه
    document.querySelector('.plans-map')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Export to window
window.toggleEditPlan = toggleEditPlan;
window.savePlanOrder = savePlanOrder;
window.showAddLocationToPlan = showAddLocationToPlan;
window.addLocationToPlan = addLocationToPlan;
window.removeLocationFromPlan = removeLocationFromPlan;
window.deletePlan = deletePlan;
window.votePlan = votePlan;
window.togglePlanLocation = togglePlanLocation;
window.removePlanLocation = removePlanLocation;
window.viewPlanOnPlanMap = viewPlanOnPlanMap;