--- PLACE REVIEWS ---
INSERT INTO place_reviews (user_id, place_id, rating, review, created_at) VALUES
-- Reviews for برج میلاد (Tower)
(1, (SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 5, 'برجی فوق‌العاده زیبا! نمای شهری شگفت‌انگیز و رستوران‌های عالی. حتما بازدید کنید!', NOW()),
(2, (SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 4, 'خیلی خوب بود اما قیمت بلیت کمی گران است.', NOW()),
(3, (SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 5, 'بهترین جای دیدن تهران از بالا. خیلی توصیه می‌کنم!', NOW()),

-- Reviews for کاخ گلستان (Palace)
(1, (SELECT place_id FROM places WHERE place_name = 'کاخ گلستان'), 5, 'معمارری ایرانی کلاسیک بسیار زیبا. آینه‌کاری‌ها خیره‌کننده هستند.', NOW()),
(3, (SELECT place_id FROM places WHERE place_name = 'کاخ گلستان'), 4, 'تاریخی و فرهنگی. گاید‌های سایت واقعا مفید بودند.', NOW()),

-- Reviews for دربند (Mountain)
(2, (SELECT place_id FROM places WHERE place_name = 'دربند'), 5, 'مسیر کوهنوردی فوق‌العاده! طبیعت بکر و هوای تازه.', NOW()),
(1, (SELECT place_id FROM places WHERE place_name = 'دربند'), 4, 'خیلی خوب برای پیاده‌روی و نزدیکی به تهران.', NOW()),

-- Reviews for میدان نقش جهان (Isfahan Square)
(3, (SELECT place_id FROM places WHERE place_name = 'میدان نقش جهان'), 5, 'معروف‌ترین میدان ایران! بناهای تاریخی بسیار فاخر.', NOW()),
(1, (SELECT place_id FROM places WHERE place_name = 'میدان نقش جهان'), 5, 'حتما باید ببینید. هنر و معماری در بهترین شکل.', NOW()),

-- Reviews for مسجد شیخ لطف‌الله (Isfahan Mosque)
(1, (SELECT place_id FROM places WHERE place_name = 'مسجد شیخ لطف‌الله'), 5, 'گنبد مسجد بی‌نظیر و کاشی‌کاری هنرمندانه.', NOW()),
(2, (SELECT place_id FROM places WHERE place_name = 'مسجد شیخ لطف‌الله'), 5, 'شاهکار معماری صفوی. نور مسجد بسیار روشن و زیبا است.', NOW()),

-- Reviews for باغ ارم (Eram Garden)
(3, (SELECT place_id FROM places WHERE place_name = 'باغ ارم'), 4, 'باغ فارسی سنتی بسیار آرام و زیبا. ایده‌آل برای فرار از شهر.', NOW()),
(1, (SELECT place_id FROM places WHERE place_name = 'باغ ارم'), 4, 'بناهای تاریخی و فضای سبز. خیلی خوب برای خانواده.', NOW()),

-- Reviews for تخت جمشید (Persepolis)
(2, (SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), 5, 'میراث جهانی واقعی! باستان‌شناسی و تاریخ در بهترین شکل.', NOW()),
(3, (SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), 5, 'ویرانه‌های باشکوه تمدن قدیمی. دیدن آن یک تجربه متفاوت است.', NOW()),

-- Reviews for حرم امام رضا (Imam Reza Shrine)
(1, (SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), 5, 'مقدس‌ترین زیارتگاه ایران. معماری و روحانیت یکجا.', NOW()),
(3, (SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), 5, 'تجربه روحانی فوق‌العاده. طراحی ایرانی و اسلامی بسیار قشنگ.', NOW());

--- WISHLIST ---
INSERT INTO wishlist (user_id, place_id, added_date) VALUES
-- User 1 wishlist
(1, (SELECT place_id FROM places WHERE place_name = 'سی‌و‌سه‌پل'), CURRENT_DATE),
(1, (SELECT place_id FROM places WHERE place_name = 'مسجد نصیرالملک'), CURRENT_DATE),
(1, (SELECT place_id FROM places WHERE place_name = 'حافظیه'), CURRENT_DATE),

-- User 2 wishlist
(2, (SELECT place_id FROM places WHERE place_name = 'باغ کتاب'), CURRENT_DATE),
(2, (SELECT place_id FROM places WHERE place_name = 'باغ ارم'), CURRENT_DATE),

-- User 3 wishlist
(3, (SELECT place_id FROM places WHERE place_name = 'دربند'), CURRENT_DATE),
(3, (SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), CURRENT_DATE),
(3, (SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), CURRENT_DATE);

--- LIKED REVIEWS ---
INSERT INTO liked_reviews (review_id, user_id) VALUES
-- Users liking reviews
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 1),
(3, 2),
(5, 1),
(5, 3),
(6, 2),
(7, 1),
(8, 2),
(8, 3),
(10, 1),
(11, 2),
(11, 3),
(13, 1),
(13, 3),
(14, 2);
