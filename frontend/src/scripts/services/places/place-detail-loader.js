import { apiClient } from "/src/scripts/services/api-client.js";
import { getReviewSummaryStream } from "/src/scripts/services/places/place-review-summary-service.js";

function getPlaceIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function animateCounter(element, target) {
    const targetNum = parseFloat(target);
    const duration = 3000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);

    let frame = 0;
    const countTo = targetNum;

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(countTo * progress * 10) / 10;

        element.textContent = currentCount.toFixed(1);

        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, frameDuration);
}

async function loadPlaceDetails() {
    const placeId = getPlaceIdFromUrl();
    if (!placeId) {
        console.error("Error: Place ID not found.");
        return;
    }

    try {
        const place = await apiClient.get(`/places/${placeId}`, {
            includeAuth: true,
        });
        
        document.title = `ایران‌گرد | ${place.title}`;

        const addReviewLink = document.querySelector('.add-rate-review');
        if (addReviewLink) {
            addReviewLink.href = `/add-rate-review.html?id=${placeId}`;
        }

        const viewAllReviewsBtn = document.querySelector('a[href="/view-all-reviews.html"]');
        if (viewAllReviewsBtn) {
            viewAllReviewsBtn.href = `/view-all-reviews.html?id=${placeId}`;
        }

        const titles = document.querySelectorAll('.u-section-1 .u-text-1, .u-section-2 .u-text-1');
        titles.forEach(el => el.textContent = place.title);

        const descElement = document.querySelector('.u-section-2 .u-text-2');
        if (descElement) {
            const city = place.city_name;
            const province = place.province_name;
            const locationInfo = `شهر ${city}، استان ${province}`;

            descElement.innerHTML = `
                ${place.description}
                <br><br>
                <strong style="display: block; color: #333; margin-top: 15px;">${locationInfo}</strong>
            `;
        }

        const bookmarkBtn = document.querySelector('.add-bookmark-button');
        if (bookmarkBtn) {
            let isBookmarked = place.is_bookmarked;
            bookmarkBtn.textContent = isBookmarked ? "حذف از بوک مارک" : "افزودن به بوک مارک";

            bookmarkBtn.onclick = async (e) => {
                e.preventDefault();
                try {
                    const options = { includeAuth: true };

                    if (isBookmarked) {
                        await apiClient.delete(`/places/wishlist/${placeId}`, options);
                    } else {
                        await apiClient.post(`/places/wishlist/${placeId}`, {}, options);
                    }

                    isBookmarked = !isBookmarked;
                    bookmarkBtn.textContent = isBookmarked ? "حذف از بوک مارک" : "افزودن به بوک مارک";

                    console.log(`Bookmark ${isBookmarked ? 'added' : 'removed'} successfully.`);
                } catch (error) {
                    console.error("Error updating bookmark:", error);
                }
            };
        }

        const ratingScore = document.querySelector('#carousel_0c90 h3.u-text-2[data-animation-name="counter"]');
        if (ratingScore) {
            ratingScore.style.whiteSpace = "nowrap";
            ratingScore.style.display = "inline-block";

            const targetValue = place.avg_rating || 0.0;

            ratingScore.textContent = "0.0";

            const sectionElement = document.querySelector('#carousel_0c90');

            if (sectionElement) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                if (!ratingScore.hasAttribute('data-animated')) {
                                    animateCounter(ratingScore, targetValue);
                                    ratingScore.setAttribute('data-animated', 'true');
                                }
                            }, 300);

                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.3,
                    rootMargin: '0px 0px -50px 0px'
                });

                observer.observe(sectionElement);
            } else {
                setTimeout(() => {
                    animateCounter(ratingScore, targetValue);
                }, 1000);
            }
        }

        const summaryElement = document.querySelector('.u-section-3 .u-text-5');
        if (summaryElement) {
            summaryElement.style.textAlign = "justify";
            summaryElement.style.textJustify = "distribute";
            summaryElement.style.letterSpacing = "normal";
            summaryElement.style.wordSpacing = "1px";
            summaryElement.style.whiteSpace = "pre-wrap";
            summaryElement.style.lineHeight = "1.8";
            summaryElement.textContent = "در حال تحلیل نظرات...";

            try {
                getReviewSummaryStream(placeId, {
                    onChunk: (chunk) => {
                        if (summaryElement.textContent === "در حال تحلیل نظرات...") {
                            summaryElement.textContent = "";
                        }
                        summaryElement.textContent += chunk;
                    },
                    onError: (error) => {
                        console.error("Stream error:", error);
                        summaryElement.textContent = "خطا در بارگذاری خلاصه نظرات.";
                        summaryElement.style.textAlign = "center";
                    }
                }).then((fullSummary) => {
                    if (!fullSummary || fullSummary === "" || fullSummary === 'هیچ نظری برای خلاصه‌سازی وجود ندارد.') {
                        summaryElement.textContent = "تا کنون نظری برای این مکان ثبت نشده است.";
                    }
                });
            } catch (err) {
                console.error("Failed to start summary stream:", err);
                summaryElement.textContent = "خلاصه نظرات در دسترس نیست.";
            }
        }

        const heroImage = document.querySelector('.u-section-1 .u-image-circle.u-image-1');
        if (heroImage && place.picture_urls && place.picture_urls.length > 0) {
            heroImage.style.backgroundImage = `url('${place.picture_urls[0]}')`;
        }

        const mapIframe = document.querySelector('.embed-responsive-item');
        if (mapIframe && place.location) {
            const { lat, lng } = place.location;
            mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        }

        const DEFAULT_IMAGE = '/src/assets/images/default-place.jpg';
        const galleryItems = document.querySelectorAll('.u-gallery-inner .u-carousel-item');
        const thumbnailItems = document.querySelectorAll('.u-carousel-thumbnails .u-carousel-thumbnail');

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('.u-back-image');
            const thumb = thumbnailItems[index];

            if (index === 0) {
                if (img) img.src = place.picture_urls?.[0] || DEFAULT_IMAGE;
                if (thumb) thumb.querySelector('img').src = place.picture_urls?.[0] || DEFAULT_IMAGE;
            } else if (place.picture_urls?.[index]) {
                if (img) img.src = place.picture_urls[index];
                if (thumb) thumb.querySelector('img').src = place.picture_urls[index];
            } else {
                item.remove();
                if (thumb) thumb.remove();
            }
        });

    } catch (error) {
        console.error("Error during loading:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadPlaceDetails);