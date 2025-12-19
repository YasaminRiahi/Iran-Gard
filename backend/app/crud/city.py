from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.location import City
from app.models.place import Place

def get_cities_with_place_counts(db: Session):
    """
    برگرداندن لیست شهرها به همراه تعداد مکان‌ها و آدرس عکس هر شهر
    """
    results = db.query(
        City.city_name,
        City.city_pic_url,
        func.count(Place.place_id).label("places_count")
    ).outerjoin(Place, City.city_name == Place.city_name) \
        .group_by(City.city_name, City.city_pic_url) \
        .all()

    return [
        {
            "city_name": r[0],
            "city_pic_url": r[1],
            "places_count": r[2]
        } for r in results
    ]