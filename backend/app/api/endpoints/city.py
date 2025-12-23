from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.city import CityWithPlaceCount
from app.crud import city as city_crud

router = APIRouter(prefix="/city", tags=["city"])

@router.get("/get-cities", response_model=List[CityWithPlaceCount])
def read_cities_with_counts(db: Session = Depends(get_db)):
    """
    لیست تمام شهرها به همراه تعداد مکان‌های دیدنی موجود در هر شهر را برمی‌گرداند.
    """
    return city_crud.get_cities_with_place_counts(db)