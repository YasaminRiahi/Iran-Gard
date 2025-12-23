import { apiClient } from "/src/scripts/services/api-client.js";

function getCategoryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    return categoryId ? parseInt(categoryId) : null;
}

async function loadPlaces() {
    const categoryId = getCategoryIdFromUrl();
    if (!categoryId) {
        console.error("Category ID is missing");
        return;
    }

    const cards = document.querySelectorAll('#sec-7e29 .u-repeater-1 .u-list-item');

    if (cards.length === 0) {
        console.error("No cards found in the HTML.");
        return;
    }

    try {
        const places = await apiClient.get(`/places?category_id=${categoryId}&limit=${cards.length}&sort_by=rating&sort_order=desc`, {
            includeAuth: false,
        });

        if (!Array.isArray(places)) {
            console.error("Invalid response: Expected an array.", places);
            return;
        }

        cards.forEach((card, index) => {
            const place = places[index];

            if (!place) {
                card.style.display = 'none';
                return;
            }

            const href = `/places/each-place.html?id=${place.place_id}`;
            card.style.cursor = 'pointer';
            card.onclick = () => { window.location.href = href; };

            const imageUrl = place.first_picture_url;
            card.style.backgroundImage = `url('${imageUrl}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';

            const titleElement = card.querySelector('h5');
            if (titleElement) {
                titleElement.textContent = place.place_name;
            }

            const descriptionElement = card.querySelector('p');
            if (descriptionElement) {
                const city = place.city_name || 'نامشخص';
                const province = place.province_name || 'نامشخص';
                const locationText = `شهر ${city}، استان ${province}`;
                descriptionElement.textContent = locationText;
            }
        });

    } catch (error) {
        console.error("Error loading places:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const checkJQuery = setInterval(() => {
        if (window.jQuery) {
            clearInterval(checkJQuery);
            loadPlaces();
        }
    }, 100);
});