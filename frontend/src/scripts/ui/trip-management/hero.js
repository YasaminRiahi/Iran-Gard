import { state } from './core.js';
import { englishToPersianNumber } from './utils.js';

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
}

// End Trip
document.getElementById('endTripBtn')?.addEventListener('click', () => {
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
            const totalExpense = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);

            Swal.fire({
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
                        <p><strong>تعداد مکان‌های بازدید شده:</strong> ${state.selectedLocations.length}</p>
                        <p><strong>تعداد پلن‌های روزانه:</strong> ${state.dailyPlans.length}</p>
                        <p><strong>کل هزینه‌ها:</strong> ${englishToPersianNumber(totalExpense.toLocaleString())} تومان</p>
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