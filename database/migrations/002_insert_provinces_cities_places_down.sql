-- Delete place_photos
DELETE FROM place_photos 
WHERE place_id IN (
    SELECT place_id FROM places 
    WHERE place_name IN (
        'برج میلاد',
        'کاخ گلستان',
        'دربند',
        'باغ کتاب',
        'میدان نقش جهان',
        'مسجد شیخ لطف‌الله',
        'سی‌و‌سه‌پل',
        'تخت جمشید',
        'مسجد نصیرالملک',
        'باغ ارم',
        'حافظیه',
        'حرم امام رضا'
    )
);

-- Delete places
DELETE FROM places 
WHERE place_name IN (
    'برج میلاد',
    'کاخ گلستان',
    'دربند',
    'باغ کتاب',
    'میدان نقش جهان',
    'مسجد شیخ لطف‌الله',
    'سی‌و‌سه‌پل',
    'تخت جمشید',
    'مسجد نصیرالملک',
    'باغ ارم',
    'حافظیه',
    'حرم امام رضا'
);

-- Delete cities
DELETE FROM cities 
WHERE city_name IN (
    'تهران',
    'اصفهان',
    'شیراز',
    'یزد',
    'مشهد',
    'کاشان',
    'تبریز',
    'رامسر',
    'رشت',
    'اهواز',
    'کرمان',
    'قشم'
);

-- Delete provinces
DELETE FROM provinces 
WHERE province_name IN (
    'تهران',
    'اصفهان',
    'فارس',
    'یزد',
    'مازندران',
    'گیلان',
    'خوزستان',
    'آذربایجان شرقی',
    'خراسان رضوی',
    'کرمان',
    'هرمزگان'
);
