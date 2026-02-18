import { state} from '/src/scripts/ui/trip-management/core.js';
import {englishToPersianNumber, persianOrdinalToNumber,getCategoryName, getPersianOrdinalDay} from '/src/scripts/ui/trip-management/utils.js';

import {
    getSettlement, getURL
} from '/src/scripts/services/trips-service.js';
//Hero
export function updateHeroSection() {
    const titleElement = document.querySelector('.trip-hero-title');
    if (titleElement) {
        titleElement.textContent = state.tripData.name;
    }

    const dateElement = document.querySelector('.meta-item-hero:nth-child(1) .meta-value');
    if (dateElement) {
        dateElement.textContent = `${state.tripData.startDate} تا ${state.tripData.endDate}`;
    }

    const destinationElement = document.querySelector('.meta-item-hero:nth-child(2) .meta-value');
    if (destinationElement) {
        destinationElement.textContent = state.tripData.cities.join('، ');
    }

    const participantsElement = document.querySelector('.meta-item-hero:nth-child(3) .meta-value');
    if (participantsElement) {
        participantsElement.textContent = `${englishToPersianNumber(state.tripData.participants.length)} نفر`;
    }

    const endTripBtn = document.getElementById('endTripBtn');
    if (endTripBtn && !state.isOwner) {
        endTripBtn.style.display = 'none';
    }
}


export function printTripReport() {
    const totalExpense = state.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    // گروه‌بندی پلن‌ها بر اساس روز
    const plansByDay = {};
    state.dailyPlans?.forEach(plan => {
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

    // ساخت HTML صفحه پرینت
    const printContent = `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>گزارش سفر - ${state.tripData.name}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    background: white;
                    color: #1f2937;
                    padding: 2rem;
                    line-height: 1.8;
                }
                
                .print-header {
                    text-align: center;
                    padding: 2rem;
                    background: linear-gradient(135deg, #A6B28B 0%, #8B9D7B 100%);
                    color: white;
                    border-radius: 15px;
                    margin-bottom: 2rem;
                }
                
                .print-header h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 700;
                }
                
                .print-header .subtitle {
                    font-size: 1rem;
                    opacity: 0.9;
                }
                
                .section {
                    margin-bottom: 1.8rem;
                    page-break-inside: avoid;
                }
                
                .section-title {
                    font-size: 1.2rem;
                    color: #A6B28B;
                    border-bottom: 3px solid #A6B28B;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .info-item {
                    background: #f9fafb;
                    padding: 1rem;
                    border-radius: 10px;
                    border-right: 4px solid #A6B28B;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #6b7280;
                    font-size: 0.9rem;
                    margin-bottom: 0.3rem;
                }
                
                .info-value {
                    font-size: 1.1rem;
                    color: #1f2937;
                    font-weight: 500;
                }
                
                .participants-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .participant-badge {
                    background: #A6B28B;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                }
                
                .locations-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.8rem;
                    margin-top: 1rem;
                }
                
                .location-card {
                    background: #f9fafb;
                    padding: 0.8rem 1rem;
                    border-radius: 8px;
                    border-right: 3px solid #A6B28B;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                
                .location-icon {
                    color: #A6B28B;
                    font-size: 1.1rem;
                }
                
                .location-name {
                    font-weight: 500;
                    color: #1f2937;
                }
                
                .location-city {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-right: 0.5rem;
                }
                
                .day-section {
                    background: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    border-right: 5px solid #A6B28B;
                }
                
                .day-title {
                    font-size: 1rem;
                    color: #A6B28B;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .plan-item {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .plan-city {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }
                
                .location-list {
                    list-style: none;
                    padding-right: 1rem;
                }
                
                .location-item {
                    color: #4b5563;
                    border-right: 2px solid #d1d5db;
                    padding-right: 0.8rem;
                    margin-bottom: 0.1rem;
                }
                
                .location-number {
                    display: inline-block;
                    background: #A6B28B;
                    color: white;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 25px;
                    font-size: 0.8rem;
                    margin-left: 0.5rem;
                }
                
                .expense-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem;
                    background: white;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    border-right: 3px solid #f5c9b0;
                }
                
                .expense-description {
                    font-weight: 500;
                    color: #1f2937;
                }
                
                .expense-amount {
                    font-weight: 600;
                    color: #A6B28B;
                    font-size: 1.1rem;
                }
                
                .settlement-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: white;
                    border-radius: 8px;
                    margin-bottom: 0.8rem;
                    border-right: 4px solid #A6B28B;
                }
                
                .settlement-from-to {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-weight: 500;
                }
                
                .settlement-person {
                    color: #1f2937;
                    font-weight: 600;
                }
                
                .settlement-arrow {
                    color: #A6B28B;
                    font-size: 1.2rem;
                }
                
                .settlement-amount {
                    font-weight: 700;
                    color: #A6B28B;
                    font-size: 1.2rem;
                }
                
                .total-box {
                    background: linear-gradient(135deg, #A6B28B 0%, #8B9D7B 100%);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 10px;
                    text-align: center;
                    margin-top: 1rem;
                }
                
                .total-label {
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                }
                
                .total-amount {
                    font-size: 2rem;
                    font-weight: 700;
                }
                
                .footer {
                    text-align: center;
                    padding: 2rem;
                    color: #9ca3af;
                    border-top: 2px solid #e5e7eb;
                    margin-top: 3rem;
                }
                
                @media print {
                    body {
                        padding: 0;
                    }
                    
                    .section {
                        page-break-inside: avoid;
                    }
                    
                    .day-section {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div class="print-header">
                <h1>📋 گزارش سفر</h1>
                <div class="subtitle">${state.tripData.name}</div>
            </div>
            
            <!-- اطلاعات کلی -->
            <div class="section">
                <h2 class="section-title">📌 اطلاعات کلی</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">🗓 تاریخ سفر</div>
                        <div class="info-value">${state.tripData.startDate} تا ${state.tripData.endDate}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📍 مقصدها</div>
                        <div class="info-value">${state.tripData.cities.join('، ')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">👥 تعداد شرکت‌کنندگان</div>
                        <div class="info-value">${englishToPersianNumber(state.tripData.participants.length)} نفر</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🎯 مکان‌ها</div>
                        <div class="info-value">${englishToPersianNumber(state.selectedLocations?.length || 0)} مکان</div>
                    </div>
                </div>
            </div>
            
            <!-- شرکت‌کنندگان -->
            <div class="section">
                <h2 class="section-title">👥 شرکت‌کنندگان</h2>
                <div class="participants-list">
                    ${state.tripData.participants.map(p => `
                        <div class="participant-badge">${p.username}</div>
                    `).join('')}
                </div>
            </div>
            
            <!-- لیست مکان‌های انتخاب شده -->
            ${state.selectedLocations && state.selectedLocations.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">📍 مکان‌های انتخاب شده</h2>
                    <div class="locations-grid">
                        ${state.selectedLocations.map(loc => `
                            <div class="location-card">
                                <span class="location-icon">📌</span>
                                <div>
                                    <div class="location-name">${loc.name}</div>
                                    <span class="location-city">${loc.city}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- برنامه روزانه -->
            ${sortedDays.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">📅 برنامه روزانه</h2>
                    ${sortedDays.map(day => {
        const dayPlans = plansByDay[day];
        return `
                            <div class="day-section">
                                <div class="day-title">${day}</div>
                                ${dayPlans.map(plan => `
                                    <div class="plan-item">
                                        <div class="plan-city">🏙 ${plan.city}</div>
                                        <ul class="location-list">
                                            ${plan.locations.map((loc, idx) => `
                                                <li class="location-item">
                                                    <span class="location-number">${englishToPersianNumber(idx + 1)}</span>
                                                    ${loc.name}
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        `;
    }).join('')}
                </div>
            ` : ''}
            
            <!-- هزینه‌ها -->
            ${state.expenses && state.expenses.length > 0 ? `
            <div class="section">
                <h2 class="section-title">💰 هزینه‌ها</h2>
                ${state.expenses.map(exp => {
        const payer = state.tripData.participants.find(p => p.id === exp.payerId);
        const payerName = payer ? payer.name : 'نامشخص';

        return `
                    <div class="expense-item">
                        <div class="expense-description">
                            <strong>${exp.category}:</strong> ${exp.description}
                            <br>
                            <span style="color: #A6B28B; margin-top: 0.3rem; display: inline-block;">
                            👤 پرداخت‌کننده: ${payerName}
                            </span>
                        </div>
                        <div class="expense-amount">
                            ${englishToPersianNumber(exp.amount.toLocaleString())} تومان
                        </div>
                    </div>
                `;
    }).join('')}
        
                <div class="total-box">
                    <div class="total-label">مجموع کل هزینه‌ها</div>
                    <div class="total-amount">
                        ${englishToPersianNumber(totalExpense.toLocaleString())} تومان
                    </div>
                </div>
            </div>
            ` : ''}
            
            
            <!-- تصفیه حساب -->
            ${state.settlements && state.settlements.length > 0 ? `
                <div class="section">
                    <h2 class="section-title">💸 تسویه حساب</h2>
                    ${state.settlements.map(settlement => `
                        <div class="settlement-item">
                            <div class="settlement-from-to">
                                <span class="settlement-person">${settlement.from_name}</span>
                                <span class="settlement-arrow">←</span>
                                <span class="settlement-person">${settlement.to_name}</span>
                            </div>
                            <div class="settlement-amount">
                                ${englishToPersianNumber(settlement.amount.toLocaleString())} تومان
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
                <p>${new Date().toLocaleDateString('fa-IR')}</p>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
        printWindow.print();
    };
}

document.getElementById('printTripBtn')?.addEventListener('click', printTripReport);


//Locations
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
                           'like')">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="vote-count">${englishToPersianNumber(location.votes.likes)}</span>
                    </button>
                    <button class="vote-btn ${location.userVote === 'dislike' ? 'disliked' : ''}" 
                            'dislike')">
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


function viewLocation(locationId) {
    window.location.href = `/places/each-place.html?id=${locationId}`;
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


// Export to window
window.viewLocation = viewLocation;
window.showLocationOnMap = showLocationOnMap;


//Plans
let selectedPlanLocations = [];
let draggedElement = null;

export function renderDailyPlans() {
    const plansGrid = document.getElementById('plansGrid');

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
                            
                            <div class="plan-voting">
                                <button class="plan-vote-btn ${plan.userVote === 'like' ? 'liked' : ''}" 
                                         'like')">
                                    <i class="fas fa-thumbs-up"></i>
                                    <span class="vote-count">${plan.votes.likes}</span>
                                </button>
                                <button class="plan-vote-btn ${plan.userVote === 'dislike' ? 'disliked' : ''}" 
                                         'dislike')">
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
}


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

    // پاک کردن مارکرها و خطوط قبلی
    plansMap.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            plansMap.removeLayer(layer);
        }
    });

    // ایجاد آرایه مختصات با استفاده از state.selectedLocations
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

    document.querySelector('.plans-map')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Export to window
window.viewPlanOnPlanMap = viewPlanOnPlanMap;


//Expenses
let editingExpenseId = null;

export function renderExpenses() {
    const expensesList = document.getElementById('expensesList');

    if (state.expenses.length === 0) {
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

    expensesList.innerHTML = state.expenses.map(expense => {
        const payer = state.tripData.participants.find(p => p.id === expense.payerId);
        const participantNames = expense.participants.map(p => {
            const participant = state.tripData.participants.find(part => part.id === p.id);
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
                            <i class="fas fa-user"></i> ${payer ? payer.username : 'نامشخص'}
                        </span>
                        <span class="expense-meta-item" style="max-width: 400px; white-space: normal;">
                            <i class="fas fa-users"></i> ${participantNames}
                        </span>
                    </div>
                </div>
                <div class="expense-amount">
                    ${englishToPersianNumber(expense.amount.toLocaleString())} تومان
                </div>
            </div>            
        `;
    }).join('');

    updateExpensesSummary();
    calculateSettlement();
}

function updateExpensesSummary() {
    const totalExpense = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalExpense').textContent = `${englishToPersianNumber(totalExpense.toLocaleString())} تومان`;
}

async function calculateSettlement() {
    const settlementList = document.getElementById('settlementList');

    if (state.expenses.length === 0) {
        settlementList.innerHTML = '<p style="text-align: center; color: #9ca3af;">هزینه‌ای برای تسویه وجود ندارد</p>';
        return;
    }

    try {
        const response = await getSettlement(state.TRIP_ID);
        const data = response.data || response;

        let settlements = [];

        if (Array.isArray(data)) {
            settlements = data;
            state.settlements = settlements;
        } else if (data.settlements && Array.isArray(data.settlements)) {
            settlements = data.settlements;
            state.settlements = settlements;
        } else {
            settlementList.innerHTML = '<p style="text-align: center; color: #f5c9b0;">خطا در دریافت تسویه</p>';
            return;
        }

        if (settlements.length === 0) {
            settlementList.innerHTML = '<p style="text-align: center; color: #A6B28B; font-weight: 600;">✓ همه حساب‌ها تسویه است!</p>';
            return;
        }

        settlementList.innerHTML = settlements.map(s => {
            const fromName = `کاربر ${s.from_name}`;
            const toName = `کاربر ${s.to_name}`;

            return `
                <div class="settlement-item">
                    <p>
                        <strong>${fromName}</strong> باید 
                        <strong style="font-size: 1.2rem;">${englishToPersianNumber(Math.round(s.amount).toLocaleString())} تومان</strong> 
                        به <strong>${toName}</strong> بدهد
                    </p>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('خطا در تسویه:', error);
        settlementList.innerHTML = '<p style="text-align: center; color: #f5c9b0;">خطا در محاسبه تسویه</p>';
    }
}

//Participants

export function renderParticipants() {
    const participantsGrid = document.getElementById('participantsGrid');

    participantsGrid.innerHTML = `
        ${state.tripData.participants.map(participant => `
            <div class="participant-card">
                <img src="${getURL() + participant.avatar}" alt="${participant.name}" class="participant-avatar">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-username">${participant.username}</div>
                ${participant.isCreator ?
        '<div class="participant-badge"><i class="fas fa-crown"></i> سازنده سفر</div>'
        : ''}
            </div>
        `).join('')}
    `;
}
