import { state } from './core.js';
import {englishToPersianNumber, persianOrdinalToNumber} from './utils.js';
import { completeTrip } from '/src/scripts/services/trips-service.js';

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

// End Trip
document.getElementById('endTripBtn')?.addEventListener('click', async () => {
    const result = await Swal.fire({
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
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: 'در حال پایان دادن سفر...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
                background: '#f0f0f0'
            });

            await completeTrip(state.TRIP_ID);

            const totalExpense = state.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

            await Swal.fire({
                icon: 'success',
                title: 'سفر به پایان رسید!',
                html: `
                    <div style="text-align: right; direction: rtl; padding: 1rem;">
                        <h3 style="margin-bottom: 1rem; color: #A6B28B;">
                            <i class="fas fa-check-circle"></i> خلاصه سفر
                        </h3>
                        <p><strong>نام سفر:</strong> ${state.tripData.name}</p>
                        <p><strong>تاریخ:</strong> ${state.tripData.startDate} تا ${state.tripData.endDate}</p>
                        <p><strong>تعداد شرکت‌کنندگان:</strong> ${state.tripData.participants.length} نفر</p>
                        <p><strong>تعداد مکان‌های بازدید شده:</strong> ${state.selectedLocations?.length || 0}</p>
                        <p><strong>تعداد پلن‌های روزانه:</strong> ${state.dailyPlans?.length || 0}</p>
                        <p><strong>کل هزینه‌ها:</strong> ${englishToPersianNumber(totalExpense.toLocaleString())} تومان</p>
                        <p style="margin-top: 1rem; color: #A6B28B; font-weight: 600;">
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
            });

            window.location.href = 'my-trips.html';

        } catch (error) {
            console.error('خطا در پایان دادن سفر:', error);

            let errorMessage = 'مشکلی در پایان دادن سفر پیش آمد';

            if (error.response?.status === 403) {
                errorMessage = 'شما مجاز به پایان دادن این سفر نیستید';
            } else if (error.response?.status === 400) {
                errorMessage = 'این سفر قبلاً به پایان رسیده است';
            }

            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: errorMessage,
                confirmButtonText: 'باشه',
                confirmButtonColor: '#f5c9b0',
                background: '#f0f0f0',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });
        }
    }
});


// تابع پرینت حرفه‌ای - نسخه کامل
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
