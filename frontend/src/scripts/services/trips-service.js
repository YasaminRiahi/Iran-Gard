import { apiClient , API_BASE} from "/src/scripts/services/api-client.js";

const TRIP_ENDPOINT = "/trips";
const CITY_ENDPOINT = "/city";
const USER_ENDPOINT = "/users";
// ============ Trip Management ============

/**
 * دریافت لیست سفرهای تمام شده
 * @returns {Promise} لیست سفرهای finished
 */
export function getFinishedTrips() {
    return apiClient.get(`${TRIP_ENDPOINT}/finished`);
}

/**
 * دریافت لیست سفرهای جاری
 * @returns {Promise} لیست سفرهای ongoing
 */
export function getOngoingTrips() {
    return apiClient.get(`${TRIP_ENDPOINT}/ongoing`);
}

/**
 * ایجاد سفر جدید
 * @param {Object} tripData - اطلاعات سفر
 * @param {string} tripData.start_date - تاریخ شروع (YYYY-MM-DD)
 * @param {string} tripData.end_date - تاریخ پایان (YYYY-MM-DD)
 * @param {Array<string>} tripData.city_names - نام شهرها
 * @param {Array<number>} tripData.place_ids - آی‌دی مکان‌ها
 * @param {string} [tripData.cover_image] - عکس کاور (اختیاری)
 * @returns {Promise} اطلاعات سفر ایجاد شده
 */
export function createTrip(tripData) {
    return apiClient.post(`${TRIP_ENDPOINT}/create_trip`, tripData);
}

/**
 * دعوت دوست به سفر
 * @param {number} tripId - آی‌دی سفر
 * @param {number} friendId - آی‌دی دوست
 * @returns {Promise} پیام موفقیت
 */
export function inviteFriend(tripId, friendId) {
    return apiClient.post(`${TRIP_ENDPOINT}/invite/${tripId}/${friendId}`);
}

/**
 * دریافت دعوت‌های سفر (درخواست‌های دریافتی)
 * @returns {Promise} لیست دعوت‌ها
 */
export function getMyInvitations() {
    return apiClient.get(`${TRIP_ENDPOINT}/invitations`);
}

/**
 * دریافت لیست دوستان قابل دعوت
 * @returns {Promise} لیست دوستان
 */
export function getAvailableFriends() {
    return apiClient.get(`${TRIP_ENDPOINT}/available-friends`);
}

// ============ City & Places Management ============

/**
 * دریافت لیست شهرها با تعداد مکان‌های دیدنی
 * @returns {Promise} لیست شهرها با تعداد مکان‌ها
 */
export function getCitiesWithCounts() {
    return apiClient.get(`${CITY_ENDPOINT}/city/get-cities`);
}

/**
 * دریافت مکان‌های دیدنی یک شهر
 * @param {string} cityNames - نام شهر
 * @returns {Promise} لیست مکان‌های شهر
 */
export function getPreviewPlaces(cityNames) {
    const params = new URLSearchParams();
    cityNames.forEach(city => params.append('city_names', city));

    return apiClient.post(`${TRIP_ENDPOINT}/preview-places?${params.toString()}`);
}

export const getTripDetails = async (tripId) => {
    return await apiClient.get(`${TRIP_ENDPOINT}/${tripId}/details`);
};
export const getUserFullInfo = async (userId) => {
    return await apiClient.get(`${USER_ENDPOINT}/${userId}/full-info`);
};

export const respondToInvitation = async (invitationId, isAccepted) => {
    const endpoint = `${TRIP_ENDPOINT}/invitations/${invitationId}/respond?accept=${isAccepted}`;
    return await apiClient.patch(endpoint,{})
};
// ============ Helper Functions ============

/**
 * تبدیل تاریخ میلادی به فرمت API (YYYY-MM-DD)
 * @param {Date} date - تاریخ
 * @returns {string} تاریخ به فرمت YYYY-MM-DD
 */
export function formatDateForAPI(date) {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * تبدیل تاریخ شمسی به میلادی
 * @param {string} persianDate - تاریخ شمسی (YYYY/MM/DD)
 * @returns {string} تاریخ میلادی (YYYY-MM-DD)
 */
export function persianToGregorian(persianDate) {
    if (!persianDate || typeof persianDate !== 'string') return null;

    try {
        if (typeof persianDate !== 'undefined') {
            const pDate = new persianDate(persianDate);
            const gDate = pDate.toDate();
            return formatDateForAPI(gDate);
        }
        return persianDate;
    } catch (error) {
        console.error('Date conversion error:', error);
        return null;
    }
}

/**
 * ساخت آبجکت سفر برای ارسال به API
 * @param {Object} params
 * @param {Date} params.startDate - تاریخ شروع
 * @param {Date} params.endDate - تاریخ پایان
 * @param {Array<string>} params.cityNames - نام شهرها
 * @param {Array<number>} params.placeIds - آی‌دی مکان‌ها
 * @param {string} [params.coverImage] - عکس کاور
 * @returns {Object} آبجکت آماده برای API
 */
export function buildTripPayload({ startDate, endDate, cityNames, placeIds, coverImage = null }) {
    return {
        start_date: formatDateForAPI(startDate),
        end_date: formatDateForAPI(endDate),
        city_names: cityNames,
        place_ids: placeIds,
        ...(coverImage && { cover_image: coverImage })
    };
}


// ============ TRIP OWNERSHIP ============
export function checkIsOwner(tripId) {
    return apiClient.get(`${TRIP_ENDPOINT}/${tripId}/is-owner`);
}

// ============ TRIP LOCATIONS (TAB 1) ============


export function autoGeneratePlaces(tripId, data) {
    return apiClient.post(`${TRIP_ENDPOINT}/${tripId}/auto-generate-places`, data);
}

export function addLocationToTrip(tripId, locationId) {
    return apiClient.post(`${TRIP_ENDPOINT}/${tripId}/locations`, { locationId : locationId });
}

export function removeLocationFromTrip(tripId, locationId) {
    return apiClient.delete(`${TRIP_ENDPOINT}/${tripId}/locations/${locationId}`);
}

export function voteOnLocation(tripId, locationId, voteType) {
    return apiClient.post(`${TRIP_ENDPOINT}/${tripId}/locations/${locationId}/vote`, { voteType });
}

export function updateVisitedStatus(tripId, locationId, visited) {
    return apiClient.patch(`${TRIP_ENDPOINT}/${tripId}/locations/${locationId}/visited`, { visited });
}

export function getURL () {
    return API_BASE;
}

export function getTripPlans(tripId) {
    return apiClient.get(`${TRIP_ENDPOINT}/${tripId}/plans`);
}

// در انتهای فایل trips-service.js

// ============ EXPENSES MANAGEMENT ============

/**
 * دریافت لیست هزینه‌های یک سفر
 */
export function getTripExpenses(tripId) {
    return apiClient.get(`${TRIP_ENDPOINT}/${tripId}/expenses/get-expenses`);
}

export function createExpense(tripId, expenseData) {
    return apiClient.post(`${TRIP_ENDPOINT}/${tripId}/expenses/`, expenseData);
}

export function updateExpense(tripId, expenseId, expenseData) {
    return apiClient.put(`${TRIP_ENDPOINT}/${tripId}/expenses/${expenseId}`, expenseData);
}


export function deleteExpense(tripId, expenseId) {
    return apiClient.delete(`${TRIP_ENDPOINT}/${tripId}/expenses/${expenseId}`);
}

export function getSettlement(tripId) {
    return apiClient.get(`${TRIP_ENDPOINT}/${tripId}/expenses/settlement`);
}


export function getPlacesForTrip(tripId, cityNames = null) {
    const params = new URLSearchParams();
    if (cityNames && cityNames.length > 0) {
        cityNames.forEach(city => params.append('city_names', city));
    }

    const queryString = params.toString();
    const endpoint = queryString
        ? `${TRIP_ENDPOINT}/${tripId}/places?${queryString}`
        : `${TRIP_ENDPOINT}/${tripId}/places`;

    return apiClient.post(endpoint, {});
}