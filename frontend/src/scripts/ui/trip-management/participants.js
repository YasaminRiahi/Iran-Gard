import { state } from './core.js';
import {
    getAvailableFriendsToInvite as getAvailableFriends,
    inviteFriendToTrip,
    getURL
} from '/src/scripts/services/trips-service.js';

let cachedAvailableFriends = [];

export function renderParticipants() {
    const participantsGrid = document.getElementById('participantsGrid');

    participantsGrid.innerHTML = `
        <div class="invite-card">
            <div class="invite-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <h3>دعوت دوستان</h3>
            <p>دوستان خود را به این سفر دعوت کنید</p>
            <div class="invite-button">
                <button class="btn-invite-manual" onclick="openInviteModal()">
                    <i class="fas fa-user-plus"></i> دعوت 
                </button>
            </div>
        </div>
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

async function openInviteModal() {
    Swal.fire({
        title: 'دعوت دوستان به سفر',
        html: `
            <div style="direction: rtl; text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">
                        <i class="fas fa-search"></i> جستجو در لیست دوستان
                    </label>
                    <input type="text" id="search-friend-input" 
                           placeholder="نام یا نام کاربری دوست خود را وارد کنید..."
                           style="width: 100%; padding: 0.8rem; border: 2px solid #e5e7eb; border-radius: 0.8rem; font-family: 'Anjoman'; outline: none;">
                </div>
                <div id="friends-results" style="margin-top: 1rem; max-height: 350px; overflow-y: auto; padding: 5px;">
                    <div class="loading-friends text-center py-10">
                        <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: #A6B28B;"></i>
                        <p style="margin-top: 10px; color: #666;">در حال دریافت لیست دوستان...</p>
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        background: '#f9fafb',
        width: '550px',
        didOpen: async () => {
            const resultsDiv = document.getElementById('friends-results');
            const searchInput = document.getElementById('search-friend-input');

            try {
                const response = await getAvailableFriends(state.TRIP_ID);
                cachedAvailableFriends = response.data || response;
                displayFriends(cachedAvailableFriends);

                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();
                    const filtered = cachedAvailableFriends.filter(f =>
                        f.username.toLowerCase().includes(query) ||
                        (f.full_name && f.full_name.toLowerCase().includes(query))
                    );
                    displayFriends(filtered);
                });

            } catch (error) {
                resultsDiv.innerHTML = `<p class="text-center text-red-500 py-10">خطا در دریافت اطلاعات</p>`;
            }
        },
        customClass: {
            popup: 'my-swal-popup',
        }
    });
}

function displayFriends(friends) {
    const resultsDiv = document.getElementById('friends-results');

    if (!friends || friends.length === 0) {
        resultsDiv.innerHTML = `
            <div style="text-align: center; color: #9ca3af; padding: 2rem;">
                <i class="fas fa-user-slash" style="font-size: 2.5rem;color:#8f9b6a;  margin-bottom: 0.8rem; display: block;"></i>
                کاربری برای دعوت یافت نشد.
            </div>`;
        return;
    }

    resultsDiv.innerHTML = friends.map(friend => `
        <div class="friend-invite-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #eee; border-radius: 12px; margin-bottom: 10px; background: white; transition: 0.3s;">
            <img src="${getURL() + friend.profile_url || '/src/assets/images/default-avatar.png'}" 
                 style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #A6B28B;">
            <div style="flex: 1;">
                <div style="font-weight: 700; color: #1f2937;">${friend.full_name || friend.username}</div>
                <div style="font-size: 0.8rem; color: #6b7280;">${friend.username}</div>
            </div>
            <button onclick="window.inviteUserAction(${friend.user_id}, '${friend.full_name || friend.username}')" 
                    class="btn-invite-user" style="background: #A6B28B; color: white; border: none; padding: 6px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 5px;">
                <i class="fas fa-paper-plane"></i> دعوت
            </button>
        </div>
    `).join('');
}

async function inviteUserAction(friendId, name) {
    const result = await Swal.fire({
        title: 'ارسال دعوت‌نامه',
        text: `آیا می‌خواهید ${name} را به این سفر دعوت کنید؟`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، ارسال کن',
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

    if (result.isConfirmed) {
        try {
            Swal.showLoading();
            const response = await inviteFriendToTrip(state.TRIP_ID, friendId);

            if (response.data || response) {
                Swal.fire({
                    icon: 'success',
                    title: 'ارسال شد!',
                    text: `دعوت‌نامه با موفقیت برای ${name} ارسال شد.`,
                    confirmButtonColor: '#A6B28B',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: error.response?.data?.detail || 'ارسال دعوت‌نامه با خطا مواجه شد.',
                confirmButtonColor: '#f5c9b0',
            });
        }
    }
}

// Export to window
window.openInviteModal = openInviteModal;
window.inviteUserAction = inviteUserAction;