import { apiClient } from "/src/scripts/services/api-client.js";

document.addEventListener('DOMContentLoaded', () => {
    loadMyBookmarks();
});

async function loadMyBookmarks() {
    const repeater = document.querySelector('.u-repeater-1');

    try {
        const wishlist = await apiClient.get('/places/wishlist/me', { includeAuth: true });

        if (!wishlist || wishlist.length === 0) {
            showEmptyMessage(repeater);
            return;
        }

        const placePromises = wishlist.map(item =>
            apiClient.get(`/places/${item.place_id}`, { includeAuth: true })
        );

        const placesDetails = await Promise.all(placePromises);

        repeater.innerHTML = '';

        placesDetails.forEach((place, index) => {
            const cardHTML = createBookmarkCard(place, index);
            repeater.insertAdjacentHTML('beforeend', cardHTML);
        });

        fixContainerHeights();

        attachDeleteEvents();

    } catch (error) {
        console.error("Error loading bookmarks:", error);
    }
}

function showEmptyMessage(container) {
    container.innerHTML = `
        <div class="animate__animated animate__fadeIn" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; width: 100%;">
            <img src="src/assets/images/102279-dddd0dec.png" style="width: 80px; opacity: 0.2; margin-bottom: 20px;">
            <h3 style="font-family: Anjoman-Bold; color: #1f2937; margin-bottom: 10px; font-size: 1.8rem;">مکانی بوک‌مارک نشده است</h3>
            <p style="color: #6b7280; font-family: Anjoman-Regular; font-size: 1.1rem;">با بوک‌مارک کردن مکان‌های موردعلاقه‌تان، یک لیست شخصی از مقصدهای بعدی خود بسازید</p>
        </div>
    `;
}

function fixContainerHeights() {
    setTimeout(() => {
        const selectors = ['.u-list-1', '.u-section-2', '.u-sheet-1'];
        selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.cssText = 'min-height: auto !important; height: auto !important;';
        });
    }, 150);
}

function createBookmarkCard(place, index) {
    const imageUrl = place.picture_urls && place.picture_urls.length > 0
        ? place.picture_urls[0]
        : 'src/assets/images/default-place.jpg';

    return `
        <div class="u-align-right u-border-4 u-border-custom-color-4 u-border-no-left u-border-no-top u-list-item u-radius u-repeater-item u-shape-round u-white"
             data-animation-name="customAnimationIn" data-animation-duration="1500" data-animation-delay="200"
             style="height: auto !important; min-height: 440px;">
            <div class="u-container-layout u-similar-container u-container-layout-1">
                <a href="places/each-place.html?id=${place.id}">
                    <img src="${imageUrl}" alt="${place.title}"
                         class="u-expanded-width u-image u-image-round u-radius u-image-1" 
                         style="height: 300px; object-fit: cover;">
                </a>
                <span class="u-file-icon u-icon u-icon-rectangle u-text-custom-color-4 u-icon-1 delete-bookmark" 
                      data-id="${place.id}" 
                      style="cursor: pointer; transition: transform 0.2s;" 
                      onmouseover="this.style.transform='scale(1.1)'" 
                      onmouseout="this.style.transform='scale(1)'">
                    <img src="src/assets/images/102279-dddd0dec.png" alt="Remove">
                </span>
                <h4 class="u-align-center u-custom-font u-text u-text-color-var u-text-2">
                    ${place.title}
                    <br>
                    <small style="font-size: 0.85rem; color: #777; font-family: Anjoman-Regular;">
                        استان ${place.province_name}، شهر ${place.city_name}
                    </small>
                </h4>
            </div>
        </div>
    `;
}

function attachDeleteEvents() {
    const deleteIcons = document.querySelectorAll('.delete-bookmark');
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', async (e) => {
            const placeId = e.currentTarget.dataset.id;
            const card = e.target.closest('.u-list-item');

            Swal.fire({
                text: "آیا از حذف این مکان از لیست بوک‌مارک‌ها مطمئن هستید؟",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'حذف از بوک‌مارک‌ها',
                cancelButtonText: 'انصراف',
                reverseButtons: true,
                confirmButtonColor: '#f5c9b0',
                cancelButtonColor: '#a6b28b',
                background: '#f8f8f8',
                color: '#4b5563',
                showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
                hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
                customClass: {
                    popup: 'my-swal-popup',
                    confirmButton: 'my-confirm-btn',
                    cancelButton: 'my-cancel-btn'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await apiClient.delete(`/places/wishlist/${placeId}`, { includeAuth: true });

                        card.classList.add('animate__animated', 'animate__fadeOutScale');
                        setTimeout(() => {
                            card.remove();
                            if (document.querySelectorAll('.u-list-item').length === 0) {
                                showEmptyMessage(document.querySelector('.u-repeater-1'));
                            }
                        }, 500);

                    } catch (error) {
                        Swal.fire({ text: 'خطا در حذف. مجدداً تلاش کنید.', icon: 'error', confirmButtonColor: '#f5c9b0' });
                    }
                }
            });
        });
    });
}