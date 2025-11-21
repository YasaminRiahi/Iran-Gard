"""
Database initialization script with seed data for Iran-Gard
"""
from app.db.session import engine, Base, SessionLocal
from app.models.category import Category
from app.models.city import City


def init_db():
    """Initialize database with seed data."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Seed categories
        print("Seeding categories...")
        categories = [
            "تاریخی",
            "طبیعی",
            "مذهبی",
            "تفریحی",
            "فرهنگی",
            "خرید",
            "رستوران",
            "هتل"
        ]

        for cat_name in categories:
            existing = db.query(Category).filter(Category.category_name == cat_name).first()
            if not existing:
                category = Category(category_name=cat_name)
                db.add(category)

        # Seed major Iranian cities
        print("Seeding cities...")
        cities = [
            "تهران",
            "اصفهان",
            "شیراز",
            "مشهد",
            "تبریز",
            "کرمان",
            "یزد",
            "قم",
            "کاشان",
            "همدان",
            "رشت",
            "کرمانشاه",
            "اهواز",
            "قزوین",
            "سنندج",
            "بندرعباس",
            "زنجان"
        ]

        for city_name in cities:
            existing = db.query(City).filter(City.city_name == city_name).first()
            if not existing:
                city = City(city_name=city_name)
                db.add(city)

        db.commit()
        print("✓ Database initialized successfully!")

    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

