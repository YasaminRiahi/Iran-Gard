from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from decimal import Decimal


class TripPackageCreate(BaseModel):
    city_name: str
    package_name: Optional[str] = None
    package_date: Optional[date] = None
    places: List[int] = []  # List of place_ids


class TripPackageUpdate(BaseModel):
    package_name: Optional[str] = None
    package_date: Optional[date] = None


class TripPackageResponse(BaseModel):
    package_num: int
    trip_id: int
    city_name: str
    package_name: Optional[str] = None
    package_date: Optional[date] = None

    class Config:
        from_attributes = True


class TripPackagePlaceCreate(BaseModel):
    place_id: int
    preference: Decimal


class TripPackagePlaceResponse(BaseModel):
    package_num: int
    trip_id: int
    place_id: int
    preference: Decimal

    class Config:
        from_attributes = True


class TripPackageReactCreate(BaseModel):
    react_content: str


class TripPackageReactResponse(BaseModel):
    trip_id: int
    package_num: int
    user_id: int
    react_content: str

    class Config:
        from_attributes = True


class AutoPlanRequest(BaseModel):
    """Request for auto-generating trip packages based on preferences"""
    trip_duration_days: int
    max_places_per_day: int = 5

