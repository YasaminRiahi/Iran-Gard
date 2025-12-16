--- CITIES (New Cities Only) ---
INSERT INTO cities (city_name) VALUES
('جلفا'),
('بسطام'),
('کلاله'),
('دزفول');

--- PLACES (Category ID: 4 - Religious) ---
INSERT INTO places (place_name, city_name, province_name, place_location, description, category_id) VALUES
-- مسجد گوهرشاد
('مسجد گوهرشاد', 'مشهد', 'خراسان رضوی', 
'{"lat": 36.2870, "lng": 59.6100, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D479..."}', 
'یکی از مهم‌ترین مساجد تاریخی مشهد که به دستور گوهرشاد بیگم، همسر شاهرخ تیموری، در کنار حرم مطهر امام رضا (ع) بنا شده است و به معماری باشکوه دوران تیموری شهرت دارد.', 4),

-- حرم حضرت معصومه (س)
('حرم حضرت معصومه (س)', 'قم', 'قم', 
'{"lat": 34.6409, "lng": 50.8756, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D480..."}', 
'آرامگاه حضرت فاطمه معصومه (س)، خواهر امام رضا (ع)، و یکی از مهم‌ترین مراکز مذهبی شیعه در ایران. معماری شکوهمند و کاشی‌کاری‌های زیبای آن بسیار چشم‌نواز است.', 4),
-- مسجد جمکران
('مسجد جمکران', 'قم', 'قم', 
'{"lat": 34.6625, "lng": 50.9329, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D481..."}', 
'یکی از مساجد مهم شیعیان که بر اساس روایات، به دستور امام زمان (عج) بنا شده است. این مسجد در حومه شهر قم قرار دارد و هر هفته میزبان زائران بسیاری است.', 4),

-- شاهچراغ
('شاهچراغ', 'شیراز', 'فارس', 
'{"lat": 29.6080, "lng": 52.5441, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D482..."}', 
'آرامگاه احمد بن موسی کاظم (ع)، معروف به شاهچراغ، برادر امام رضا (ع). آینه‌کاری‌های داخلی خیره‌کننده و معماری اسلامی بی‌نظیر آن، این مکان را به یک جاذبه مذهبی و هنری تبدیل کرده است.', 4),
-- آرامگاه حافظ (حافظیه)
('آرامگاه حافظ (حافظیه)', 'شیراز', 'فارس', 
'{"lat": 29.6008, "lng": 52.5593, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D483A..."}', 
'آرامگاه لسان‌الغیب، حافظ شیرازی، شاعر بزرگ قرن هشتم هجری. این مکان یک مرکز ادبی و عرفانی مهم است و معماری زیبای آن نماد فرهنگ ایرانی است.', 4),
-- آستانه سید علاءالدین حسین
('آستانه سید علاءالدین حسین', 'شیراز', 'فارس', 
'{"lat": 29.6000, "lng": 52.5460, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D484..."}', 
'آرامگاه یکی دیگر از فرزندان امام موسی کاظم (ع)، که در نزدیکی شاهچراغ واقع شده و دارای معماری و تزیینات مذهبی زیبایی است.', 4),
-- آرامگاه سعدی (سعدیه)
('آرامگاه سعدی (سعدیه)', 'شیراز', 'فارس', 
'{"lat": 29.6000, "lng": 52.5700, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D485A..."}', 
'آرامگاه استاد سخن، شیخ مصلح الدین سعدی شیرازی. این مکان علاوه بر ارزش ادبی، دارای معماری چشم‌نواز و فضایی معنوی است.', 4),

-- مسجد جامع اصفهان
('مسجد جامع اصفهان', 'اصفهان', 'اصفهان', 
'{"lat": 32.6601, "lng": 51.6780, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D486..."}', 
'یکی از قدیمی‌ترین و مهم‌ترین بناهای مذهبی در ایران که شامل سبک‌های مختلف معماری از دوران عباسی تا قاجار است و یک شاهکار معماری اسلامی محسوب می‌شود.', 4),
-- کلیسای وانک
('کلیسای وانک', 'اصفهان', 'اصفهان', 
'{"lat": 32.6318, "lng": 51.6560, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D487..."}', 
'زیباترین کلیسای تاریخی ایران در محله جلفا که به دلیل نقاشی‌های دیواری شگفت‌انگیز و ترکیب هنر ایرانی و اروپایی شهرت جهانی دارد.', 4),
-- مسجد آقا بزرگ
('مسجد آقا بزرگ', 'کاشان', 'اصفهان', 
'{"lat": 33.9875, "lng": 51.4428, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D488..."}', 
'مسجدی تاریخی و مدرسه علمیه در کاشان با معماری خاص گودال باغچه و سقف‌های چوبی زیبا، یکی از نمونه‌های برجسته معماری دوره قاجار.', 4),

-- آرامگاه سید رکن الدین
('آرامگاه سید رکن الدین', 'یزد', 'یزد', 
'{"lat": 31.8980, "lng": 54.3660, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D489A..."}', 
'آرامگاهی با شکوه در نزدیکی مسجد جامع یزد که دارای گنبد کاشی‌کاری شده آبی فیروزه‌ای و معماری دوره ایلخانی است و به عنوان یک مکان مذهبی-تاریخی مهم شناخته می‌شود.', 4),
-- آتشکده زرتشتیان یزد
('آتشکده زرتشتیان یزد', 'یزد', 'یزد', 
'{"lat": 31.8950, "lng": 54.3400, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D490..."}', 
'مکان مقدس زرتشتیان که آتش ورهرام در آن بیش از ۱۵۰۰ سال است که روشن نگاه داشته شده. این مکان به دلیل اهمیت مذهبی و معماری خاصش مورد بازدید قرار می‌گیرد.', 4),

-- کلیسای سنت استپانوس
('کلیسای سنت استپانوس', 'جلفا', 'آذربایجان شرقی', 
'{"lat": 38.9700, "lng": 46.2000, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D493..."}', 
'کلیسای تاریخی ارامنه که در منطقه‌ای کوهستانی واقع شده و جزو میراث جهانی یونسکو است. معماری قرون وسطایی و موقعیت طبیعی آن بی‌نظیر است.', 4),
-- کلیسای مریم مقدس
('کلیسای مریم مقدس', 'ارومیه', 'آذربایجان غربی', 
'{"lat": 37.5540, "lng": 45.0740, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D494..."}', 
'یکی از قدیمی‌ترین کلیساهای ایران و جهان که قدمت آن به دوران ساسانی و حتی قبل از آن باز می‌گردد و از نظر مذهبی برای مسیحیان بسیار حائز اهمیت است.', 4),
-- قره کلیسا (تاتاووس مقدس)
('قره کلیسا (تاتاووس مقدس)', 'چالدران', 'آذربایجان غربی', 
'{"lat": 39.0910, "lng": 44.4980, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D495A..."}', 
'یکی از قدیمی‌ترین کلیساهای جهان مسیحیت و از مهم‌ترین مکان‌های مذهبی ارامنه. این کلیسا به دلیل معماری منحصربه‌فرد و رنگ سنگ‌هایش مشهور است و ثبت جهانی یونسکو می‌باشد.', 4),

-- آرامگاه بایزید بسطامی
('آرامگاه بایزید بسطامی', 'بسطام', 'سمنان', 
'{"lat": 36.4350, "lng": 54.9860, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D497..."}', 
'مجموعه آرامگاهی شامل مزار یکی از بزرگترین عرفای ایران، بایزید بسطامی، که به دلیل معماری عرفانی و آرامش خاص محیط، مورد توجه است.', 4),
-- زیارتگاه خالد نبی
('زیارتگاه خالد نبی', 'کلاله', 'گلستان', 
'{"lat": 37.8100, "lng": 55.4800, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D498..."}', 
'آرامگاه منسوب به یکی از پیامبران الهی، با طبیعت تپه‌ای و گورستان تاریخی عجیب و مرموز که در منطقه‌ای دورافتاده و خوش آب و هوا قرار دارد.', 4),

-- آرامگاه دانیال نبی (ع)
('آرامگاه دانیال نبی (ع)', 'شوش', 'خوزستان', 
'{"lat": 32.2030, "lng": 48.2435, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D499..."}', 
'مزار یکی از پیامبران بنی‌اسرائیل با گنبد پلکانی خاص و منحصربه‌فرد که به عنوان یک نماد مذهبی و معماری در منطقه شناخته می‌شود.', 4),
-- مسجد جامع شوشتر
('مسجد جامع شوشتر', 'شوشتر', 'خوزستان', 
'{"lat": 32.0300, "lng": 48.8600, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D500..."}', 
'یکی از قدیمی‌ترین مساجد ایران که در قرون اولیه اسلامی بنا شده و دارای معماری تلفیقی از دوره‌های مختلف است.', 4),
-- آرامگاه یعقوب لیث صفاری
('آرامگاه یعقوب لیث صفاری', 'دزفول', 'خوزستان', 
'{"lat": 32.3910, "lng": 48.4230, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D501A..."}', 
'آرامگاه بنیانگذار سلسله صفاریان، که به دلیل داشتن گنبد مضرس و مخروطی شکل و موقعیت تاریخی، یک مکان مذهبی-ملی مهم محسوب می‌شود.', 4),

-- امامزاده صالح
('امامزاده صالح', 'تهران', 'تهران', 
'{"lat": 35.8052, "lng": 51.4284, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D502..."}', 
'آرامگاه یکی از نوادگان امام موسی کاظم (ع) در منطقه تجریش تهران که یکی از پربازدیدترین اماکن مذهبی پایتخت است و به معماری و کاشی‌کاری‌های زیبای قاجاری شهرت دارد.', 4),

-- کلیسای ننه مریم
('کلیسای ننه مریم', 'ارومیه', 'آذربایجان غربی', 
'{"lat": 37.5540, "lng": 45.0740, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D4812A..."}', 
'یکی از قدیمی‌ترین کلیساهای جهان و از نظر تاریخی و مذهبی برای مسیحیان بسیار حائز اهمیت است و قدمت آن به دوران ساسانی باز می‌گردد.', 4);


--- place_photos (Adding images for all places) ---
INSERT INTO place_photos (place_id, url) VALUES

-- مسجد گوهرشاد
((SELECT place_id FROM places WHERE place_name = 'مسجد گوهرشاد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Goharshad_Mosque_%28Mashhad%29.jpg/1280px-Goharshad_Mosque_%28Mashhad%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد گوهرشاد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Goharshad_Mosque_%281%29.jpg/1280px-Goharshad_Mosque_%281%29.jpg'),

-- حرم حضرت معصومه (س)
((SELECT place_id FROM places WHERE place_name = 'حرم حضرت معصومه (س)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Fatemeh_Masoumeh_Shrine_%28Qom%29.jpg/1280px-Fatemeh_Masoumeh_Shrine_%28Qom%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'حرم حضرت معصومه (س)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Holy_shrine_of_Lady_Fatima_Masumeh_of_Qom_%28Iran%29_-_Main_courtyard_1.jpg/1280px-Holy_shrine_of_Lady_Fatima_Masumeh_of_Qom_%28Iran%29_-_Main_courtyard_1.jpg'),

-- مسجد جمکران
((SELECT place_id FROM places WHERE place_name = 'مسجد جمکران'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jamkaran_Mosque_%28Qom%29.jpg/1280px-Jamkaran_Mosque_%28Qom%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد جمکران'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jamkaran_Mosque_%284%29.jpg/1280px-Jamkaran_Mosque_%284%29.jpg'),

-- شاهچراغ
((SELECT place_id FROM places WHERE place_name = 'شاهچراغ'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_1.jpg/1280px-Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_1.jpg'),
((SELECT place_id FROM places WHERE place_name = 'شاهچراغ'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_-_01.jpg/1280px-Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_-_01.jpg'),

-- آرامگاه حافظ (حافظیه)
((SELECT place_id FROM places WHERE place_name = 'آرامگاه حافظ (حافظیه)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Hafezieh_Tomb_of_Hafez_%28Shiraz%29.jpg/1280px-Hafezieh_Tomb_of_Hafez_%28Shiraz%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه حافظ (حافظیه)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tomb_of_Hafez_1.jpg/1280px-Tomb_of_Hafez_1.jpg'),

-- آستانه سید علاءالدین حسین
((SELECT place_id FROM places WHERE place_name = 'آستانه سید علاءالدین حسین'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg/1280px-Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آستانه سید علاءالدین حسین'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg/1280px-Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg'),

-- آرامگاه سعدی (سعدیه)
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سعدی (سعدیه)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Saadieh_%28Shiraz%29.jpg/1280px-Saadieh_%28Shiraz%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سعدی (سعدیه)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tomb_of_Saadi_%28Shiraz%29_1.jpg/1280px-Tomb_of_Saadi_%28Shiraz%29_1.jpg'),

-- مسجد جامع اصفهان
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع اصفهان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Jameh_Mosque_of_Isfahan.jpg/1280px-Jameh_Mosque_of_Isfahan.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع اصفهان'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Jameh_Mosque_of_Isfahan_%2804%29.jpg/1280px-Jameh_Mosque_of_Isfahan_%2804%29.jpg'),

-- کلیسای وانک
((SELECT place_id FROM places WHERE place_name = 'کلیسای وانک'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Vank_Cathedral_%2802%29.jpg/1280px-Vank_Cathedral_%2802%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلیسای وانک'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Vank_Cathedral_Interior.jpg/1280px-Vank_Cathedral_Interior.jpg'),

-- مسجد آقا بزرگ
((SELECT place_id FROM places WHERE place_name = 'مسجد آقا بزرگ'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Agha_Bozorg_Mosque_and_School_005.jpg/1280px-Agha_Bozorg_Mosque_and_School_005.jpg'),
((SELECT place_id FROM places WHERE place_name = 'مسجد آقا بزرگ'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Agha_Bozorg_Mosque_and_School_005.jpg/1280px-Agha_Bozorg_Mosque_and_School_005.jpg'),

-- آرامگاه سید رکن الدین
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سید رکن الدین'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Seyyed_Rokneddin_Mausoleum_Yazd.jpg/1280px-Seyyed_Rokneddin_Mausoleum_Yazd.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه سید رکن الدین'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Mir_Chakhmagh_Complex_Yazd_Iran.jpg/1280px-Mir_Chakhmagh_Complex_Yazd_Iran.jpg'),

-- آتشکده زرتشتیان یزد
((SELECT place_id FROM places WHERE place_name = 'آتشکده زرتشتیان یزد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Yazd_Atash_Behram.jpg/1280px-Yazd_Atash_Behram.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آتشکده زرتشتیان یزد'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Yazd_Atash_Behram_-_Fire_Temple_%283%29.jpg/1280px-Yazd_Atash_Behram_-_Fire_Temple_%283%29.jpg'),

-- کلیسای سنت استپانوس
((SELECT place_id FROM places WHERE place_name = 'کلیسای سنت استپانوس'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Saint_Stepanos_Monastery_%28Jolfa%29.jpg/1280px-Saint_Stepanos_Monastery_%28Jolfa%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلیسای سنت استپانوس'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/St_Stepanos_Monastery_%28Julfa%29.jpg/1280px-St_Stepanos_Monastery_%28Julfa%29.jpg'),

-- کلیسای مریم مقدس
((SELECT place_id FROM places WHERE place_name = 'کلیسای مریم مقدس'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/St._Mary_Church%2C_Urmia.jpg/1280px-St._Mary_Church%2C_Urmia.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلیسای مریم مقدس'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/St._Mary_Church%2C_Urmia.jpg/1280px-St._Mary_Church%2C_Urmia.jpg'),

-- قره کلیسا (تاتاووس مقدس)
((SELECT place_id FROM places WHERE place_name = 'قره کلیسا (تاتاووس مقدس)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Qara_Kelisa_%28St._Thaddeus_Monastery%29.jpg/1280px-Qara_Kelisa_%28St._Thaddeus_Monastery%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'قره کلیسا (تاتاووس مقدس)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/St._Thaddeus_Monastery_%28Qareh_Kelisa%29.jpg/1280px-St._Thaddeus_Monastery_%28Qareh_Kelisa%29.jpg'),

-- آرامگاه بایزید بسطامی
((SELECT place_id FROM places WHERE place_name = 'آرامگاه بایزید بسطامی'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bayazid_Bistami_Mausoleum.jpg/1280px-Bayazid_Bistami_Mausoleum.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه بایزید بسطامی'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bayazid_Bistami_Mausoleum.jpg/1280px-Bayazid_Bistami_Mausoleum.jpg'),

-- زیارتگاه خالد نبی
((SELECT place_id FROM places WHERE place_name = 'زیارتگاه خالد نبی'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Khaled_Nabi_Cemetery_%282%29.jpg/1280px-Khaled_Nabi_Cemetery_%282%29.jpg'),
((SELECT place_id FROM places WHERE place_name = 'زیارتگاه خالد نبی'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Khaled_Nabi_%28Kalaleh%29_1.jpg/1280px-Khaled_Nabi_%28Kalaleh%29_1.jpg'),

-- آرامگاه دانیال نبی (ع)
((SELECT place_id FROM places WHERE place_name = 'آرامگاه دانیال نبی (ع)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tomb_of_Daniel%2C_Shush%2C_Iran_2.jpg/1280px-Tomb_of_Daniel%2C_Shush%2C_Iran_2.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه دانیال نبی (ع)'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tomb_of_Daniel%2C_Shush%2C_Iran.jpg/1280px-Tomb_of_Daniel%2C_Shush%2C_Iran.jpg'),

-- مسجد جامع شوشتر
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع شوشتر'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG/1280px-Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG'),
((SELECT place_id FROM places WHERE place_name = 'مسجد جامع شوشتر'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG/1280px-Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG'),

-- آرامگاه یعقوب لیث صفاری
((SELECT place_id FROM places WHERE place_name = 'آرامگاه یعقوب لیث صفاری'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Yaqoob_Leith_Saffari_Tomb%2C_Dezful_3.jpg/1280px-Yaqoob_Leith_Saffari_Tomb%2C_Dezful_3.jpg'),
((SELECT place_id FROM places WHERE place_name = 'آرامگاه یعقوب لیث صفاری'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Tomb_of_Ya%27qub_ibn_al-Layth_al-Saffar.jpg/1280px-Tomb_of_Ya%27qub_ibn_al-Layth_al-Saffar.jpg'),

-- امامزاده صالح
((SELECT place_id FROM places WHERE place_name = 'امامزاده صالح'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Imamzadeh_Saleh_%28Tehran%29_02.jpg/1280px-Imamzadeh_Saleh_%28Tehran%29_02.jpg'),
((SELECT place_id FROM places WHERE place_name = 'امامزاده صالح'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Imamzadeh_Saleh_%28Tajrish%29.jpg/1280px-Imamzadeh_Saleh_%28Tajrish%29.jpg'),

-- کلیسای ننه مریم
((SELECT place_id FROM places WHERE place_name = 'کلیسای ننه مریم'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/St._Mary_Church%2C_Urmia.jpg/1280px-St._Mary_Church%2C_Urmia.jpg'),
((SELECT place_id FROM places WHERE place_name = 'کلیسای ننه مریم'), 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/St._Mary_Church_Urmia_interior.jpg/1280px-St._Mary_Church_Urmia_interior.jpg');