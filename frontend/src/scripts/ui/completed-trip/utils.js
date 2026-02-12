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
