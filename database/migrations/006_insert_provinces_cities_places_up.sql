--- PROVINCES (New Provinces Only) ---
INSERT INTO provinces (province_name) VALUES
('آذربایجان غربی'),
('کردستان'),
('بوشهر'),
('کرمانشاه');

--- CITIES (New Cities Only) ---
INSERT INTO cities (city_name) VALUES
('اردکان'),
('بیستون'),
('شوش'),
('شوشتر'),
('اراک'),
('بندر بوشهر'),
('همدان'),
('سقز'),
('بم'),
('میبد'),
('فین'),
('ارومیه'),
('پاسارگاد'),
('کرمانشاه'), 
('تکاب'),
('چالدران'),
('گنبد کاووس');

--- PLACES (Category ID: 2 - Historical) ---
INSERT INTO places (place_name, city_name, province_name, place_location, description, category_id) VALUES
-- تهران (Already in file 002)
('کاخ سعدآباد', 'تهران', 'تهران', 
 '{"lat": 35.8016, "lng": 51.4243, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D40"}'::jsonb, 
 'مجموعه‌ای فرهنگی-تاریخی و اقامتگاه تابستانی شاهان قاجار و پهلوی در شمال تهران که شامل ۱۸ کاخ و موزه با معماری فاخر و باغ‌های سرسبز است. این مجموعه عظمت دوران معاصر ایران را به نمایش می‌گذارد.', 2),

-- اصفهان (Already in file 002)
('پل خواجو', 'اصفهان', 'اصفهان', 
 '{"lat": 32.6469, "lng": 51.6883, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D41"}'::jsonb, 
 'یکی از زیباترین پل‌های تاریخی اصفهان بر روی زاینده‌رود، که به دستور شاه عباس دوم صفوی ساخته شد. این پل دارای تزیینات کاشی‌کاری، مجسمه‌های سنگی و طاق‌هایی است که به عنوان محل استراحت و تفرج پادشاهان مورد استفاده قرار می‌گرفته است.', 2),
('عالی قاپو', 'اصفهان', 'اصفهان', 
 '{"lat": 32.6562, "lng": 51.6750, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D42"}'::jsonb, 
 'کاخ سلطنتی و ورودی اصلی مجموعه دولتخانه صفوی در میدان نقش جهان اصفهان. این بنا با شش طبقه، ایوان بزرگ و ستون‌های بلند، به ویژه به دلیل تالار موسیقی (اتاق صوت) و نقاشی‌های مینیاتوری نفیس شهرت جهانی دارد.', 2),

-- شیراز (Already in file 002)
('آرامگاه سعدی', 'شیراز', 'فارس', 
 '{"lat": 29.6206, "lng": 52.5701, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D43"}'::jsonb, 
 'محل دفن شیخ مصلح‌الدین سعدی شیرازی، شاعر پرآوازه ایرانی. بنای فعلی به سبک معماری دوران زندیه و تلفیقی از معماری قدیم و جدید ایران با کاشی‌کاری‌های زیبا و فضای دلنشین ساخته شده است.', 2),
('پاسارگاد', 'پاسارگاد', 'فارس', 
 '{"lat": 30.1988, "lng": 53.1764, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D44"}'::jsonb, 
 'نخستین پایتخت امپراتوری هخامنشی به دستور کوروش بزرگ که مجموعه‌ای از سازه‌های باستانی شامل کاخ‌ها، باغ سلطنتی و آرامگاه کوروش کبیر را در بر می‌گیرد و به عنوان میراث جهانی یونسکو ثبت شده است.', 2),

-- کاشان
('باغ فین', 'فین', 'اصفهان', 
 '{"lat": 33.9788, "lng": 51.3853, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D45"}'::jsonb, 
 'باغی ایرانی با قدمت دوران صفویه، مشهور به داشتن سیستم آبرسانی بسیار قوی و فواره‌های متعدد که آب آن از چشمه سلیمانیه تأمین می‌شود. این باغ به عنوان یکی از زیباترین نمونه‌های باغ ایرانی، همچنین محل قتل امیرکبیر، صدراعظم ناصرالدین شاه، است.', 2),
('خانه طباطبایی‌ها', 'کاشان', 'اصفهان', 
 '{"lat": 33.9740, "lng": 51.4427, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D46"}'::jsonb, 
 'یکی از خانه‌های باشکوه و اعیانی کاشان مربوط به دوره قاجار. این بنا با معماری سنتی کویری، شامل اندرونی، بیرونی، و حیاط‌های متعدد با نقاشی‌های دیواری و آینه‌کاری‌های نفیس است و "عروس خانه‌های ایران" لقب دارد.', 2),

-- یزد (Already in file 002)
('مسجد جامع یزد', 'یزد', 'یزد', 
 '{"lat": 31.8973, "lng": 54.3639, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D47"}'::jsonb, 
 'بنایی با شکوه که قدمت ساخت آن به دوره ایلخانی می‌رسد و نمادی از هنر کاشی‌کاری و معماری اسلامی ایران است. این مسجد به داشتن بلندترین مناره‌های ایران (حدود ۵۲ متر) شهرت دارد و گنبد زیبای آن از نقاط مختلف شهر قابل مشاهده است.', 2),
('دخمه زرتشتیان (برج خاموشان)', 'یزد', 'یزد', 
 '{"lat": 31.8340, "lng": 54.3210, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D48"}'::jsonb, 
 'مکانی تاریخی و مذهبی متعلق به زرتشتیان در حومه شهر یزد. این سازه‌ها که بر روی تپه‌ای مرتفع قرار دارند، در گذشته برای اجرای آیین خاص دفن مردگان (قرار دادن اجساد در معرض پرندگان) استفاده می‌شدند.', 2),
('نارین قلعه', 'میبد', 'یزد', 
 '{"lat": 32.2272, "lng": 54.0150, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D49"}'::jsonb, 
 'کهن‌ترین و بزرگترین بنای خشتی جهان که قدمت آن به دوران ساسانیان و حتی پیش از اسلام باز می‌گردد. این قلعه بر روی تپه‌ای مشرف به شهر میبد ساخته شده و دارای بخش‌های نظامی و مسکونی بوده است.', 2),
('چک چک', 'اردکان', 'یزد', 
 '{"lat": 32.3687, "lng": 54.5422, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D50"}'::jsonb, 
 'یکی از مهم‌ترین زیارتگاه‌های زرتشتیان جهان که در دل کوهستان و در نزدیکی اردکان یزد واقع شده است. این مکان مقدس به دلیل قطرات آبی که به طور دائم از صخره‌ها می‌چکد، نامگذاری شده است.', 2),

-- مشهد (Already in file 002)
('آرامگاه فردوسی', 'مشهد', 'خراسان رضوی', 
 '{"lat": 36.4862, "lng": 59.4897, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D51"}'::jsonb, 
 'بنای یادبود و محل دفن حکیم ابوالقاسم فردوسی، سراینده شاهنامه، در توس مشهد. معماری بنا الهام گرفته از شیوه معماری هخامنشی و به ویژه آرامگاه کوروش است و عظمت حماسی شعر او را نشان می‌دهد.', 2),
('نادرشاه', 'مشهد', 'خراسان رضوی', 
 '{"lat": 36.3113, "lng": 59.5997, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D52"}'::jsonb, 
 'آرامگاه پادشاه مقتدر افشار، نادرشاه، که در باغ نادری مشهد واقع شده است. بنای کنونی توسط هوشنگ سیحون طراحی شده و مجسمه معروف نادرشاه سوار بر اسب در ورودی آن قرار دارد.', 2),

-- تبریز (Already in file 002)
('بازار تبریز', 'تبریز', 'آذربایجان شرقی', 
 '{"lat": 38.0827, "lng": 46.2818, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D53"}'::jsonb, 
 'بزرگترین بازار سرپوشیده و به‌هم‌پیوسته جهان که در فهرست میراث جهانی یونسکو ثبت شده است. این بازار قلب تپنده تجارت در شمال غرب ایران و نمونه‌ای عالی از معماری سنتی بازار در خاورمیانه است که دارای ده‌ها راسته و سرا است.', 2),
('مسجد کبود', 'تبریز', 'آذربایجان شرقی', 
 '{"lat": 38.0801, "lng": 46.2810, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D54"}'::jsonb, 
 'مسجدی تاریخی متعلق به دوره قراقویونلوها که به دلیل کاشی‌کاری‌های نفیس آبی و لاجوردی‌اش به "فیروزه اسلام" شهرت یافته است. بخش‌های زیادی از این مسجد در زلزله آسیب دیده‌اند و بازسازی شده‌اند.', 2),

-- گیلان (Already in file 002)
('قلعه رودخان', 'فومن', 'گیلان', 
 '{"lat": 37.0664, "lng": 49.2393, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D55"}'::jsonb, 
 'دژی نظامی متعلق به دوران ساسانیان که در دوره سلجوقیان بازسازی شد. این قلعه در ارتفاعات جنگلی فومن گیلان قرار دارد و دارای دو بخش ارگ و قورخانه با دیوارهای سنگی مستحکم و ۶۵ برج است.', 2),

-- کرمان (Already in file 002)
('ارگ بم', 'بم', 'کرمان', 
 '{"lat": 29.1062, "lng": 58.3619, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D56"}'::jsonb, 
 'بزرگترین سازه خشتی جهان که قدمت آن به بیش از ۲۵۰۰ سال پیش و دوره هخامنشیان باز می‌گردد. این ارگ تاریخی که در میراث جهانی یونسکو ثبت شده بود، در زلزله سال ۱۳۸۲ به شدت آسیب دید و در حال بازسازی است.', 2),
('باغ شازده ماهان', 'کرمان', 'کرمان', 
 '{"lat": 30.0718, "lng": 57.2917, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D57"}'::jsonb, 
 'یکی از ۹ باغ ایرانی ثبت شده در یونسکو، که نمونه‌ای کامل از باغ‌های کویری با معماری دوره قاجار و فواره‌های متعدد و حوضچه‌های آب در دل منطقه‌ای خشک است. این باغ نماد غلبه بر طبیعت سخت کویر است.', 2),

-- همدان (Already in file 005)
('آرامگاه بوعلی سینا', 'همدان', 'همدان', 
 '{"lat": 34.7997, "lng": 48.5130, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D58"}'::jsonb, 
 'بنای یادبود و محل دفن ابوعلی سینا، فیلسوف، پزشک و دانشمند بزرگ ایرانی، در همدان. این برج با الهام از معماری برج گنبد قابوس ساخته شده و شامل موزه و کتابخانه است.', 2),
('تپه هگمتانه', 'همدان', 'همدان', 
 '{"lat": 34.8093, "lng": 48.5140, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D59"}'::jsonb, 
 'یکی از بزرگترین تپه‌های باستانی ایران که بقایای شهر باستانی هگمتانه، پایتخت مادها و هخامنشیان را در خود جای داده است. این تپه شاهد تاریخ غنی و کاوش‌های باستان‌شناسی مهم بوده است.', 2),

-- خوزستان (Already in file 002)
('آبشارهای شوشتر', 'شوشتر', 'خوزستان', 
 '{"lat": 32.0308, "lng": 48.8914, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D60"}'::jsonb, 
 'سیستم هیدرولیکی باستانی که شامل پل‌ها، بندها، آسیاب‌ها، آبشارها و کانال‌های عظیم است. این شاهکار مهندسی مربوط به دوران ساسانیان بوده و به عنوان یک اثر جهانی در یونسکو ثبت شده است.', 2),
('زیگورات چغازنبیل', 'شوش', 'خوزستان', 
 '{"lat": 32.0000, "lng": 48.5290, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D61"}'::jsonb, 
 'معبد ایلامی باستانی و یکی از معدود زیگورات‌های باقی‌مانده در خارج از بین‌النهرین که به دست اونتاش ناپیریشا، شاه ایلامی، ساخته شد. این بنا یکی از باارزش‌ترین آثار باستانی ایران و جهان و میراث جهانی یونسکو است.', 2),

-- کردستان
('عمارت آصف (خانه کرد)', 'سقز', 'کردستان', 
 '{"lat": 36.2167, "lng": 46.2667, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D62"}'::jsonb, 
 'عمارت آصف، معروف به خانه کرد، یکی از بناهای تاریخی سنندج است که نمونه‌ای برجسته از معماری مسکونی دوره صفوی و قاجار است و امروزه به موزه مردم‌شناسی و تاریخ کردستان تبدیل شده است.', 2),

-- کرمانشاه
('بیستون', 'بیستون', 'کرمانشاه', 
 '{"lat": 34.4020, "lng": 47.4370, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D63"}'::jsonb, 
 'مجموعه‌ای بزرگ از آثار باستانی شامل کتیبه مشهور داریوش بزرگ که بر صخره‌ای عظیم حک شده است. این اثر که شامل نقش برجسته‌ها و خط میخی است، سند مهمی از تاریخ هخامنشی و در یونسکو ثبت شده است.', 2),
('تاق بستان', 'کرمانشاه', 'کرمانشاه', 
 '{"lat": 34.3686, "lng": 47.1685, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D64"}'::jsonb, 
 'مجموعه‌ای از سنگ‌نگاره‌ها و تاق‌های ساسانی که صحنه‌های تاج‌گذاری، شکار، و پیکرتراشی شاهان ساسانی را به تصویر کشیده‌اند. این اثر در دامنه کوه و کنار چشمه‌ای در نزدیکی کرمانشاه قرار دارد.', 2),

-- هرمزگان (Already in file 002)
('قلعه پرتغالی‌ها', 'قشم', 'هرمزگان', 
 '{"lat": 26.9696, "lng": 56.2731, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D65"}'::jsonb, 
 'دژی نظامی و بزرگ که توسط استعمارگران پرتغالی در قرن ۱۶ میلادی در جزیره قشم و جزیره هرمز ساخته شد. این قلعه از مهم‌ترین یادگارهای حضور پرتغالی‌ها در خلیج فارس است.', 2),

-- آذربایجان غربی
('تخت سلیمان', 'تکاب', 'آذربایجان غربی', 
 '{"lat": 36.6117, "lng": 47.2690, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D66"}'::jsonb, 
 'مجموعه تاریخی و مذهبی باستانی شامل آتشکده آذرگشنسب (یکی از سه آتشکده مهم ساسانی)، بقایای کاخ‌ها، و یک دریاچه آب‌زلال است. این مکان در میراث جهانی یونسکو ثبت شده و ترکیبی از تاریخ ایران باستان و دوره اسلامی است.', 2),
('قره کلیسا', 'چالدران', 'آذربایجان غربی', 
 '{"lat": 39.2680, "lng": 44.5501, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D67"}'::jsonb, 
 'یکی از قدیمی‌ترین و مهم‌ترین کلیساهای ارامنه جهان که قدمت آن به قرن اول میلادی می‌رسد. این کلیسا در چالدران آذربایجان غربی واقع شده و به دلیل اهمیت مذهبی و معماری خاص خود، در یونسکو ثبت شده است.', 2),

-- بوشهر
('عمارت ملک', 'بندر بوشهر', 'بوشهر', 
 '{"lat": 28.9711, "lng": 50.8351, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D68"}'::jsonb, 
 'عمارتی تاریخی و بسیار بزرگ در بندر بوشهر که متعلق به محمد ابراهیم خان، یکی از تجار بزرگ دوره قاجار، بوده است. این بنا با سبک معماری بومی و حیاط‌های وسیع، نمادی از معماری دوره قاجار در جنوب ایران است.', 2),

-- سایر مکان‌ها
('گنبد قابوس', 'گنبد کاووس', 'گلستان', 
 '{"lat": 37.3712, "lng": 55.1587, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D69"}'::jsonb, 
 'بلندترین برج تمام آجری دنیا که به دستور قابوس بن وشمگیر در قرن چهارم هجری (دوره آل زیار) در گنبد کاووس ساخته شد. این برج به عنوان شاهکار معماری اسلامی و میراث جهانی یونسکو شناخته می‌شود.', 2),
('مقبره کوروش کبیر', 'پاسارگاد', 'فارس', 
 '{"lat": 30.1930, "lng": 53.1793, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D70"}'::jsonb, 
 'ساختمان اصلی و سنگی آرامگاه کوروش بزرگ در مجموعه پاسارگاد که بر روی یک سکوی ۶ پله‌ای قرار دارد. این بنا نماد معماری ساده و در عین حال مستحکم هخامنشی و عظمت پادشاهی ایران باستان است.', 2),
('مسجد وکیل', 'شیراز', 'فارس', 
 '{"lat": 29.6087, "lng": 52.5457, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D71"}'::jsonb, 
 'مسجدی باشکوه و تاریخی در شیراز متعلق به دوره زندیه و به دستور کریمخان زند. این مسجد به داشتن ۷۵۰۰ متر مربع کاشی‌کاری‌های زیبا و شبستان‌های عظیم با ستون‌های مارپیچ معروف است.', 2),
('تپه سیلک', 'کاشان', 'اصفهان', 
 '{"lat": 33.9785, "lng": 51.4285, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D72"}'::jsonb, 
 'کهن‌ترین زیستگاه فلات ایران که قدمت آن به بیش از ۷۵۰۰ سال پیش (عصر سفالگری) بازمی‌گردد. این تپه شامل دو تپه شمالی و جنوبی است و شواهد مهمی از تمدن‌های پیش از آریایی را در خود جای داده است.', 2),
('باغ دولت آباد', 'یزد', 'یزد', 
 '{"lat": 31.9056, "lng": 54.3752, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D73"}'::jsonb, 
 'باغی تاریخی در یزد، که به دلیل داشتن بلندترین بادگیر جهان (بیش از ۳۳ متر) شهرت دارد. این باغ نمونه‌ای از معماری کویری و سیستم تهویه هوای سنتی در یزد است و در فهرست میراث جهانی یونسکو قرار دارد.', 2),
('قلعه فلک‌الافلاک', 'خرم‌آباد', 'لرستان', 
 '{"lat": 33.4727, "lng": 48.3582, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D74"}'::jsonb, 
 'دژ و قلعه‌ای ساسانی که بر فراز تپه‌ای در مرکز خرم‌آباد قرار دارد. این بنا در طول تاریخ به عنوان مرکز حکومتی، زندان و پادگان استفاده شده و اکنون به موزه مردم‌شناسی لرستان تبدیل شده است.', 2);

--- PLACE PHOTOS ---
INSERT INTO place_photos (place_id, url) VALUES

-- کاخ سعدآباد
((SELECT place_id FROM places WHERE place_name = 'کاخ سعدآباد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کاخ سعدآباد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کاخ سعدآباد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کاخ سعدآباد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg'),

-- پل خواجو
((SELECT place_id FROM places WHERE place_name = 'پل خواجو'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پل خواجو'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پل خواجو'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پل خواجو'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg'),

-- عالی قاپو
((SELECT place_id FROM places WHERE place_name = 'عالی قاپو'), 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عالی قاپو'), 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عالی قاپو'), 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عالی قاپو'), 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg'),

-- آرامگاه سعدی
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سعدی'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سعدی'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سعدی'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سعدی'), 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg'),

-- پاسارگاد
((SELECT place_id FROM places WHERE place_name = 'پاسارگاد'), 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پاسارگاد'), 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پاسارگاد'), 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'پاسارگاد'), 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg'),

-- باغ فین
((SELECT place_id FROM places WHERE place_name = 'باغ فین'), 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ فین'), 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ فین'), 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ فین'), 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg'),

-- خانه طباطبایی‌ها
((SELECT place_id FROM places WHERE place_name = 'خانه طباطبایی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg'),
((SELECT place_id FROM places WHERE place_name = 'خانه طباطبایی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg'),
((SELECT place_id FROM places WHERE place_name = 'خانه طباطبایی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg'),
((SELECT place_id FROM places WHERE place_name = 'خانه طباطبایی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg'),

-- مسجد جامع یزد
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع یزد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع یزد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع یزد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع یزد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg'),

-- دخمه زرتشتیان (برج خاموشان)
((SELECT place_id FROM places WHERE place_name = 'دخمه زرتشتیان (برج خاموشان)'), 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دخمه زرتشتیان (برج خاموشان)'), 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دخمه زرتشتیان (برج خاموشان)'), 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg'),
((SELECT place_id FROM places WHERE place_name = 'دخمه زرتشتیان (برج خاموشان)'), 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg'),

-- نارین قلعه
((SELECT place_id FROM places WHERE place_name = 'نارین قلعه'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'نارین قلعه'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'نارین قلعه'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'نارین قلعه'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg'),

-- چک چک
((SELECT place_id FROM places WHERE place_name = 'چک چک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg'),
((SELECT place_id FROM places WHERE place_name = 'چک چک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg'),
((SELECT place_id FROM places WHERE place_name = 'چک چک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg'),
((SELECT place_id FROM places WHERE place_name = 'چک چک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg'),

-- آرامگاه فردوسی
((SELECT place_id FROM places WHERE place_name = 'آرامگاه فردوسی'), 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه فردوسی'), 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه فردوسی'), 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه فردوسی'), 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg'),

-- نادرشاه
((SELECT place_id FROM places WHERE place_name = 'نادرشاه'), 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'نادرشاه'), 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'نادرشاه'), 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'نادرشاه'), 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg'),

-- بازار تبریز
((SELECT place_id FROM places WHERE place_name = 'بازار تبریز'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بازار تبریز'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بازار تبریز'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بازار تبریز'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg'),

-- مسجد کبود
((SELECT place_id FROM places WHERE place_name = 'مسجد کبود'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد کبود'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد کبود'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد کبود'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg'),

-- قلعه رودخان
((SELECT place_id FROM places WHERE place_name = 'قلعه رودخان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG'),
((SELECT place_id FROM places WHERE place_name = 'قلعه رودخان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG'),
((SELECT place_id FROM places WHERE place_name = 'قلعه رودخان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG'),
((SELECT place_id FROM places WHERE place_name = 'قلعه رودخان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG'),

-- ارگ بم
((SELECT place_id FROM places WHERE place_name = 'ارگ بم'), 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg'),
((SELECT place_id FROM places WHERE place_name = 'ارگ بم'), 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg'),
((SELECT place_id FROM places WHERE place_name = 'ارگ بم'), 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg'),
((SELECT place_id FROM places WHERE place_name = 'ارگ بم'), 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg'),

-- باغ شازده ماهان
((SELECT place_id FROM places WHERE place_name = 'باغ شازده ماهان'), 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ شازده ماهان'), 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ شازده ماهان'), 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ شازده ماهان'), 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg'),

-- آرامگاه بوعلی سینا
((SELECT place_id FROM places WHERE place_name = 'آرامگاه بوعلی سینا'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه بوعلی سینا'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه بوعلی سینا'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه بوعلی سینا'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg'),

-- تپه هگمتانه
((SELECT place_id FROM places WHERE place_name = 'تپه هگمتانه'), 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1'),
((SELECT place_id FROM places WHERE place_name = 'تپه هگمتانه'), 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1'),
((SELECT place_id FROM places WHERE place_name = 'تپه هگمتانه'), 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1'),
((SELECT place_id FROM places WHERE place_name = 'تپه هگمتانه'), 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1'),

-- آبشارهای شوشتر
((SELECT place_id FROM places WHERE place_name = 'آبشارهای شوشتر'), 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG'),
((SELECT place_id FROM places WHERE place_name = 'آبشارهای شوشتر'), 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG'),
((SELECT place_id FROM places WHERE place_name = 'آبشارهای شوشتر'), 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG'),
((SELECT place_id FROM places WHERE place_name = 'آبشارهای شوشتر'), 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG'),

-- زیگورات چغازنبیل
((SELECT place_id FROM places WHERE place_name = 'زیگورات چغازنبیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg'),
((SELECT place_id FROM places WHERE place_name = 'زیگورات چغازنبیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg'),
((SELECT place_id FROM places WHERE place_name = 'زیگورات چغازنبیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg'),
((SELECT place_id FROM places WHERE place_name = 'زیگورات چغازنبیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg'),

-- عمارت آصف (خانه کرد)
((SELECT place_id FROM places WHERE place_name = 'عمارت آصف (خانه کرد)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عمارت آصف (خانه کرد)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عمارت آصف (خانه کرد)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عمارت آصف (خانه کرد)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg'),

-- بیستون
((SELECT place_id FROM places WHERE place_name = 'بیستون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بیستون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بیستون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg'),
((SELECT place_id FROM places WHERE place_name = 'بیستون'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg'),

-- تاق بستان
((SELECT place_id FROM places WHERE place_name = 'تاق بستان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تاق بستان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تاق بستان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تاق بستان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg'),

-- قلعه پرتغالی‌ها
((SELECT place_id FROM places WHERE place_name = 'قلعه پرتغالی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قلعه پرتغالی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قلعه پرتغالی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قلعه پرتغالی‌ها'), 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg'),

-- تخت سلیمان
((SELECT place_id FROM places WHERE place_name = 'تخت سلیمان'), 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تخت سلیمان'), 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تخت سلیمان'), 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تخت سلیمان'), 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg'),

-- قره کلیسا
((SELECT place_id FROM places WHERE place_name = 'قره کلیسا'), 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قره کلیسا'), 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قره کلیسا'), 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قره کلیسا'), 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg'),

-- عمارت ملک
((SELECT place_id FROM places WHERE place_name = 'عمارت ملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عمارت ملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عمارت ملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'عمارت ملک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg'),

-- گنبد قابوس
((SELECT place_id FROM places WHERE place_name = 'گنبد قابوس'), 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG'),
((SELECT place_id FROM places WHERE place_name = 'گنبد قابوس'), 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG'),
((SELECT place_id FROM places WHERE place_name = 'گنبد قابوس'), 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG'),
((SELECT place_id FROM places WHERE place_name = 'گنبد قابوس'), 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG'),

-- مقبره کوروش کبیر
((SELECT place_id FROM places WHERE place_name = 'مقبره کوروش کبیر'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مقبره کوروش کبیر'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مقبره کوروش کبیر'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مقبره کوروش کبیر'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg'),

-- مسجد وکیل
((SELECT place_id FROM places WHERE place_name = 'مسجد وکیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد وکیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد وکیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد وکیل'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg'),

-- تپه سیلک
((SELECT place_id FROM places WHERE place_name = 'تپه سیلک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تپه سیلک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تپه سیلک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg'),
((SELECT place_id FROM places WHERE place_name = 'تپه سیلک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg'),

-- باغ دولت آباد
((SELECT place_id FROM places WHERE place_name = 'باغ دولت آباد'), 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ دولت آباد'), 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ دولت آباد'), 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg'),
((SELECT place_id FROM places WHERE place_name = 'باغ دولت آباد'), 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg'),

-- قلعه فلک‌الافلاک
((SELECT place_id FROM places WHERE place_name = 'قلعه فلک‌الافلاک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قلعه فلک‌الافلاک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قلعه فلک‌الافلاک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قلعه فلک‌الافلاک'), 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg');