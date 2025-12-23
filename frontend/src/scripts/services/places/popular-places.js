import { apiClient } from "/src/scripts/services/api-client.js";

async function loadPopularPlaces() {
    const cards = document.querySelectorAll('#sec-3d1c .u-repeater-1 .u-list-item');

    if (cards.length === 0) {
        console.error("No static cards found in HTML.");
        return;
    }

    try {
        const places = await apiClient.get(`/places?sort_by=rating&sort_order=desc&limit=6`, {
            includeAuth: false,
        });

        if (!Array.isArray(places)) {
            console.error("Invalid response from API", places);
            return;
        }

        cards.forEach((card, index) => {
            const place = places[index];
            if (!place) {
                card.style.display = 'none';
                return;
            }

            const href = `/places/each-place.html?id=${place.place_id}`;
            card.setAttribute('href', href);
            card.onclick = () => window.location.href = href;

            const imageUrl = place.first_picture_url;
            card.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`;

            const titleElement = card.querySelector('h4');
            if (titleElement) {
                titleElement.textContent = place.place_name;
            }

            const descriptionElement = card.querySelector('p');
            if (descriptionElement) {
                const locationText = `شهر ${place.city_name || 'نامشخص'}، استان ${place.province_name || 'نامشخص'}`;
                descriptionElement.textContent = locationText;
            }
        });

    } catch (error) {
        console.error("Error updating popular places:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const checkJQuery = setInterval(() => {
        if (window.jQuery) {
            clearInterval(checkJQuery);
            loadPopularPlaces();
        }
    }, 100);
});