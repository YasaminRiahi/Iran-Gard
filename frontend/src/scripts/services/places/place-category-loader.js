import { apiClient } from "../api-client.js";

function getCategoryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');

    return categoryId ? parseInt(categoryId) : null;
}

function getAnimationStartStyles(animationName) {
    let styles = {
        'opacity': '0',
        'transform': 'none',
    };
    if (animationName.includes('fade_in') || animationName.includes('custom_in')) {
        styles['opacity'] = '0';
    }
    return styles;
}

async function loadPlaces() {
    const categoryId = getCategoryIdFromUrl();
    const limitCount = 24;

    if (!categoryId) {
        console.error("Category ID is missing");
        return;
    }

    const container = document.getElementById("places-container");
    if (!container) {
        console.error("The 'places-container' element was not found in the HTML.");
        return;
    }

    container.innerHTML = "";

    try {
        const initialPlaces = await apiClient.get(`/places?category_id=${categoryId}&limit=${limitCount}`, {
            includeAuth: false,
        });

        if (!Array.isArray(initialPlaces)) {
            console.error("Invalid response: Expected an array of places.", initialPlaces);
            return;
        }

        const detailedPlacePromises = initialPlaces.map(place =>
            apiClient.get(`/places/${place.place_id}`, { includeAuth: false })
        );

        const detailedPlaces = await Promise.all(detailedPlacePromises);

        const createAnimationObserver = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && window.jQuery) {
                        const $ = window.jQuery;
                        const $item = $(entry.target);

                        if ($item.hasClass('u-animate-in')) {
                            observer.unobserve(entry.target);
                            return;
                        }

                        const animationName = $item.attr('data-animation-name');

                        setTimeout(() => {
                            $item.removeClass('u-hidden-animation');
                            $item.addClass('animated u-animate-in');
                            $item.addClass(`${animationName}-played`);
                            $item.addClass(animationName);

                            console.log(`Animation triggered on scroll: ${animationName}`);
                        }, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '50px'
            });

            return observer;
        };

        const animationObserver = createAnimationObserver();

        detailedPlaces.forEach((place, index) => {
            const number = index + 1;
            const href = `/places/each-place.html?id=${place.id}`;

            const initialPlaceData = initialPlaces.find(p => p.place_id === place.id);
            const city_name = initialPlaceData ? initialPlaceData.city_name : 'نامشخص';
            const province_name = initialPlaceData ? initialPlaceData.province_name : 'نامشخص';
            const locationText = `شهر ${city_name} استان ${province_name}`;

            const imageUrl = place.picture_urls && place.picture_urls.length > 0
                ? place.picture_urls[0]
                : 'https://i.pinimg.com/736x/29/bd/ac/29bdac9c4d725f009e83ea2b09254e33.jpg';

            const durationMs = 1500;
            const delayMs = 200 * index;
            const startStyles = getAnimationStartStyles('customAnimationIn');

            const itemHtml = `
				<div
					class="u-align-center u-container-align-center u-container-style u-image u-image-default u-list-item u-repeater-item u-shape-round u-image-${number} u-hidden-animation" 
					data-animation-name="customAnimationIn"
					data-animation-duration="${durationMs}"
					data-animation-delay="${delayMs}" 
					data-image-width="1280"
					data-image-height="853"
					data-href="${href}"
					dir="rtl"
					style="
                        cursor: pointer; 
                        background-image: url('${imageUrl}'); 
                        background-size: cover; 
                        background-position: center; 
                        opacity: ${startStyles.opacity};
                        transform: ${startStyles.transform};
                        transition: opacity ${durationMs}ms ease-in-out, transform ${durationMs}ms ease-in-out !important;
                        transition-delay: ${delayMs}ms !important;
                    " 
				>
					<div class="u-container-layout u-similar-container u-valign-bottom u-container-layout-${(number * 2) - 1}">
						<div class="u-container-style u-expanded-width u-gradient u-group u-opacity u-opacity-80 u-group-${number}">
							<div class="u-container-layout u-valign-middle-lg u-valign-middle-sm u-valign-middle-xs u-container-layout-${(number * 2)}">
								<h5 class="u-align-center u-custom-font u-hover-feature u-text u-text-body-alt-color u-text-${(number * 2) - 1}">${place.title}</h5>
								<p class="u-align-center u-custom-font u-hover-feature u-text u-text-body-alt-color u-text-${(number * 2)}">${locationText}</p>
							</div>
						</div>
					</div>
				</div>
			`;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = itemHtml.trim();
            const item = tempDiv.firstChild;

            item.addEventListener("click", () => {
                window.location.href = href;
            });

            container.appendChild(item);

            animationObserver.observe(item);
        });

    } catch (error) {
        console.error("Error loading places or details:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (!window.jQuery) {
        console.warn("jQuery not loaded yet, waiting...");

        const checkJQuery = setInterval(() => {
            if (window.jQuery) {
                clearInterval(checkJQuery);
                console.log("jQuery loaded, starting loadPlaces...");
                loadPlaces();
            }
        }, 100);
    } else {
        loadPlaces();
    }
});