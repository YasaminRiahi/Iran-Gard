from pydantic import BaseModel


class CityResponse(BaseModel):
    city_name: str

    class Config:
        from_attributes = True


class CityCreate(BaseModel):
    city_name: str

