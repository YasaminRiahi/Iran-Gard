/* ================================================================
   MY TRIPS PAGE - JAVASCRIPT (WITH WORKING DATE PICKER)
   ================================================================ */
/* ================================================================
   1. PAGE LOAD & SCROLL MANAGEMENT
   ================================================================ */

/**
 * Force scroll to top before page unload
 * Prevents browser from remembering scroll position
 */
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
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
        threshold: 0.1 // Trigger when 10% of element is visible
    });

    // Observe all elements with data-animate attribute
    animatedElements.forEach(element => {
        observer.observe(element);
    });
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
// ============ داده‌های Fake ============

const fakeCitiesData = {
    shiraz: [
        {
            id: 1,
            name: 'ارگ کریم‌خان',
            category: 'تاریخی',
            city: 'shiraz',
            image: '../src/assets/images/man-walking-stone-pathway-surrou.jpg',
            description: 'بنای تاریخی دوره زندیه'
        },
        {
            id: 2,
            name: 'باغ ارم',
            category: 'طبیعت',
            city: 'shiraz',
            image: '../src/assets/images/45677.jpg',
            description: 'باغ زیبای تاریخی'
        },
        {
            id: 3,
            name: 'حافظیه',
            category: 'فرهنگی',
            city: 'shiraz',
            image: '../src/assets/images/88bfd4e9d10d431265e291bc107e47d7.jpg',
            description: 'آرامگاه حافظ شیرازی'
        },
        {
            id: 4,
            name: 'تخت جمشید',
            category: 'تاریخی',
            city: 'shiraz',
            image: '../src/assets/images/man-walking-stone-pathway-surrou.jpg',
            description: 'پایتخت هخامنشیان'
        }
    ],
    isfahan: [
        {
            id: 5,
            name: 'میدان نقش جهان',
            category: 'تاریخی',
            city: 'isfahan',
            image: '../src/assets/images/45677.jpg',
            description: 'میدان تاریخی صفویه'
        },
        {
            id: 6,
            name: 'سی‌و‌سه‌پل',
            category: 'تاریخی',
            city: 'isfahan',
            image: '../src/assets/images/man-walking-stone-pathway-surrou.jpg',
            description: 'پل زیبای تاریخی'
        },
        {
            id: 7,
            name: 'کاخ چهلستون',
            category: 'تاریخی',
            city: 'isfahan',
            image: '../src/assets/images/88bfd4e9d10d431265e291bc107e47d7.jpg',
            description: 'کاخ صفویه'
        }
    ],
    tehran: [
        {
            id: 8,
            name: 'برج میلاد',
            category: 'تجاری',
            city: 'tehran',
            image: '../src/assets/images/88bfd4e9d10d431265e291bc107e47d7.jpg',
            description: 'برج مخابراتی تهران'
        },
        {
            id: 9,
            name: 'کاخ گلستان',
            category: 'تاریخی',
            city: 'tehran',
            image: '../src/assets/images/man-walking-stone-pathway-surrou.jpg',
            description: 'کاخ قاجاری'
        },
        {
            id: 10,
            name: 'توچال',
            category: 'طبیعت',
            city: 'tehran',
            image: '../src/assets/images/45677.jpg',
            description: 'تله‌کابین و پیست اسکی'
        }
    ]
};

const fakeFriendsData = [
    {
        id: 1,
        name: 'حسین کاظمی',
        username: '@hosein_k',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        id: 2,
        name: 'زهرا احمدی',
        username: '@zahra_a',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
        id: 3,
        name: 'علی رضایی',
        username: '@ali_r',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
        id: 4,
        name: 'مینا جعفری',
        username: '@mina_j',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    }
];

// ============ متغیرهای سراسری ============

let selectedStartDate = null;
let selectedEndDate = null;
let selectedCities = [];
let selectedLocations = [];
let selectedFriends = [];

// ============ تب‌های صفحه ============

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

// ============ Trip Requests Actions ============

document.querySelectorAll('.btn-accept').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.request-card');
        Swal.fire({
            icon: 'success',
            title: 'درخواست پذیرفته شد!',
            text: 'این سفر به لیست سفرهای جاری شما اضافه شد',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#A6B28B',
            background: '#f0f0f0',
            color: '#4b5563',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            },
        }).then(() => {
            card.style.animation = 'slideOut 0.4s ease forwards';
            setTimeout(() => card.remove(), 400);
        });
    });
});

document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.request-card');
        Swal.fire({
            icon: 'question',
            text: 'آیا مطمئن هستید که می‌خواهید این درخواست را رد کنید؟',
            showCancelButton: true,
            confirmButtonText: 'بله، رد کن',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#f5c9b0',
            cancelButtonColor: '#a6b28b',
            background: '#f0f0f0',
            color: '#4b5563',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                card.style.animation = 'slideOut 0.4s ease forwards';
                setTimeout(() => card.remove(), 400);
            }
        });
    });
});

// ============ Modal Management ============

const modal = document.getElementById('createTripModal');
const openModalBtn = document.getElementById('openCreateTripModal');
const closeModalBtn = document.getElementById('closeModal');

openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
    resetModal();
    // تاخیر کوتاه برای اطمینان از رندر شدن DOM
    setTimeout(() => {
        initializeDatePickers();
    }, 100);
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

function resetModal() {
    selectedStartDate = null;
    selectedEndDate = null;
    selectedCities = [];
    selectedLocations = [];
    selectedFriends = [];
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

// ============ Step Navigation ============

function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// ============ Step 0: Date Picker با Persian Datepicker ============

function initializeDatePickers() {
    // تقویم شروع
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

    // تقویم پایان
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
                confirmButtonColor: '#a6b28b',
                background: '#f0f0f0',
                color: '#4b5563',
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                },
            });
            return;
        }

        showStep(1);
    }
});

document.getElementById('backToStep0').addEventListener('click', () => {
    showStep(0);
});

// ============ Step 1: انتخاب چند شهر ============

document.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', function() {
        const city = this.dataset.city;

        if (selectedCities.includes(city)) {
            selectedCities = selectedCities.filter(c => c !== city);
            this.classList.remove('selected');
        } else {
            selectedCities.push(city);
            this.classList.add('selected');
        }

        updateSelectedCitiesBar();
        updateContinueButton();
    });
});

function updateSelectedCitiesBar() {
    const bar = document.getElementById('selectedCitiesBar');
    const list = document.getElementById('selectedCitiesList');

    if (selectedCities.length === 0) {
        bar.style.display = 'none';
        return;
    }

    bar.style.display = 'flex';

    const cityNames = {
        shiraz: 'شیراز',
        isfahan: 'اصفهان',
        tehran: 'تهران'
    };

    list.innerHTML = selectedCities.map(city =>
        `<span class="city-tag">${cityNames[city]}</span>`
    ).join('');
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continueToLocations');
    continueBtn.disabled = selectedCities.length === 0;
}

document.getElementById('continueToLocations').addEventListener('click', () => {
    loadLocations();
    showStep(2);
});

// ============ Step 2: بارگذاری مکان‌ها ============

function loadLocations() {
    const locationsGrid = document.getElementById('locationsGrid');
    const cityNameSpan = document.getElementById('selectedCityName');

    const cityNames = {
        shiraz: 'شیراز',
        isfahan: 'اصفهان',
        tehran: 'تهران'
    };

    cityNameSpan.textContent = selectedCities.map(c => cityNames[c]).join(' - ');

    const groupedHTML = selectedCities.map(city => {
        const cityLocations = fakeCitiesData[city] || [];

        return `
            <div class="city-section">
                <h4 class="city-section-title">
                    <i class="fas fa-city"></i> ${cityNames[city]}
                </h4>
                <div class="city-locations-grid">
                    ${cityLocations.map(location => `
                        <div class="location-card" data-location-id="${location.id}">
                            <img src="${location.image}" alt="${location.name}">
                            <div class="location-info">
                                <h5>${location.name}</h5>
                                <p><i class="fas fa-tag"></i> ${location.category}</p>
                                <p style="font-size: 0.8rem; margin-top: 0.5rem;">${location.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    locationsGrid.innerHTML = groupedHTML;

    document.querySelectorAll('.location-card').forEach(card => {
        card.addEventListener('click', function() {
            const locationId = parseInt(this.dataset.locationId);
            toggleLocationSelection(locationId, this);
        });
    });
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

    const allLocations = Object.values(fakeCitiesData).flat();
    const selectedLocationNames = selectedLocations.map(id => {
        const location = allLocations.find(loc => loc.id === id);
        return location ? location.name : '';
    }).filter(Boolean);

    listContainer.innerHTML = selectedLocationNames.map(name =>
        `<span class="location-tag">${name}</span>`
    ).join('');
}

function updateNextButton() {
    const nextBtn = document.getElementById('nextToStep3');
    nextBtn.disabled = selectedLocations.length === 0;
}

document.getElementById('backToStep1').addEventListener('click', () => {
    showStep(1);
});

document.getElementById('nextToStep3').addEventListener('click', () => {
    loadFriends();
    showStep(3);
});

document.getElementById('backToStep2').addEventListener('click', () => {
    showStep(2);
});

// ============ Step 3: بارگذاری دوستان ============

function loadFriends() {
    const friendsGrid = document.getElementById('friendsGrid');

    friendsGrid.innerHTML = fakeFriendsData.map(friend => `
        <div class="friend-card-modal" data-friend-id="${friend.id}">
            <img src="${friend.avatar}" alt="${friend.name}">
            <h4>${friend.name}</h4>
            <p>${friend.username}</p>
        </div>
    `).join('');

    document.querySelectorAll('.friend-card-modal').forEach(card => {
        card.addEventListener('click', function() {
            const friendId = parseInt(this.dataset.friendId);
            toggleFriendSelection(friendId, this);
        });
    });
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

// ============ Finish Trip ============

document.getElementById('finishTrip').addEventListener('click', () => {
    if (selectedLocations.length === 0) {
        Swal.fire({
            icon: 'warning',
            text: 'لطفاً حداقل یک مکان انتخاب کنید',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#a6b28b',
            background: '#f0f0f0',
            color: '#4b5563',
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn',
                cancelButton: 'my-cancel-btn'
            },
        });
        return;
    }

    const cityNames = {
        shiraz: 'شیراز',
        isfahan: 'اصفهان',
        tehran: 'تهران'
    };

    const citiesText = selectedCities.map(c => cityNames[c]).join('، ');

    Swal.fire({
        icon: 'success',
        title: 'سفر با موفقیت ایجاد شد!',
        html: `
            <p>تاریخ: <strong>${$('#startDate').val()} تا ${$('#endDate').val()}</strong></p>
            <p>شهرها: <strong>${citiesText}</strong></p>
            <p>تعداد مکان‌ها: <strong>${selectedLocations.length}</strong></p>
            <p>تعداد دوستان: <strong>${selectedFriends.length}</strong></p>
        `,
        confirmButtonText: 'عالی!',
        confirmButtonColor: '#a6b28b',
        background: '#f0f0f0',
        color: '#4b5563',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        },
    }).then(() => {
        modal.classList.remove('active');
        switchTab('current-trips');
    });
});

// ============ Logout button ============

document.querySelector('.logout-btn').addEventListener('click', () => {
    Swal.fire({
        text: 'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، خروج',
        cancelButtonText: 'انصراف',
        cancelButtonColor: '#f5c9b0',
        confirmButtonColor: '#a6b28b',
        background: '#f0f0f0',
        color: '#4b5563',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-btn',
            cancelButton: 'my-cancel-btn'
        },
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../index.html';
        }
    });
});