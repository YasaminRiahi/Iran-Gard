--- PROVINCES ---
INSERT INTO provinces (province_name) VALUES
('سمنان'),
('همدان'),
('لرستان'),
('اردبیل'),
('گلستان'),
('سیستان و بلوچستان');

--- CITIES ---
INSERT INTO cities (city_name) VALUES
('شاهرود'),
('آران و بیدگل'),
('کبودرآهنگ'),
('فومن'),
('بندر انزلی'),
('خرم‌آباد'),
('کلیبر'),
('سوادکوه'),
('ساری'),
('مشگین‌شهر'),
('آمل'),
('سپیدان'),
('چالوس'),
('دورود'),
('شهداد'),
('قوچان'),
('مینودشت'),
('آستارا'),
('تفتان');

--- PLACES ---
INSERT INTO places (place_name, city_name, province_name, place_location, description, category_id) VALUES
('جنگل ابر', 'شاهرود', 'سمنان', 
 '{"lat": 36.7869, "lng": 54.8091, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D2"}'::jsonb, 
 'جنگلی منحصر به فرد که اغلب توسط اقیانوسی از ابرها پوشیده شده است.', 1),
('کویر مرنجاب', 'آران و بیدگل', 'اصفهان', 
 '{"lat": 34.4086, "lng": 51.8152, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D3"}'::jsonb, 
 'تپه‌های شنی زیبا، دریاچه نمک و کاروانسرای تاریخی.', 1),
('غار علی‌صدر', 'کبودرآهنگ', 'همدان', 
 '{"lat": 35.3582, "lng": 48.2435, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D4"}'::jsonb, 
 'یکی از بزرگترین غارهای آبی جهان که با قایق قابل بازدید است.', 1),
('ماسوله', 'فومن', 'گیلان', 
 '{"lat": 37.0463, "lng": 48.9839, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D5"}'::jsonb, 
 'روستای پلکانی و تاریخی زیبا با معماری منحصر به فرد در دل کوهستان و طبیعت سرسبز.', 1),
('تالاب انزلی', 'بندر انزلی', 'گیلان', 
 '{"lat": 37.4984, "lng": 49.4443, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D6"}'::jsonb, 
 'زیستگاه پرندگان مهاجر و نیلوفرهای آبی (لاله مردابی).', 1),
('آبشار بیشه', 'خرم‌آباد', 'لرستان', 
 '{"lat": 33.3917, "lng": 48.7758, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D7"}'::jsonb, 
 'آبشاری بلند و باشکوه در نزدیکی ایستگاه راه‌آهن بیشه.', 1),
('دره ستارگان', 'قشم', 'هرمزگان', 
 '{"lat": 26.8521, "lng": 56.1952, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D8"}'::jsonb, 
 'دره‌ای با اشکال هندسی عجیب و زیبا که حاصل فرسایش خاک است.', 1),
('جنگل‌های ارسباران', 'کلیبر', 'آذربایجان شرقی', 
 '{"lat": 38.8687, "lng": 46.8576, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D9"}'::jsonb, 
 'منطقه حفاظت‌شده و جنگلی با تنوع زیستی بالا، معروف به قره داغ.', 1),
('دریاچه شورمست', 'سوادکوه', 'مازندران', 
 '{"lat": 36.0094, "lng": 53.0783, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D0"}'::jsonb, 
 'تنها دریاچه طبیعی سوادکوه، احاطه شده با درختان سر به فلک کشیده.', 1),
('چشمه‌های باداب سورت', 'ساری', 'مازندران', 
 '{"lat": 36.5772, "lng": 53.9482, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D1"}'::jsonb, 
 'پلکان‌های طبیعی رنگی و زیبا که بر اثر رسوب مواد معدنی چشمه‌ها ایجاد شده است.', 1),
('کوه سبلان', 'مشگین‌شهر', 'اردبیل', 
 '{"lat": 40.8523, "lng": 47.8398, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D2"}'::jsonb, 
 'کوهی آتشفشانی و فعال با دریاچه‌ای زیبا در قله.', 1),
('تنگه چاهکوه', 'قشم', 'هرمزگان', 
 '{"lat": 26.8924, "lng": 56.0967, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D3"}'::jsonb, 
 'تنگه‌ای شگفت‌انگیز با دیواره‌های عمودی و سوراخ‌های عجیب بر اثر فرسایش آب.', 1),
('کوه دماوند', 'آمل', 'مازندران', 
 '{"lat": 35.9599, "lng": 52.1091, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D4"}'::jsonb, 
 'بلندترین قله ایران و نماد ملی.', 1),
('آبشار مارگون', 'سپیدان', 'فارس', 
 '{"lat": 30.6874, "lng": 51.9863, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D5"}'::jsonb, 
 'بزرگترین آبشار چشمه‌ای جهان.', 1),
('جزیره هنگام', 'قشم', 'هرمزگان', 
 '{"lat": 26.6575, "lng": 55.9080, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D6"}'::jsonb, 
 'معروف به ساحل نقره‌ای و محل زندگی دلفین‌ها.', 1),
('کلاردشت', 'چالوس', 'مازندران', 
 '{"lat": 36.4715, "lng": 51.0506, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D7"}'::jsonb, 
 'منطقه‌ای کوهستانی و خوش آب و هوا با جنگل‌ها و مناظر خیره‌کننده.', 1),
('دریاچه گهر', 'دورود', 'لرستان', 
 '{"lat": 33.3150, "lng": 49.3000, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D8"}'::jsonb, 
 'یکی از زیباترین دریاچه‌های کوهستانی ایران (نگین اشترانکوه).', 1),
('دشت لوت', 'شهداد', 'کرمان', 
 '{"lat": 30.7061, "lng": 58.5029, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D9"}'::jsonb, 
 'بیابانی ثبت شده در یونسکو با کلوت‌های شگفت‌انگیز.', 1),
('دره شمخال', 'قوچان', 'خراسان رضوی', 
 '{"lat": 37.3888, "lng": 58.7483, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D0"}'::jsonb, 
 'دره‌ای سرسبز و عمیق با رودخانه جاری و دیواره‌های بلند.', 1),
('پارک ملی گلستان', 'مینودشت', 'گلستان', 
 '{"lat": 37.3980, "lng": 55.9961, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D1"}'::jsonb, 
 'اولین پارک ملی ایران و پناهگاه حیات وحش با تنوع گیاهی و جانوری.', 1),
('آبشار لاتون', 'آستارا', 'گیلان', 
 '{"lat": 38.3361, "lng": 48.7490, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D2"}'::jsonb, 
 'بلندترین آبشار ایران با طبیعت جنگلی بکر.', 1),
('کوه تفتان', 'تفتان', 'سیستان و بلوچستان', 
 '{"lat": 28.5991, "lng": 61.1293, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D3"}'::jsonb, 
 'تنها کوه آتشفشان نیمه‌فعال ایران.', 1);

--- PLACE PHOTOS ---
INSERT INTO place_photos (place_id, url) VALUES

-- میدان نقش جهان
((SELECT place_id FROM places WHERE place_name = 'میدان نقش جهان'), 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg'),
((SELECT place_id FROM places WHERE place_name = 'میدان نقش جهان'), 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg'),
((SELECT place_id FROM places WHERE place_name = 'میدان نقش جهان'), 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg'),
((SELECT place_id FROM places WHERE place_name = 'میدان نقش جهان'), 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg'),

-- مسجد شیخ لطف‌الله
((SELECT place_id FROM places WHERE place_name = 'مسجد شیخ لطف‌الله'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد شیخ لطف‌الله'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد شیخ لطف‌الله'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد شیخ لطف‌الله'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg'),

-- سی‌و‌سه‌پل
((SELECT place_id FROM places WHERE place_name = 'سی‌و‌سه‌پل'), 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg'),
((SELECT place_id FROM places WHERE place_name = 'سی‌و‌سه‌پل'), 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg'),
((SELECT place_id FROM places WHERE place_name = 'سی‌و‌سه‌پل'), 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg'),
((SELECT place_id FROM places WHERE place_name = 'سی‌و‌سه‌پل'), 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg'),

-- مکان‌های شیراز
-- تخت جمشید
((SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تخت جمشید'), 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg'),

-- مسجد نصیرالملک
((SELECT place_id FROM places WHERE place_name = 'مسجد نصیرالملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد نصیرالملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد نصیرالملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد نصیرالملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg'),

-- باغ ارم
((SELECT place_id FROM places WHERE place_name = 'باغ ارم'), 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ ارم'), 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ ارم'), 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ ارم'), 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg'),

-- حافظیه
((SELECT place_id FROM places WHERE place_name = 'حافظیه'), 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حافظیه'), 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حافظیه'), 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حافظیه'), 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg'),

-- مشهد
-- حرم امام رضا
((SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حرم امام رضا'), 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg');


INSERT INTO place_photos (place_id, url) VALUES
-- جنگل ابر (place_name = 'جنگل ابر')
((SELECT place_id FROM places WHERE place_name = 'جنگل ابر'), 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جنگل ابر'), 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جنگل ابر'), 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جنگل ابر'), 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg'),

-- کویر مرنجاب (place_name = 'کویر مرنجاب')
((SELECT place_id FROM places WHERE place_name = 'کویر مرنجاب'), 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کویر مرنجاب'), 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کویر مرنجاب'), 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کویر مرنجاب'), 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg'),

-- غار علی‌صدر (place_name = 'غار علی‌صدر')
((SELECT place_id FROM places WHERE place_name = 'غار علی‌صدر'), 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg'),
((SELECT place_id FROM places WHERE place_name = 'غار علی‌صدر'), 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg'),
((SELECT place_id FROM places WHERE place_name = 'غار علی‌صدر'), 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg'),
((SELECT place_id FROM places WHERE place_name = 'غار علی‌صدر'), 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg'),

-- ماسوله (place_name = 'ماسوله')
((SELECT place_id FROM places WHERE place_name = 'ماسوله'), 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg'),
((SELECT place_id FROM places WHERE place_name = 'ماسوله'), 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg'),
((SELECT place_id FROM places WHERE place_name = 'ماسوله'), 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg'),
((SELECT place_id FROM places WHERE place_name = 'ماسوله'), 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg'),

-- تالاب انزلی (place_name = 'تالاب انزلی')
((SELECT place_id FROM places WHERE place_name = 'تالاب انزلی'), 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تالاب انزلی'), 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تالاب انزلی'), 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تالاب انزلی'), 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg'),

-- آبشار بیشه (place_name = 'آبشار بیشه')
((SELECT place_id FROM places WHERE place_name = 'آبشار بیشه'), 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آبشار بیشه'), 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آبشار بیشه'), 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آبشار بیشه'), 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg'),

-- دره ستارگان (قشم)
((SELECT place_id FROM places WHERE place_name = 'دره ستارگان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دره ستارگان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دره ستارگان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دره ستارگان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg'),

-- جنگل‌های ارسباران (کلیبر)
((SELECT place_id FROM places WHERE place_name = 'جنگل‌های ارسباران'), 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جنگل‌های ارسباران'), 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جنگل‌های ارسباران'), 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جنگل‌های ارسباران'), 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg'),

-- دریاچه شورمست (سوادکوه)
((SELECT place_id FROM places WHERE place_name = 'دریاچه شورمست'), 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG'),
((SELECT place_id FROM places WHERE place_name = 'دریاچه شورمست'), 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG'),
((SELECT place_id FROM places WHERE place_name = 'دریاچه شورمست'), 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG'),
((SELECT place_id FROM places WHERE place_name = 'دریاچه شورمست'), 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG'),

-- چشمه‌های باداب سورت (ساری)
((SELECT place_id FROM places WHERE place_name = 'چشمه‌های باداب سورت'), 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg'),
((SELECT place_id FROM places WHERE place_name = 'چشمه‌های باداب سورت'), 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg'),
((SELECT place_id FROM places WHERE place_name = 'چشمه‌های باداب سورت'), 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg'),
((SELECT place_id FROM places WHERE place_name = 'چشمه‌های باداب سورت'), 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg'),

-- کوه سبلان (مشگین‌شهر، اردبیل)
((SELECT place_id FROM places WHERE place_name = 'کوه سبلان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mt._Sabalan_from_Highway_near_Ardabil.jpg/500px-Mt._Sabalan_from_Highway_near_Ardabil.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه سبلان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mt._Sabalan_from_Highway_near_Ardabil.jpg/500px-Mt._Sabalan_from_Highway_near_Ardabil.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه سبلان'), 'https://commons.wikimedia.org/wiki/File:Sabalan_mountains_%D9%83%D9%88%D9%87%D8%B3%D8%AA%D8%A7%D9%86_%D8%B3%D8%A8%D9%84%D8%A7%D9%86_%D8%B3%D8%B1%D8%B9%DB%8C%D9%86_%D8%A7%D8%B1%D8%AF%D8%A8%DB%8C%D9%84_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه سبلان'), 'https://commons.wikimedia.org/wiki/File:Sabalan_mountains_%D9%83%D9%88%D9%87%D8%B3%D8%AA%D8%A7%D9%86_%D8%B3%D8%A8%D9%84%D8%A7%D9%86_%D8%B3%D8%B1%D8%B9%DB%8C%D9%86_%D8%A7%D8%B1%D8%AF%D8%A8%DB%8C%D9%84_-_panoramio.jpg'),

-- تنگه چاهکوه / چاه‌کوه (قشم)
((SELECT place_id FROM places WHERE place_name = 'تنگه چاهکوه'), 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تنگه چاهکوه'), 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تنگه چاهکوه'), 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تنگه چاهکوه'), 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg'),

-- کوه دماوند (آمل/مازندران)
((SELECT place_id FROM places WHERE place_name = 'کوه دماوند'), 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه دماوند'), 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه دماوند'), 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه دماوند'), 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg'),

-- آبشار مارگون (سپیدان)
((SELECT place_id FROM places WHERE place_name = 'آبشار مارگون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016'),
((SELECT place_id FROM places WHERE place_name = 'آبشار مارگون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016'),
((SELECT place_id FROM places WHERE place_name = 'آبشار مارگون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016'),
((SELECT place_id FROM places WHERE place_name = 'آبشار مارگون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016'),

-- جزیره هنگام (قشم)
((SELECT place_id FROM places WHERE place_name = 'جزیره هنگام'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جزیره هنگام'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جزیره هنگام'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg'),
((SELECT place_id FROM places WHERE place_name = 'جزیره هنگام'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg'),

-- کلاردشت (چالوس)
((SELECT place_id FROM places WHERE place_name = 'کلاردشت'), 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلاردشت'), 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلاردشت'), 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلاردشت'), 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg'),

-- دریاچه گهر (دورود)
((SELECT place_id FROM places WHERE place_name = 'دریاچه گهر'), 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دریاچه گهر'), 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دریاچه گهر'), 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دریاچه گهر'), 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg'),

-- دشت لوت (شهداد)
((SELECT place_id FROM places WHERE place_name = 'دشت لوت'), 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دشت لوت'), 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دشت لوت'), 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دشت لوت'), 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg'),

-- دره شمخال (قوچان)
((SELECT place_id FROM places WHERE place_name = 'دره شمخال'), 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دره شمخال'), 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دره شمخال'), 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دره شمخال'), 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg'),

-- پارک ملی گلستان (مینودشت)
((SELECT place_id FROM places WHERE place_name = 'پارک ملی گلستان'), 'https://upload.wikimedia.org/wikipedia/commons/9/93/Golestan_National_Park_20161109_11.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پارک ملی گلستان'), 'https://upload.wikimedia.org/wikipedia/commons/9/93/Golestan_National_Park_20161109_11.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پارک ملی گلستان'), 'https://commons.wikimedia.org/wiki/File:Golestan_National_Park_20161109_11.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پارک ملی گلستان'), 'https://commons.wikimedia.org/wiki/File:Golestan_National_Park_20161109_11.jpg'),

-- آبشار لاتون (آستارا)
((SELECT place_id FROM places WHERE place_name = 'آبشار لاتون'), 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آبشار لاتون'), 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آبشار لاتون'), 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آبشار لاتون'), 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg'),

-- کوه تفتان (تفتان)
((SELECT place_id FROM places WHERE place_name = 'کوه تفتان'), 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه تفتان'), 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه تفتان'), 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوه تفتان'), 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg');