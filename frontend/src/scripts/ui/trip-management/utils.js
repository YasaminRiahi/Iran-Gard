/**
 * Utility Functions
 */

export function englishToPersianNumber(input) {
    let str = String(input);
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i]);
    }
    return str;
}

function persianToEnglishNumber(input) {
    let str = String(input);
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return str;
}

export function convertToPersianDate(dateString) {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
}

export function getCategoryName(categoryId) {
    const categories = {
        "1": "طبیعت‌گردی",
        "2": "تاریخی",
        "3": "تجاری و تفریحی",
        "4": "مذهبی"
    };
    return categories[categoryId] || 'گردشگری';
}

export function generateStarRating(rating) {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star-filled"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star-half"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star-empty"></i>';
    }
    return stars;
}

export function persianOrdinalToNumber(persianDay) {
    const ordinalMap = {
        'اول': 1,
        'دوم': 2,
        'سوم': 3,
        'چهارم': 4,
        'پنجم': 5,
        'ششم': 6,
        'هفتم': 7,
        'هشتم': 8,
        'نهم': 9,
        'دهم': 10,
        'یازدهم': 11,
        'دوازدهم': 12,
        'سیزدهم': 13,
        'چهاردهم': 14,
        'پانزدهم': 15,
        'شانزدهم': 16,
        'هفدهم': 17,
        'هجدهم': 18,
        'نوزدهم': 19,
        'بیستم': 20
    };
    return ordinalMap[persianDay] || parseInt(persianToEnglishNumber(persianDay.slice(0, -2))) ;
}

export function getPersianOrdinalDay(n) {
    const ordinals = {
        1: 'اول',
        2: 'دوم',
        3: 'سوم',
        4: 'چهارم',
        5: 'پنجم',
        6: 'ششم',
        7: 'هفتم',
        8: 'هشتم',
        9: 'نهم',
        10: 'دهم',
        11: 'یازدهم',
        12: 'دوازدهم',
        13: 'سیزدهم',
        14: 'چهاردهم',
        15: 'پانزدهم',
        16: 'شانزدهم',
        17: 'هفدهم',
        18: 'هجدهم',
        19: 'نوزدهم',
        20: 'بیستم',
    };

    return ordinals[n] || `${englishToPersianNumber(n)}‌ام`;
}