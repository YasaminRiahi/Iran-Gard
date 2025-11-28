from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.place import Place, Photo
from app.crud.place import create_place, add_photo


def seed_database01():
    """Seed the database with initial data."""
    db = SessionLocal()

    try:

        # --- CATEGORIES ---
        print("Inserting categories...")
        db.execute("""
            INSERT INTO categories (category) VALUES
            ('Historical'),
            ('Religious'),
            ('Entertainment'),
            ('Nature')
            ON CONFLICT DO NOTHING
        """)
        db.commit()

        # --- PROVINCES ---
        print("Inserting provinces...")
        db.execute("""
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
            ('هرمزگان')
            ON CONFLICT DO NOTHING
        """)
        db.commit()

        # --- CITIES ---
        print("Inserting cities...")
        db.execute("""
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
            ('قشم')
            ON CONFLICT DO NOTHING
        """)
        db.commit()

        # Get category IDs
        categories = {}
        result = db.execute(text('SELECT category_id, category FROM categories'))
        for row in result:
            categories[row[1]] = row[0]

        # --- PLACES ---
        print("Inserting places...")

        places_data = [
            # Tehran
            {
                'place_name': 'برج میلاد',
                'city_name': 'تهران',
                'place_location': {
                    "lat": 35.7447,
                    "lon": 51.3729,
                    "url": "https://www.google.com/maps/place/Milad+Tower/@35.7447679,51.3729316,17z"
                },
                'description': 'ششمین برج بلند دنیا و نماد تهران با رستوران‌های گردان و چشم‌انداز 360 درجه از شهر',
                'category_id': categories['Entertainment'],
                'photos': [
                    'https://images.unsplash.com/photo-1613907777135-94e121cdd8f5?q=80&w=2127&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1706303176915-b51ece515aaf?q=80&w=1974&auto=format&fit=crop',
                    'https://www.qaaph.com/uploads/blog/1691147159_banner.jpg',
                    'https://images.pexels.com/photos/3799150/pexels-photo-3799150.jpeg'
                ]
            },
            {
                'place_name': 'کاخ گلستان',
                'city_name': 'تهران',
                'place_location': {
                    "lat": 35.6797,
                    "lon": 51.4179,
                    "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z"
                },
                'description': 'میراث جهانی یونسکو، کاخ سلطنتی دوره قاجار با آینه‌کاری‌های خیره‌کننده و معماری باشکوه',
                'category_id': categories['Historical'],
                'photos': [
                    'https://lp-cms-production.imgix.net/2019-06/GettyImages-500744011_full.jpg',
                    'https://iranmavaa.ir/wp-content/uploads/2018/03/گلستان.png',
                    'https://mrbilit.com/mag/wp-content/uploads/2022/12/Untitled-5-1000x670.jpg',
                    'https://api2.kojaro.com/media/2020-9-2ea11bb2-efa7-4ef7-8f58-a615fb075ad4-67c46106c1067c5ba766c699'
                ]
            },
            {
                'place_name': 'دربند',
                'city_name': 'تهران',
                'place_location': {
                    "lat": 35.8239,
                    "lon": 51.4160,
                    "url": "https://www.google.com/maps/place/Darband,+Tehran"
                },
                'description': 'مسیر کوهنوردی محبوب و منطقه تفریحی در دامنه توچال با رستوران‌های سنتی',
                'category_id': categories['Nature'],
                'photos': [
                    'https://www.jowhareh.com/images/Jowhareh/galleries/poster_a7720489-e488-4579-9e19-adad70efbe14.jpeg',
                    'https://cdn01.eavartravel.com/2023/10/ae1737e2-358d-4c05-aa8e-531c2492d616.jpg'
                ]
            },
            {
                'place_name': 'باغ کتاب',
                'city_name': 'تهران',
                'place_location': {
                    "lat": 35.7524,
                    "lon": 51.4292,
                    "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z"
                },
                'description': 'مجموعه تفریحی-فرهنگی بزرگ با دریاچه و فضای سبز گسترده',
                'category_id': categories['Entertainment'],
                'photos': [
                    'https://respina24.ir/mag/wp-content/uploads/2022/04/bagh-ketab-tehran.jpg',
                    'https://storage.bagheketab.com/2025/02/conversions/باغ-کتاب-01-super_large.webp',
                    'https://storage.bagheketab.com/2025/03/conversions/0308-super_large.webp',
                    'https://orienttrips.com/mag/wp-content/uploads/2025/04/Tehrans-Book-Garden-4-1024x683.jpg',
                    'https://orienttrips.com/mag/wp-content/uploads/2025/04/Tehrans-Book-Garden-7-1024x768.jpg'
                ]
            },
            # Isfahan
            {
                'place_name': 'میدان نقش جهان',
                'city_name': 'اصفهان',
                'place_location': {
                    "lat": 32.6549,
                    "lon": 51.6659,
                    "url": "https://www.google.com/maps/place/Naqsh-e+Jahan+Square/@32.6549395,51.6659974,15z"
                },
                'description': 'یکی از بزرگترین میادین جهان، ثبت شده در یونسکو و احاطه شده با بناهای شگفت‌انگیز صفوی',
                'category_id': categories['Historical'],
                'photos': []
            },
            {
                'place_name': 'مسجد شیخ لطف‌الله',
                'city_name': 'اصفهان',
                'place_location': {
                    "lat": 32.6573,
                    "lon": 51.6760,
                    "url": "https://www.google.com/maps/place/Sheikh+Lotfollah+Mosque/@32.6573516,51.6760732,17z"
                },
                'description': 'شاهکار معماری ایرانی با کاشی‌کاری بی‌نظیر و گنبد منحصر به فرد بدون مناره',
                'category_id': categories['Religious'],
                'photos': []
            },
            {
                'place_name': 'سی‌و‌سه‌پل',
                'city_name': 'اصفهان',
                'place_location': {
                    "lat": 32.6573,
                    "lon": 51.6760,
                    "url": "google.com/maps/place/Isfahan+Province,+Isfahan,+33+Pol"
                },
                'description': 'معروف‌ترین پل اصفهان با 33 دهانه، ساخته شده در دوره صفویه روی زاینده‌رود',
                'category_id': categories['Historical'],
                'photos': []
            },
            # Shiraz
            {
                'place_name': 'تخت جمشید',
                'city_name': 'شیراز',
                'place_location': {
                    "lat": 29.9358,
                    "lon": 52.8672,
                    "url": "https://www.google.com/maps/place/Persepolis/@29.9358685,52.867286,14z"
                },
                'description': 'پایتخت تشریفاتی امپراتوری هخامنشیان، میراث جهانی یونسکو با ویرانه‌های باشکوه',
                'category_id': categories['Historical'],
                'photos': []
            },
            {
                'place_name': 'مسجد نصیرالملک',
                'city_name': 'شیراز',
                'place_location': {
                    "lat": 29.6085,
                    "lon": 52.5459,
                    "url": "https://www.google.com/maps/place/Nasir+al-Mulk+Mosque/@29.6085555,52.5459112,17z"
                },
                'description': 'مسجد صورتی معروف به خاطر پنجره‌های شیشه رنگی که نور رنگین‌کمانی ایجاد می‌کنند',
                'category_id': categories['Religious'],
                'photos': []
            },
            {
                'place_name': 'باغ ارم',
                'city_name': 'شیراز',
                'place_location': {
                    "lat": 29.6369,
                    "lon": 52.5262,
                    "url": "https://www.google.com/maps/place/Eram+Garden/@29.6369281,52.5262973,17z"
                },
                'description': 'باغ فارسی زیبا با عمارت تاریخی، بخشی از مجموعه باغ‌های فارسی یونسکو',
                'category_id': categories['Nature'],
                'photos': []
            },
            {
                'place_name': 'حافظیه',
                'city_name': 'شیراز',
                'place_location': {
                    "lat": 29.6258,
                    "lon": 52.5559,
                    "url": "https://www.google.com/maps/place/Tomb+of+Hafez/@29.6258039,52.5559256,17z"
                },
                'description': 'آرامگاه حافظ شاعر بزرگ ایرانی، مکانی آرام با باغ زیبا و معماری دوره زندیه',
                'category_id': categories['Historical'],
                'photos': []
            },
            # Mashhad
            {
                'place_name': 'حرم امام رضا',
                'city_name': 'مشهد',
                'place_location': {
                    "lat": 36.2878,
                    "lon": 59.6130,
                    "url": "https://www.google.com/maps/place/Imam+Reza+Shrine/@36.2878592,59.6130941,17z"
                },
                'description': 'مقدس‌ترین زیارتگاه ایران و بزرگترین مجموعه مسجد جهان از نظر مساحت',
                'category_id': categories['Religious'],
                'photos': []
            }
        ]

        for place_data in places_data:
            photos = place_data.pop('photos')

            place = Place(**place_data)
            db.add(place)
            db.commit()
            db.refresh(place)

            print(f"Inserted place: {place.place_name}")

            for photo_url in photos:
                add_photo(db, place.place_id, photo_url)

            print(f"  Added {len(photos)} photos")

        print("\nDatabase seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


def costume_query():
    """Example of how to run SELECT queries with SQLAlchemy."""
    db = SessionLocal()

    try:
        # Method 1: Using ORM (Object-Relational Mapping)
        print("\n--- Method 1: Using ORM ---")
        places = db.query(Place).all()
        for place in places:
            print(f"{place.place_id}: {place.place_name}")

        # Method 2: Using raw SQL with execute()
        print("\n--- Method 2: Using raw SQL ---")
        result = db.execute(text('SELECT * FROM places'))
        for row in result:
            print(row)

        # Method 3: Filtering with ORM
        print("\n--- Method 3: Filtering ---")
        tehran_places = db.query(Place).filter(Place.city_name == 'تهران').all()
        for place in tehran_places:
            print(f"{place.place_name} in {place.city_name}")

    finally:
        db.close()


if __name__ == "__main__":

    seed_database01()
    costume_query()
    # db = SessionLocal()
    # result = db.execute(text('SELECT * FROM pg_catalog.pg_tables;'))
    # for row in result:
    #     print(row)
