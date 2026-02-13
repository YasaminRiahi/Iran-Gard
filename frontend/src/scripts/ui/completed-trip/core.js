import { getTripDetails, getUserFullInfo, getTripPlans, getTripExpenses,checkIsOwner } from '/src/scripts/services/trips-service.js';
import { englishToPersianNumber, convertToPersianDate, getCategoryName } from './utils.js';
import { updateHeroSection , renderLocations, initMap , renderDailyPlans ,  renderExpenses , renderParticipants} from './completed-trip.js';

// Global State
export const state = {
    TRIP_ID: new URLSearchParams(window.location.search).get('id'),
    tripData: {},
    selectedLocations: [],
    dailyPlans: [],
    expenses: [],
    map: null
};

// Scroll Management
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
if (history.scrollRestoration) history.scrollRestoration = 'manual';

window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 25) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
});

// Tabs Management
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

    if (targetTab === 'locations' && state.map) {
        setTimeout(() => state.map.invalidateSize(), 100);
    }

    const plansMapContainer = document.getElementById('plansMap');
    if (plansMapContainer) {
        if (targetTab === 'plans') {
            plansMapContainer.style.display = 'block';
        } else {
            plansMapContainer.style.display = 'none';
        }
    }
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

window.addEventListener('load', () => {
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) updateIndicator(activeButton);
});

// Fetch Trip Data
export async function fetchAndAssignTripData() {
    try {
        const response = await getTripDetails(state.TRIP_ID);
        const data = response.data || response;

        // Fetch participants
        const participantIds = data.participants || [];
        const participantsDetails = await Promise.all(
            participantIds.map(async (id) => {
                try {
                    const userRes = await getUserFullInfo(id);
                    const userData = userRes.data || userRes;
                    return {
                        id: userData.user_id,
                        name: userData.full_name || userData.username,
                        username: userData.username,
                        avatar: userData.profile_url || '/src/assets/images/default-avatar.png',
                        isCreator: userData.user_id === data.owner_id
                    };
                } catch (err) {
                    console.error(`خطا در دریافت کاربر ${id}:`, err);
                    return {
                        id,
                        name: `کاربر ${id}`,
                        avatar: '/src/assets/images/default-avatar.png',
                        isCreator: id === data.owner_id
                    };
                }
            })
        );
        let start = new Date(data.start_date);
        let end = new Date(data.end_date);
        let diffTime = Math.abs(end - start);
        let days;
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        state.tripData = {
            id: data.trip_id,
            ownerId: data.owner_id,
            name: data.city_names?.length > 0
                ? `سفر به ${data.city_names.join(' و ')}`
                : 'جزئیات سفر',
            startDate: convertToPersianDate(data.start_date),
            endDate: convertToPersianDate(data.end_date),
            duration:days,
            cities: data.city_names || [],
            status: data.status,
            coverImage: data.cover_image,
            participants: participantsDetails
        };
        const ownerCheck = await checkIsOwner(state.TRIP_ID);
        state.isOwner = ownerCheck.isOwner

        // Load places
        if (data.places) {
            state.selectedLocations = data.places.map(place => ({
                id: place.id,
                name: place.name,
                category: getCategoryName(place.category),
                city: place.city,
                image: place.image || '',
                description: place.description,
                lat: place.lat,
                lng: place.lng,
                votes: place.votes || {likes: 0, dislikes: 0},
                userVote: place.userVote,
                visited: place.visited
            }));
        }

        // Load expenses
        try {
            const expensesResponse = await getTripExpenses(state.TRIP_ID);
            const expensesData = expensesResponse.data || expensesResponse;
            state.expenses = expensesData.map(exp => ({
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
        } catch (expError) {
            console.warn('⚠️ خطا در دریافت هزینه‌ها:', expError);
            state.expenses = [];
        }

        // Load plans
        try {
            const plansResponse = await getTripPlans(state.TRIP_ID);
            const plansData = plansResponse.data?.plans || plansResponse.plans || [];
            state.dailyPlans = plansData.map(plan => ({
                id: plan.id,
                day: plan.title,
                city: plan.city,
                locations: plan.locations.map(loc => ({
                    id: loc.id,
                    name: loc.name,
                    order: loc.order,
                    ...loc
                })),
                votes: plan.votes || {likes: 0, dislikes: 0},
                userVote: plan.userVote
            }));
        } catch (planError) {
            console.warn('⚠️ خطا در دریافت پلن‌ها:', planError);
            state.dailyPlans = [];
        }

        // Render all
        updateHeroSection();
        renderLocations();
        renderParticipants();
        renderExpenses();
        renderDailyPlans();
        initMap();

        console.log('✅ دیتا با موفقیت بارگذاری شد');

    } catch (error) {
        console.error('❌ خطا در بارگذاری:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا در دریافت اطلاعات',
            text: 'لطفاً دوباره تلاش کنید',
            confirmButtonColor: '#A6B28B'
        });
    }
}

// Mobile Menu
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    initMobileMenu();

    if (state.TRIP_ID) {
        fetchAndAssignTripData();
    } else {
        console.error('No Trip ID found');
    }
});