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
    first_picture_url: Optional[str] = Field(None, description="URL of the first/main picture")
    avg_rating: Optional[float] = Field(None, description="Average rating from reviews (1-5)")

    class Config:
        from_attributes = True


class PlaceDetailResponse(BaseModel):
    """Detailed place response for GET /places/{id}."""

    id: int = Field(..., description="Place ID")
    title: str = Field(..., description="Place name")
    description: Optional[str] = Field(None, description="Place description")
    location: Optional[PlaceLocation] = Field(None, description="Google Maps coordinates")
    city_name: Optional[str] = Field(None, description="City name")
    province_name: Optional[str] = Field(None, description="Province name")
    category_id: Optional[int] = Field(None, description="Category ID")
    avg_rating: Optional[float] = Field(None, description="Average rating from reviews (1-5)")
    is_bookmarked: bool = Field(False, description="Whether current user has bookmarked this place")
    picture_urls: List[str] = Field(default_factory=list, description="List of up to 4 photo URLs")

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
