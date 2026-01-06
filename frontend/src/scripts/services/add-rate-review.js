import { apiClient } from "/src/scripts/services/api-client.js";

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');

    const stars = document.querySelectorAll('.star');
    const ratingLabels = document.querySelectorAll('.rating-label');
    const ratingValueDisplay = document.getElementById('ratingValueDisplay');
    const commentInput = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');
    const reviewForm = document.getElementById('reviewForm');
    const backBtn = document.getElementById('backBtn');

    let currentRating = 0;
    let isSubmitting = false;

    try {
        const userInfo = await apiClient.get('/users/me', { includeAuth: true });
        const userName = userInfo.username || 'کاربر';
        const submitInfoElement = document.querySelector('.submit-info span');
        if (submitInfoElement) {
            submitInfoElement.innerHTML = `شما با نام کاربری <strong>${userName}</strong> وارد شده‌اید`;
        }
    } catch (error) {
        console.log("Error fetching user info:", error);
    }

    updateCharCounter();
    validateForm();

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            setRating(rating);
        });

        star.addEventListener('mouseover', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
            highlightRatingLabel(rating);
        });
    });

    document.querySelector('.stars-wrapper').addEventListener('mouseleave', function () {
        highlightStars(currentRating);
        highlightRatingLabel(currentRating);
    });

    commentInput.addEventListener('input', function () {
        updateCharCounter();
        validateForm();
    });

    reviewForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.style.transform = 'scale(0.95)';

        try {
            await apiClient.post(`/places/${placeId}/reviews`, {
                rating: currentRating,
                review: commentInput.value.trim()
            }, { includeAuth: true });

            showSuccessMessage();
        } catch (error) {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.style.transform = 'scale(1)';
        }
    });

    backBtn.addEventListener('click', function () {
        window.history.back();
    });

    function setRating(rating) {
        currentRating = rating;
        ratingValueDisplay.textContent = rating;
        highlightStars(rating);
        highlightRatingLabel(rating);
        validateForm();

        const activeStar = document.querySelector(`.star[data-rating="${rating}"]`);
        if (activeStar) {
            activeStar.classList.add('active');
            setTimeout(() => {
                activeStar.classList.remove('active');
            }, 300);
        }
    }

    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function highlightRatingLabel(rating) {
        if (!ratingLabels.length) return;
        ratingLabels.forEach(label => {
            const labelRating = parseInt(label.getAttribute('data-rating'));
            if (labelRating === rating) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    function updateCharCounter() {
        const length = commentInput.value.length;
        charCount.textContent = length;
        if (length > 300) {
            commentInput.value = commentInput.value.substring(0, 300);
            charCount.textContent = 300;
        }
    }

    function validateForm() {
        const isValid = currentRating > 0;
        submitBtn.disabled = !isValid;
        return isValid;
    }

    function showSuccessMessage() {
        Swal.fire({
            text: "نظر شما با موفقیت ثبت شد. با تشکر از اشتراک‌گذاری تجربه‌تان!",
            icon: 'success',
            confirmButtonText: 'متوجه شدم',
            confirmButtonColor: '#f5c9b0',
            background: '#f0f0f0',
            color: '#4b5563',
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            },
            customClass: {
                popup: 'my-swal-popup',
                confirmButton: 'my-confirm-btn'
            }
        }).then((result) => {
            window.history.back();
        });
    }
});