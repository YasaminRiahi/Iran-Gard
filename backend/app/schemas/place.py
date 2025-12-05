from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class PlaceLocation(BaseModel):
    """Google Maps location coordinates."""

    lat: float = Field(..., description="Latitude")
    lng: float = Field(..., description="Longitude")


class PlaceBase(BaseModel):
    place_name: str
    city_name: Optional[str] = None
    province_name: Optional[str] = None
    place_location: Optional[PlaceLocation] = None
    description: Optional[str] = None
    category_id: Optional[int] = None


class PlaceCreate(PlaceBase):
    place_name: str  # Only name is required


class PlaceUpdate(BaseModel):
    place_name: Optional[str] = None
    description: Optional[str] = None
    place_location: Optional[PlaceLocation] = None


class PlaceResponse(PlaceBase):
    place_id: int

    class Config:
        from_attributes = True


class PlaceDetailResponse(BaseModel):
    """Detailed place response for GET /places/{id}."""

    id: int
    title: str  # maps to place_name
    description: Optional[str] = None
    location: Optional[PlaceLocation] = None
    avg_rating: Optional[float] = None
    review_summary: Optional[str] = None  # placeholder for future AI summary
    is_bookmarked: bool = False
    picture_urls: List[str] = []  # max 4 URLs

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


class PlaceReviewCreate(BaseModel):
    """Create a review with required rating and optional review text."""

    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 (required)")
    review: Optional[str] = Field(None, description="Optional review text")


class PlaceReviewResponse(BaseModel):
    """Review response."""

    review_id: int
    user_id: int
    place_id: int
    rating: int
    review: Optional[str] = None
    created_at: datetime
    like_count: int = 0
    is_liked_by_user: bool = False

    class Config:
        from_attributes = True


class WishlistResponse(BaseModel):
    user_id: int
    place_id: int
    added_date: date

    class Config:
        from_attributes = True


# ==================== GENERIC RESPONSE SCHEMAS ====================


class ToggleLikeResponse(BaseModel):
    """Response for toggle like endpoint."""

    liked: bool = Field(..., description="True if liked, False if unliked")


class RatingStatsResponse(BaseModel):
    """Response for rating statistics endpoint."""

    avg_rating: Optional[float] = Field(None, description="Average rating (1-5)")
    rating_count: int = Field(0, description="Total number of ratings")


class MessageResponse(BaseModel):
    """Generic message response."""

    message: str
