from pydantic import BaseModel
from typing import Optional, Any
from datetime import date, datetime


class PlaceBase(BaseModel):
    place_name: str
    city_name: str
    place_location: Optional[dict] = None
    description: Optional[str] = None
    category_id: int


class PlaceCreate(PlaceBase):
    pass


class PlaceUpdate(BaseModel):
    place_name: Optional[str] = None
    description: Optional[str] = None
    place_location: Optional[dict] = None


class PlaceResponse(PlaceBase):
    place_id: int

    class Config:
        from_attributes = True


class PhotoCreate(BaseModel):
    url: str


class PhotoResponse(BaseModel):
    photo_num: int
    place_id: int
    url: str

    class Config:
        from_attributes = True


class PlaceCommentCreate(BaseModel):
    comment_content: str


class PlaceCommentResponse(BaseModel):
    comment_id: int
    user_id: int
    place_id: int
    comment_content: str
    created_at: datetime

    class Config:
        from_attributes = True


class WishlistResponse(BaseModel):
    user_id: int
    place_id: int
    added_date: date

    class Config:
        from_attributes = True


class LikeResponse(BaseModel):
    user_id: int
    place_id: int

    class Config:
        from_attributes = True

