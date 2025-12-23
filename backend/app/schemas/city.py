
from pydantic import BaseModel

class CityWithPlaceCount(BaseModel):
    city_name: str
    places_count: int
    city_pic_url: str

    class Config:
        from_attributes = True