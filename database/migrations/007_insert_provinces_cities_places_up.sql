--- PROVINCES (New Provinces Only) ---
INSERT INTO provinces (province_name) VALUES
('البرز'),
('قم'),
('مرکزی');

--- CITIES (New Cities Only) ---
INSERT INTO cities (city_name) VALUES
('کرج'),
('قم'),
('بندر عباس');

--- PLACES (Category ID: 3 - Commercial & Leisure) ---
INSERT INTO places (place_name, city_name, province_name, place_location, description, category_id) VALUES
-- تهران (تجاری و تفریحی)
('پارک ارم', 'تهران', 'تهران', 
 '{"lat": 35.7597, "lng": 51.3093, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D481..."}', 
 'بزرگترین مجموعه تفریحی و شهربازی ایران که شامل سه شهربازی روباز (لاله، ارم و دنیای جادو) و یک باغ وحش با بیش از ۱۱۰ گونه جانوری است. مکانی عالی برای گذراندن یک روز هیجان‌انگیز.', 3),
('کوروش مال', 'تهران', 'تهران', 
 '{"lat": 35.7601, "lng": 51.3283, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D482..."}', 
 'یکی از مدرن‌ترین و بزرگترین مراکز خرید تهران در غرب پایتخت که علاوه بر واحدهای تجاری متنوع، دارای پردیس سینمایی مجهز و فودکورت با غذاهای بین‌المللی است و یک مقصد تفریحی کامل محسوب می‌شود.', 3),
('بام لند', 'تهران', 'تهران', 
 '{"lat": 35.7952, "lng": 51.2185, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D483..."}', 
 'اولین مرکز خرید روباز ایران که در کنار دریاچه چیتگر واقع شده است. این مجموعه با معماری زیبا، شامل فروشگاه‌های برند، رستوران‌ها و کافه‌های متعدد با منظره دریاچه و امکانات تفریحی مانند پیاده‌روی و قایق‌رانی است.', 3),

-- اصفهان
('سیتی سنتر اصفهان', 'اصفهان', 'اصفهان', 
 '{"lat": 32.6186, "lng": 51.6853, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D484..."}', 
 'یکی از بزرگترین مراکز خرید خاورمیانه که علاوه بر فروشگاه‌ها، شامل پردیس سینمایی، مرکز همایش، هتل ۵ ستاره و شهربازی سرپوشیده است و یک مجموعه تجاری-تفریحی چندمنظوره محسوب می‌شود.', 3),
('باغ پرندگان', 'اصفهان', 'اصفهان', 
 '{"lat": 32.6500, "lng": 51.6000, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D485..."}', 
 'باغی زیبا و بزرگ با طراحی خاص در حاشیه زاینده‌رود که محل نگهداری بیش از ۳۰۰۰ پرنده از ۱۳۰ گونه مختلف است. مکانی عالی برای علاقه‌مندان به طبیعت و پرنده‌نگری.', 3),

-- فارس (شیراز)
('مجتمع خلیج فارس', 'شیراز', 'فارس', 
 '{"lat": 29.6922, "lng": 52.4842, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D486..."}', 
 'بزرگترین مرکز خرید شیراز و یکی از ۱۰ مرکز خرید بزرگ جهان بر اساس مساحت. شامل واحدهای تجاری، پردیس سینمایی، شهربازی سرپوشیده، سالن بیلیارد و هایپرمارکت است.', 3),
('لونا پارک', 'شیراز', 'فارس', 
 '{"lat": 29.5663, "lng": 52.5028, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D487..."}', 
 'یک شهربازی بزرگ در دامنه کوه دراک شیراز که مشرف به شهر است. دارای دستگاه‌های هیجان‌انگیز، چرخ و فلک بزرگ و امکانات پذیرایی است و منظره شبانه‌روزی زیبایی از شهر ارائه می‌دهد.', 3),

-- خراسان رضوی (مشهد)
('الماس شرق', 'مشهد', 'خراسان رضوی', 
 '{"lat": 36.3683, "lng": 59.5444, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D488..."}', 
 'یکی از قدیمی‌ترین و شناخته‌شده‌ترین مراکز خرید مشهد با معماری خاص و گنبد شیشه‌ای بزرگ. این مرکز علاوه بر مغازه‌ها، دارای آب‌نمای موزیکال و شهربازی سرپوشیده نیز هست.', 3),
('سرزمین موج‌های آبی', 'مشهد', 'خراسان رضوی', 
 '{"lat": 36.3333, "lng": 59.5290, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D489..."}', 
 'یکی از بزرگترین و مجهزترین پارک‌های آبی سرپوشیده در خاورمیانه، با انواع سرسره‌های هیجان‌انگیز، رودخانه آرام، استخر و امکانات ورزشی و رفاهی کامل.', 3),

-- آذربایجان شرقی (تبریز)
('مرکز خرید لاله پارک', 'تبریز', 'آذربایجان شرقی', 
 '{"lat": 38.0700, "lng": 46.2620, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D490..."}', 
 'یک مرکز خرید لوکس و مدرن که میزبان برندهای بین‌المللی و داخلی است. دارای فودکورت، هایپرمارکت و امکانات رفاهی درجه یک برای یک تجربه خرید و تفریح عالی.', 3),

-- مازندران (رامسر و ساری)
('تله کابین رامسر', 'رامسر', 'مازندران', 
 '{"lat": 36.9209, "lng": 50.6277, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D491..."}', 
 'یک مجتمع تفریحی ساحلی-کوهستانی که با تله‌کابین، گردشگران را از ساحل دریا به ارتفاعات کوه ایلمیلی می‌برد. شامل رستوران‌ها، کافه‌ها، شهربازی، زیپ‌لاین و کلبه‌های اقامتی است.', 3),
('شهربازی و باغ گلها ساری', 'ساری', 'مازندران', 
 '{"lat": 36.7900, "lng": 53.0782, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D492..."}', 
 'مجموعه‌ای تفریحی در نزدیکی شهر ساری که شامل شهربازی با دستگاه‌های متنوع برای تمام سنین و همچنین فضای سبز و باغ گلها برای تفریح خانوادگی است.', 3),

-- گیلان (رشت و بندر انزلی)
('بازار رشت', 'رشت', 'گیلان', 
 '{"lat": 37.2800, "lng": 49.5930, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D493..."}', 
 'یکی از بزرگترین بازارهای روباز ایران و قلب تپنده تجاری گیلان. این بازار علاوه بر مرکزیت خرید سنتی، به دلیل فضای پرجنب‌وجوش، معماری سنتی و فروش محصولات محلی یک جاذبه تفریحی و فرهنگی نیز محسوب می‌شود.', 3),
('کاسپین مال', 'بندر انزلی', 'گیلان', 
 '{"lat": 37.4720, "lng": 49.4670, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D494..."}', 
 'مجتمع تجاری-تفریحی واقع در منطقه آزاد انزلی که به دلیل فروش کالاهای وارداتی و برند با قیمت مناسب، و همچنین دارا بودن فودکورت و امکانات تفریحی، مقصد محبوبی برای گردشگران است.', 3),

-- خوزستان (اهواز)
('کارون مال', 'اهواز', 'خوزستان', 
 '{"lat": 31.3323, "lng": 48.6750, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D495..."}', 
 'یکی از مراکز خرید بزرگ و مدرن اهواز که به دلیل تنوع کالاها، برندهای پوشاک و همچنین فودکورت و کافه‌های لوکس، از مراکز تجاری پرطرفدار این شهر محسوب می‌شود.', 3),

-- کرمان (کرمان)
('پارک مادر کرمان', 'کرمان', 'کرمان', 
 '{"lat": 30.2900, "lng": 57.0600, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D496..."}', 
 'یکی از بزرگترین و مجهزترین پارک‌های شهری کرمان که دارای امکانات تفریحی مانند وسایل بازی، زمین‌های ورزشی، و فضای سبز مناسب برای استراحت و پیک‌نیک‌های خانوادگی است.', 3),

-- یزد (یزد)
('مجتمع تجاری تفریحی ستاره', 'یزد', 'یزد', 
 '{"lat": 31.8900, "lng": 54.3500, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D497..."}', 
 'یکی از اولین و مهم‌ترین مراکز خرید مدرن یزد که شامل فروشگاه‌های متعدد، سینما، شهربازی سرپوشیده و رستوران‌ها است و مرکزی برای خرید و تفریح خانواده‌ها محسوب می‌شود.', 3),

-- هرمزگان (قشم)
('سیتی سنتر قشم', 'قشم', 'هرمزگان', 
 '{"lat": 26.9600, "lng": 56.2700, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D498..."}', 
 'بزرگترین و معروف‌ترین مرکز خرید جزیره قشم که به دلیل تنوع کالاها، به ویژه لوازم آرایشی، پوشاک و لوازم خانگی، مقصد اصلی خرید مسافران منطقه آزاد قشم است.', 3),
('بازار درگهان', 'قشم', 'هرمزگان', 
 '{"lat": 26.9800, "lng": 56.1200, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D499..."}', 
 'مجموعه‌ای از بازارهای عمده فروشی و خرده فروشی که یکی از قطب‌های تجاری مهم جنوب کشور است و مکانی عالی برای خرید حجم بالا با قیمت مناسب محسوب می‌شود.', 3),

-- البرز (کرج)
('باغ فاتح (پارک تنیس)', 'کرج', 'البرز', 
 '{"lat": 35.8280, "lng": 50.9820, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D500..."}', 
 'یکی از قدیمی‌ترین و محبوب‌ترین پارک‌های کرج که به دلیل فضای سبز انبوه و امکانات ورزشی به‌خصوص زمین‌های تنیس استاندارد، پاتوق تفریحی و ورزشی شهروندان است.', 3),

-- قم
('مجتمع تجاری تفریحی زیتون', 'قم', 'قم', 
 '{"lat": 34.6200, "lng": 50.8800, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D501..."}', 
 'یکی از مدرن‌ترین و پربازدیدترین مجتمع‌های تجاری در قم که علاوه بر فروشگاه‌ها، دارای فودکورت بزرگ و شهربازی است و به عنوان یک مرکز خرید و تفریح در شهر شناخته می‌شود.', 3),

-- مرکزی (اراک)
('مجتمع تجاری آفتاب', 'اراک', 'مرکزی', 
 '{"lat": 34.0800, "lng": 49.6800, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D502..."}', 
 'یکی از مراکز خرید اصلی و مهم شهر اراک که مجموعه‌ای از فروشگاه‌های لباس، طلا و جواهر و لوازم خانگی را در خود جای داده و به عنوان یکی از پاتوق‌های خرید شهر شناخته می‌شود.', 3),

-- آذربایجان غربی (ارومیه)
('مجتمع تجاری سیتادیوم', 'ارومیه', 'آذربایجان غربی', 
 '{"lat": 37.5400, "lng": 45.0700, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D503..."}', 
 'بزرگترین مرکز خرید ارومیه که علاوه بر تنوع بالای برندهای پوشاک و فروشگاه‌ها، دارای یک پردیس سینمایی مدرن و امکانات تفریحی و رستوران‌های متنوع است.', 3),

-- بوشهر (بندر بوشهر)
('بازار قدیم بوشهر', 'بندر بوشهر', 'بوشهر', 
 '{"lat": 28.9100, "lng": 50.8400, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D504..."}', 
 'بازار سنتی و تاریخی بندر بوشهر که با معماری سنتی و سقف‌های چوبی، محلی برای خرید انواع ادویه، ماهی و صنایع دستی محلی است و به دلیل قدمت و فضای خاص، یک جاذبه گردشگری نیز محسوب می‌شود.', 3);


--- place_photos ---
INSERT INTO place_photos (place_id, url) VALUES
-- تهران
((SELECT place_id FROM places WHERE place_name = 'پارک ارم'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Night_Life_%28230640349%29.jpeg/1280px-Night_Life_%28230640349%29.jpeg'),
((SELECT place_id FROM places WHERE place_name = 'پارک ارم'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Night_Life_%28230640349%29.jpeg/1280px-Night_Life_%28230640349%29.jpeg'),
((SELECT place_id FROM places WHERE place_name = 'کوروش مال'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg/1280px-%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کوروش مال'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg/1280px-%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بام لند'), 'https://static.getoccupi.com/uploads/mall_photo/photo/6431/bam-land.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بام لند'), 'https://static.getoccupi.com/uploads/mall_photo/photo/6431/bam-land.jpg'),

-- اصفهان
((SELECT place_id FROM places WHERE place_name = 'سیتی سنتر اصفهان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Isfahan_City_Center_%281%29.jpg/1200px-Isfahan_City_Center_%281%29.jpg?20221020071403'),
((SELECT place_id FROM places WHERE place_name = 'سیتی سنتر اصفهان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Isfahan_City_Center_%281%29.jpg/1200px-Isfahan_City_Center_%281%29.jpg?20221020071403'),
((SELECT place_id FROM places WHERE place_name = 'باغ پرندگان'), 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Birds_Garden_of_Isfahan_%D8%A8%D8%A7%D8%BA_%D9%BE%D8%B1%D9%86%D8%AF%DA%AF%D8%A7%D9%86_%D8%A7%D8%B5%D9%81%D9%87%D8%A7%D9%86_04.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ پرندگان'), 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Birds_Garden_of_Isfahan_%D8%A8%D8%A7%D8%BA_%D9%BE%D8%B1%D9%86%D8%AF%DA%AF%D8%A7%D9%86_%D8%A7%D8%B5%D9%81%D9%87%D8%A7%D9%86_04.jpg'),

-- فارس (شیراز)
((SELECT place_id FROM places WHERE place_name = 'مجتمع خلیج فارس'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg/1280px-%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مجتمع خلیج فارس'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg/1280px-%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'لونا پارک'), 'https://upload.wikimedia.org/wikipedia/commons/6/64/Luna_Park%2C_Shiraz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'لونا پارک'), 'https://upload.wikimedia.org/wikipedia/commons/6/64/Luna_Park%2C_Shiraz.jpg'),

-- خراسان رضوی (مشهد)
((SELECT place_id FROM places WHERE place_name = 'الماس شرق'), 'https://upload.wikimedia.org/wikipedia/fa/c/ca/Almase-shargh.jpg'),
((SELECT place_id FROM places WHERE place_name = 'الماس شرق'), 'https://upload.wikimedia.org/wikipedia/fa/c/ca/Almase-shargh.jpg'),
((SELECT place_id FROM places WHERE place_name = 'سرزمین موج‌های آبی'), 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Sarzamin-Mojhaye-Abi-scaled.jpg'),
((SELECT place_id FROM places WHERE place_name = 'سرزمین موج‌های آبی'), 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Sarzamin-Mojhaye-Abi-scaled.jpg'),

-- آذربایجان شرقی (تبریز)
((SELECT place_id FROM places WHERE place_name = 'مرکز خرید لاله پارک'), 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Laleh_Park-Tabriz.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مرکز خرید لاله پارک'), 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Laleh_Park-Tabriz.jpg'),

-- مازندران (رامسر و ساری)
((SELECT place_id FROM places WHERE place_name = 'تله کابین رامسر'), 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Ramsar_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تله کابین رامسر'), 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Ramsar_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'شهربازی و باغ گلها ساری'), 'https://static.neshanmap.ir/places/images/04d/2563023_11525387_Thumbnail.jpeg'),
((SELECT place_id FROM places WHERE place_name = 'شهربازی و باغ گلها ساری'), 'https://static.neshanmap.ir/places/images/04d/2563023_11525387_Thumbnail.jpeg'),

-- گیلان (رشت و بندر انزلی)
((SELECT place_id FROM places WHERE place_name = 'بازار رشت'), 'https://upload.wikimedia.org/wikipedia/commons/6/6d/%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1_%D8%B1%D8%B4%D8%AA.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بازار رشت'), 'https://upload.wikimedia.org/wikipedia/commons/6/6d/%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1_%D8%B1%D8%B4%D8%AA.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کاسپین مال'), 'https://itto.org/iran/image-bin/meydan-shahrdari-rasht.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کاسپین مال'), 'https://itto.org/iran/image-bin/meydan-shahrdari-rasht.jpg'),

-- خوزستان (اهواز)
((SELECT place_id FROM places WHERE place_name = 'کارون مال'), 'http://googleusercontent.com/maps.google.com/img_115_1'),
((SELECT place_id FROM places WHERE place_name = 'کارون مال'), 'http://googleusercontent.com/maps.google.com/img_115_2'),

-- کرمان (کرمان)
((SELECT place_id FROM places WHERE place_name = 'پارک مادر کرمان'), 'http://googleusercontent.com/maps.google.com/img_116_1'),
((SELECT place_id FROM places WHERE place_name = 'پارک مادر کرمان'), 'http://googleusercontent.com/maps.google.com/img_116_2'),

-- یزد (یزد)
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری تفریحی ستاره'), 'https://upload.wikimedia.org/wikipedia/commons/7/79/Setare_shoping_mall.png'),
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری تفریحی ستاره'), 'https://upload.wikimedia.org/wikipedia/commons/7/79/Setare_shoping_mall.png'),

-- هرمزگان (قشم)
((SELECT place_id FROM places WHERE place_name = 'سیتی سنتر قشم'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Qeshm_City_Center_1.jpg/1280px-Qeshm_City_Center_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'سیتی سنتر قشم'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Qeshm_City_Center_1.jpg/1280px-Qeshm_City_Center_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بازار درگهان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg/1280px-Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بازار درگهان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg/1280px-Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg'),

-- البرز (کرج)
((SELECT place_id FROM places WHERE place_name = 'باغ فاتح (پارک تنیس)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Fateh_Garden-2-Jahanshahr.jpg/500px-Fateh_Garden-2-Jahanshahr.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ فاتح (پارک تنیس)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Fateh_Garden-2-Jahanshahr.jpg/500px-Fateh_Garden-2-Jahanshahr.jpg'),

-- قم
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری تفریحی زیتون'), 'http://googleusercontent.com/maps.google.com/img_121_1'),
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری تفریحی زیتون'), 'http://googleusercontent.com/maps.google.com/img_121_2'),

-- مرکزی (اراک)
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری آفتاب'), 'http://googleusercontent.com/maps.google.com/img_122_1'),
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری آفتاب'), 'http://googleusercontent.com/maps.google.com/img_122_2'),

-- آذربایجان غربی (ارومیه)
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری سیتادیوم'), 'http://googleusercontent.com/maps.google.com/img_123_1'),
((SELECT place_id FROM places WHERE place_name = 'مجتمع تجاری سیتادیوم'), 'http://googleusercontent.com/maps.google.com/img_123_2'),

-- بوشهر (بندر بوشهر)
((SELECT place_id FROM places WHERE place_name = 'بازار قدیم بوشهر'), 'http://googleusercontent.com/maps.google.com/img_124_1'),
((SELECT place_id FROM places WHERE place_name = 'بازار قدیم بوشهر'), 'http://googleusercontent.com/maps.google.com/img_124_2');