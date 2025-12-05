--- PROVINCES ---
INSERT INTO provinces (province_name) VALUES
('تهران'),
('اصفهان'),
('فارس'),
('یزد'),
('مازندران'),
('گیلان'),
('خوزستان'),
('آذربایجان شرقی'),
('خراسان رضوی'),
('کرمان'),
('هرمزگان');

--- CITIES ---
INSERT INTO cities (city_name) VALUES
('تهران'),
('اصفهان'),
('شیراز'),
('یزد'),
('مشهد'),
('کاشان'),
('تبریز'),
('رامسر'),
('رشت'),
('اهواز'),
('کرمان'),
('قشم');

--- PLACES ---
INSERT INTO places (place_name, city_name, province_name, place_location, description, category_id) VALUES
-- تهران
('برج میلاد', 'تهران', 'تهران', 
 '{"lat": 35.7447, "lng": 51.3729, "url": "https://www.google.com/maps/place/Milad+Tower/@35.7447679,51.3729316,17z/data=!4m14!1m7!3m6!1s0x3f8e0710d5918403:0x74f5290b67841378!2sMilad+Tower!8m2!3d35.7447636!4d51.3755012!16zL20vMDJuemdu!3m5!1s0x3f8e0710d5918403:0x74f5290b67841378!8m2!3d35.7447636!4d51.3755012!16zL20vMDJuemdu?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'ششمین برج بلند دنیا و نماد تهران با رستوران‌های گردان و چشم‌انداز 360 درجه از شهر',
 3),

('کاخ گلستان', 'تهران', 'تهران',
 '{"lat": 35.6797, "lng": 51.4179, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'میراث جهانی یونسکو، کاخ سلطنتی دوره قاجار با آینه‌کاری‌های خیره‌کننده و معماری باشکوه',
 2),

('دربند', 'تهران', 'تهران',
 '{"lat": 35.8239, "lng": 51.4160, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'مسیر کوهنوردی محبوب و منطقه تفریحی در دامنه توچال با رستوران‌های سنتی',
 1),

('باغ کتاب', 'تهران', 'تهران',
 '{"lat": 35.7524, "lng": 51.4292, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'مجموعه تفریحی-فرهنگی بزرگ با دریاچه و فضای سبز گسترده',
 3),

-- اصفهان
('میدان نقش جهان', 'اصفهان', 'اصفهان',
 '{"lat": 32.6549, "lng": 51.6659, "url": "https://www.google.com/maps/place/Naqsh-e+Jahan+Square/@32.6549395,51.6659974,15z/data=!4m10!1m2!2m1!1smeydan+naghsh+jahan!3m6!1s0x3fbc357fd49fa1e1:0xeb657498e34e82c6!8m2!3d32.657307!4d51.6775223!15sChNtZXlkYW4gbmFnaHNoIGphaGFuWhUiE21leWRhbiBuYWdoc2ggamFoYW6SARJ0b3VyaXN0X2F0dHJhY3Rpb26aASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUmZjbGx5V2tabkVBReABAPoBBQjxBhBI!16s%2Fg%2F11rpx0rdd5?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'یکی از بزرگترین میادین جهان، ثبت شده در یونسکو و احاطه شده با بناهای شگفت‌انگیز صفوی',
 2),

('مسجد شیخ لطف‌الله', 'اصفهان', 'اصفهان',
 '{"lat": 32.6573, "lng": 51.6760, "url": "https://www.google.com/maps/place/Sheikh+Lotfollah+Mosque/@32.6573516,51.6760732,17z/data=!3m1!4b1!4m6!3m5!1s0x3fbc35f9ee2ecf27:0xe114f54fcf246168!8m2!3d32.6573516!4d51.6786428!16zL20vMDd4ZjUz?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'شاهکار معماری ایرانی با کاشی‌کاری بی‌نظیر و گنبد منحصر به فرد بدون مناره',
 4),

('سی‌و‌سه‌پل', 'اصفهان', 'اصفهان',
 '{"lat": 32.6573, "lng": 51.6760, "url": "google.com/maps/place/Isfahan+Province,+Isfahan,+33+Pol,+Iran/@32.6573516,51.6760732,17z/data=!4m6!3m5!1s0x3fbc35e1fe5cf0eb:0x5dbac6475f74c19!8m2!3d32.6444146!4d51.6674653!16s%2Fg%2F1td9tlgf?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'معروف‌ترین پل اصفهان با 33 دهانه، ساخته شده در دوره صفویه روی زاینده‌رود',
 2),

-- شیراز
('تخت جمشید', 'شیراز', 'فارس',
 '{"lat": 29.9358, "lng": 52.8672, "url": "https://www.google.com/maps/place/Persepolis/@29.9358685,52.867286,14z/data=!4m10!1m2!2m1!1z2KrYrtiqINis2YXYtNuM2K8!3m6!1s0x3fade35f5cf0ad6d:0x2363ec76997cfee!8m2!3d29.9355823!4d52.8891817!15sChHYqtiu2Kog2KzZhdi024zYr1oTIhHYqtiu2Kog2KzZhdi024zYr5IBF2hpc3RvcmljYWxfcGxhY2VfbXVzZXVt4AEA!16zL20vMG14OGc?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'پایتخت تشریفاتی امپراتوری هخامنشیان، میراث جهانی یونسکو با ویرانه‌های باشکوه',
 2),

('مسجد نصیرالملک', 'شیراز', 'فارس',
 '{"lat": 29.6085, "lng": 52.5459, "url": "https://www.google.com/maps/place/Nasir+al-Mulk+Mosque/@29.6085555,52.5459112,17z/data=!3m1!4b1!4m6!3m5!1s0x3fb20d6dd1e1a9e1:0xa5db54d59b5f73fe!8m2!3d29.6085509!4d52.5484808!16zL20vMGNxcGhf?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'مسجد صورتی معروف به خاطر پنجره‌های شیشه رنگی که نور رنگین‌کمانی ایجاد می‌کنند',
 4),

('باغ ارم', 'شیراز', 'فارس',
 '{"lat": 29.6369, "lng": 52.5262, "url": "https://www.google.com/maps/place/Eram+Garden/@29.6369281,52.5262973,17z/data=!3m1!4b1!4m6!3m5!1s0x3fb2120c639a43bf:0x1516de5126619a7f!8m2!3d29.6369281!4d52.5262973!16zL20vMGR5dmJj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'باغ فارسی زیبا با عمارت تاریخی، بخشی از مجموعه باغ‌های فارسی یونسکو',
 1),

('حافظیه', 'شیراز', 'فارس',
 '{"lat": 29.6258, "lng": 52.5559, "url": "https://www.google.com/maps/place/Tomb+of+Hafez/@29.6258039,52.5559256,17z/data=!3m1!4b1!4m6!3m5!1s0x3fb20da0cdc4d8d7:0x87f9a02c62a2d984!8m2!3d29.6257993!4d52.5584952!16s%2Fm%2F064r79t?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'آرامگاه حافظ شاعر بزرگ ایرانی، مکانی آرام با باغ زیبا و معماری دوره زندیه',
 2),

-- مشهد
('حرم امام رضا', 'مشهد', 'خراسان رضوی',
 '{"lat": 36.2878, "lng": 59.6130, "url": "https://www.google.com/maps/place/Imam+Reza+Shrine/@36.2878592,59.6130941,17z/data=!3m1!4b1!4m6!3m5!1s0x3f6c916c0e0c1fbb:0xfe247c2f3b7ea0c2!8m2!3d36.2878549!4d59.6156637!16s%2Fm%2F03crjbj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}'::jsonb,
 'مقدس‌ترین زیارتگاه ایران و بزرگترین مجموعه مسجد جهان از نظر مساحت',
 4);

--- PLACE PHOTOS ---
INSERT INTO place_photos (place_id, url) VALUES
-- برج میلاد
((SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 
 'https://images.unsplash.com/photo-1613907777135-94e121cdd8f5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
((SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 
 'https://images.unsplash.com/photo-1706303176915-b51ece515aaf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
((SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 
 'https://www.qaaph.com/uploads/blog/1691147159_banner.jpg'),
((SELECT place_id FROM places WHERE place_name = 'برج میلاد'), 
 'https://images.pexels.com/photos/3799150/pexels-photo-3799150.jpeg?cs=srgb&dl=pexels-kamran-gholami-2160295-3799150.jpg&fm=jpg'),

-- کاخ گلستان
((SELECT place_id FROM places WHERE place_name = 'کاخ گلستان'), 
 'https://lp-cms-production.imgix.net/2019-06/GettyImages-500744011_full.jpg?w=1920&h=640&fit=crop&crop=faces%2Cedges&auto=format&q=75'),
((SELECT place_id FROM places WHERE place_name = 'کاخ گلستان'), 
 'https://iranmavaa.ir/wp-content/uploads/2018/03/%DA%AF%D9%84%D8%B3%D8%AA%D8%A7%D9%86.png'),
((SELECT place_id FROM places WHERE place_name = 'کاخ گلستان'), 
 'https://mrbilit.com/mag/wp-content/uploads/2022/12/Untitled-5-1000x670.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کاخ گلستان'), 
 'https://api2.kojaro.com/media/2020-9-2ea11bb2-efa7-4ef7-8f58-a615fb075ad4-67c46106c1067c5ba766c699?w=1920&q=80'),

-- دربند
((SELECT place_id FROM places WHERE place_name = 'دربند'), 
 'https://www.jowhareh.com/images/Jowhareh/galleries/poster_a7720489-e488-4579-9e19-adad70efbe14.jpeg'),
((SELECT place_id FROM places WHERE place_name = 'دربند'), 
 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.karnaval.ir%2Fthings-to-do%2Fdarband-tehran&psig=AOvVaw3ubur-z_ZUmVTOWn8Ykpu2&ust=1764376356885000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwim6aShzJORAxXYlCYFHfKOA3MQjRx6BAgAEBs'),
((SELECT place_id FROM places WHERE place_name = 'دربند'), 
 'https://cdn01.eavartravel.com/2023/10/ae1737e2-358d-4c05-aa8e-531c2492d616.jpg'),

-- باغ کتاب
((SELECT place_id FROM places WHERE place_name = 'باغ کتاب'), 
 'https://respina24.ir/mag/wp-content/uploads/2022/04/bagh-ketab-tehran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ کتاب'), 
 'https://storage.bagheketab.com/2025/02/conversions/%D8%A8%D8%A7%D8%BA-%DA%A9%D8%AA%D8%A7%D8%A8-01-super_large.webp'),
((SELECT place_id FROM places WHERE place_name = 'باغ کتاب'), 
 'https://storage.bagheketab.com/2025/03/conversions/0308-super_large.webp'),
((SELECT place_id FROM places WHERE place_name = 'باغ کتاب'), 
 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Tehrans-Book-Garden-4-1024x683.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ کتاب'), 
 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Tehrans-Book-Garden-7-1024x768.jpg');
