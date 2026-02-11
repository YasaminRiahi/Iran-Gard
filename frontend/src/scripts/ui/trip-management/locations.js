import { state , fetchAndAssignTripData } from './core.js';
import {
    voteOnLocation,
    removeLocationFromTrip,
    updateVisitedStatus,
    getPlacesForTrip,
    addLocationToTrip,
    autoGeneratePlaces
} from '/src/scripts/services/trips-service.js';
import { englishToPersianNumber, getCategoryName, generateStarRating} from './utils.js';

let selectedLocationIds = [];

export function initMap() {
    if (state.map) {
        state.map.remove();
    }

    state.map = L.map('locationsMap').setView([35.6892, 51.3890], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(state.map);

    updateMapMarkers();
}

function updateMapMarkers() {
    if (!state.map) return;

    state.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            state.map.removeLayer(layer);
        }
    });

    state.selectedLocations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng]).addTo(state.map);
        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Anjoman';">
                <strong>${location.name}</strong><br>
                <span style="color: #666;">${location.category}</span>
            </div>
        `);
    });

    if (state.selectedLocations.length > 0) {
        const bounds = L.latLngBounds(state.selectedLocations.map(loc => [loc.lat, loc.lng]));
        state.map.fitBounds(bounds, {padding: [50, 50]});
    }
}

export function renderLocations() {
    const locationsList = document.getElementById('locationsList');

    if (state.selectedLocations.length === 0) {
        locationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marked-alt"></i>
                <h3>هنوز مکانی انتخاب نشده است</h3>
                <p>برای شروع، روی دکمه "افزودن مکان" کلیک کنید</p>
            </div>
        `;
        return;
    }

    const sortedLocations = [...state.selectedLocations].sort((a, b) => {
        if (a.visited && !b.visited) return 1;
        if (!a.visited && b.visited) return -1;
        const aScore = a.votes.likes - a.votes.dislikes;
        const bScore = b.votes.likes - b.votes.dislikes;
        return bScore - aScore;
    });

    locationsList.innerHTML = sortedLocations.map((location, index) => `
        <div class="location-item ${location.visited ? 'visited' : ''}">
            <div class="location-rank">#${englishToPersianNumber(index + 1)}</div>
            ${state.isOwner ? `
            <button class="btn-remove-location" onclick="window.removeLocation(${location.id})" title="حذف مکان">
                <i class="fas fa-times"></i>
            </button>
                       
            <button class="btn-visited-check ${location.visited ? 'checked' : ''}" 
                    onclick="window.toggleVisited(${location.id})" 
                    title="${location.visited ? 'مشاهده شده' : 'علامت‌گذاری به عنوان مشاهده شده'}">
                <i class="fas fa-check"></i>
            </button>
            ` : ''}
            
            <div class="location-image-wrapper" onclick="window.viewLocation(${location.id})">
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
                            onclick="window.voteLocation(${location.id}, 'like')">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="vote-count">${englishToPersianNumber(location.votes.likes)}</span>
                    </button>
                    <button class="vote-btn ${location.userVote === 'dislike' ? 'disliked' : ''}" 
                            onclick="window.voteLocation(${location.id}, 'dislike')">
                        <i class="fas fa-thumbs-down"></i>
                        <span class="vote-count">${englishToPersianNumber(location.votes.dislikes)}</span>
                    </button>
                </div>
            </div>
            <div class="location-actions">
                <button class="btn-show-map" onclick="window.showLocationOnMap(${location.id})">
                    <i class="fas fa-map-marker-alt"></i> روی نقشه
                </button>
            </div>
        </div>
    `).join('');
}

// Remove Location
async function removeLocation(locationId) {
    try {
        const location = state.selectedLocations.find(loc => loc.id === locationId);
        const locationName = location ? location.name : 'این مکان';

        const result = await Swal.fire({
            title: 'حذف مکان',
            html: `آیا مطمئن هستید که می‌خواهید <strong>${locationName}</strong> را از سفر حذف کنید؟`,
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
            const response = await removeLocationFromTrip(state.TRIP_ID, locationId);

            if (response?.success) {
                state.selectedLocations = state.selectedLocations.filter(loc => loc.id !== locationId);
                renderLocations();
                initMap();

                Swal.fire({
                    icon: 'success',
                    text: 'مکان با موفقیت حذف شد',
                    confirmButtonText : 'باشه',
                    confirmButtonColor: '#A6B28B',
                    cancelButtonColor: '#f5c9b0',
                    background: '#f0f0f0',
                    customClass: {
                        popup: 'my-swal-popup',
                        confirmButton: 'my-confirm-btn',
                        cancelButton: 'my-cancel-btn'
                    },
                    timer: 2000
                });
            }
        }
    } catch (error) {
        console.error('Delete Location Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در حذف مکان',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonText : 'باشه',
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

// Toggle Visited
async function toggleVisited(locationId) {
    try {
        const location = state.selectedLocations.find(loc => loc.id === locationId);
        if (!location) return;

        const newStatus = !location.visited;
        const response = await updateVisitedStatus(state.TRIP_ID, locationId, newStatus);
        const result = response.data?.data || response.data;

        if (result) {
            location.visited = result.visited;
            renderLocations();
        }
    } catch (error) {
        console.error('Update Visited Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در بروزرسانی',
            text: 'مشکلی پیش آمد',
            confirmButtonText : 'باشه',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            },
            timer: 2000
        });
    }
}

// Vote Location
async function voteLocation(locationId, voteType) {
    try {
        const location = state.selectedLocations.find(loc => loc.id === locationId);
        if (!location) return;

        const finalVote = location.userVote === voteType ? null : voteType;
        const response = await voteOnLocation(state.TRIP_ID, locationId, finalVote);
        const result = response.data?.data || response.data;

        if (result) {
            location.votes = result.votes;
            location.userVote = result.userVote;
            renderLocations();
        }
    } catch (error) {
        console.error('Vote Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در ثبت رای',
            text: error.response?.data?.detail || 'مشکلی پیش آمد',
            confirmButtonText : 'باشه',
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

function viewLocation(locationId) {
    window.location.href = `../places/each-place.html?id=${locationId}`;
}

function showLocationOnMap(locationId) {
    const location = state.selectedLocations.find(loc => loc.id === locationId);
    if (!location || !state.map) return;

    state.map.setView([location.lat, location.lng], 15);
    window.scrollTo({
        top: document.querySelector('.locations-map').offsetTop - 150,
        behavior: 'smooth'
    });
}

// Add Location Modal
const addLocationModal = document.getElementById('addLocationModal');
const addLocationBtn = document.getElementById('addLocationBtn');
const closeLocationModal = document.getElementById('closeLocationModal');

addLocationBtn?.addEventListener('click', () => {
    addLocationModal.classList.add('active');
    renderAvailableLocations();
});

closeLocationModal?.addEventListener('click', () => {
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
        const response = await getPlacesForTrip(state.TRIP_ID);
        const data = response.data || response;

        if (!data.cities || data.cities.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>همه مکان‌ها اضافه شده‌اند</h3>
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
                                 onclick="window.toggleLocationSelection(${place.place_id})">
                                <img src="${place.first_picture_url}" 
                                     alt="${place.place_name}"
                                     onerror="this.src="">
                                <div class="available-location-info">
                                    <h5>${place.place_name}</h5>
                                    <p><i class="fas fa-tag"></i> ${getCategoryName(place.category_id.toString())}</p>
                                    ${place.avg_rating ? `
                                        <div class="rating-container">
                                            ${generateStarRating(place.avg_rating)}
                                            <span class="rating-number">${englishToPersianNumber(place.avg_rating.toFixed(1))}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

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
        console.error('خطا در دریافت مکان‌ها:', error);
        grid.innerHTML = `<div style="text-align: center; color: #f5c9b0;">خطا در دریافت مکان‌ها</div>`;
    }
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

async function addSelectedLocationsToTrip() {
    if (selectedLocationIds.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً حداقل یک مکان انتخاب کنید',
            confirmButtonText : 'باشه',
            confirmButtonColor: '#A6B28B',
            cancelButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            }
        });
        return;
    }

    try {
        Swal.fire({
            title: 'در حال افزودن...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: {
                popup: 'my-swal-popup',
            }
        });

        let successCount = 0;

        for (const locationId of selectedLocationIds) {
            try {
                const response = await addLocationToTrip(state.TRIP_ID, locationId);
                const result = response.data || response;
                if (result) {
                    state.selectedLocations.push({
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
                    });
                    successCount++;
                }
            } catch (err) {
                console.error('خطا در افزودن:', locationId, err);
            }
        }

        if (successCount > 0) {
            Swal.fire({
                icon: 'success',
                title: 'اضافه شد',
                timer: 2000,
                confirmButtonText : 'باشه',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            });

            selectedLocationIds = [];
            renderLocations();
            updateMapMarkers();
            addLocationModal.classList.remove('active');
        }
    } catch (error) {
        console.error('خطا:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در افزودن',
            confirmButtonText : 'باشه',
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

// Auto Generate
document.getElementById('autoGenerateBtn')?.addEventListener('click', async () => {
    const {value: topN} = await Swal.fire({
        text: 'در هر شهر چند مورد اضافه شود؟',
        input: 'number',
        inputValue: 3,
        showCancelButton: true,
        confirmButtonText: 'تولید',
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

    if (topN) {
        try {
            await autoGeneratePlaces(state.TRIP_ID, {top_n: parseInt(topN)});

            Swal.fire({
                icon: 'success',
                title: 'با موفقیت اضافه شد',
                confirmButtonText : 'باشه',
                confirmButtonColor: '#A6B28B',
                cancelButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                },
                timer: 2000
            });

            // Reload locations
            const response = await fetchAndAssignTripData();
            renderLocations();
            initMap();
        } catch (error) {
            console.error('خطا:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                confirmButtonText : 'باشه',
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
});

// Export to window
window.removeLocation = removeLocation;
window.toggleVisited = toggleVisited;
window.voteLocation = voteLocation;
window.viewLocation = viewLocation;
window.showLocationOnMap = showLocationOnMap;
window.toggleLocationSelection = toggleLocationSelection;