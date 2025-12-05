from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.place import (
    PlaceResponse,
    PlaceDetailResponse,
    PhotoResponse,
    PlaceReviewCreate,
    PlaceReviewResponse,
    WishlistResponse,
    ToggleLikeResponse,
    RatingStatsResponse,
    MessageResponse,
)
from app.crud import place as place_crud

router = APIRouter()

# ==================== PLACE ENDPOINTS ====================


@router.get("/{place_id}", response_model=PlaceDetailResponse)
def get_place(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get a place by ID with detailed information.

    Returns:
    - id: place ID
    - title: place name
    - description: place description
    - location: Google Maps coordinates {lat, lng}
    - avg_rating: average rating (1-5)
    - review_summary: AI-generated summary (placeholder)
    - is_bookmarked: whether current user has bookmarked this place
    - picture_urls: list of up to 4 photo URLs
    """
    user_id = current_user.user_id if current_user else None
    place = place_crud.get_place_detail(db, place_id=place_id, user_id=user_id)

    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="مکان مورد نظر یافت نشد."
        )
    return place


@router.get("", response_model=List[PlaceResponse])
def get_places(
    city_name: Optional[str] = Query(None, description="نام شهر"),
    category_id: Optional[int] = Query(None, description="شناسه دسته‌بندی"),
    skip: int = Query(0, ge=0, description="تعداد رکوردهای رد شده"),
    limit: int = Query(100, ge=1, le=500, description="حداکثر تعداد نتایج"),
    db: Session = Depends(get_db),
):
    """
    Get places with optional filtering:
    - by city
    - by category
    """
    if city_name:
        return place_crud.get_places_by_city(
            db, city_name=city_name, skip=skip, limit=limit
        )
    elif category_id:
        return place_crud.get_places_by_category(
            db, category_id=category_id, skip=skip, limit=limit
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="لطفاً نام شهر یا شناسه دسته‌بندی را وارد کنید.",
        )


# ==================== REVIEW ENDPOINTS ====================


@router.post(
    "/{place_id}/reviews",
    response_model=PlaceReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    place_id: int,
    review: PlaceReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create or update a review on a place with required rating (1-5 stars) and optional review text."""
    # Verify place exists
    place = place_crud.get_place(db, place_id=place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="مکان مورد نظر یافت نشد."
        )

    return place_crud.create_review(
        db,
        user_id=current_user.user_id,
        place_id=place_id,
        rating=review.rating,
        review_text=review.review,
    )


@router.get("/{place_id}/reviews", response_model=List[PlaceReviewResponse])
def get_reviews(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get all reviews for a place.

    If authenticated, also returns whether the current user has liked each review.
    Always returns like_count for each review.
    """
    # Verify place exists
    place = place_crud.get_place(db, place_id=place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="مکان مورد نظر یافت نشد."
        )

    user_id = current_user.user_id if current_user else None
    return place_crud.get_place_reviews(db, place_id=place_id, user_id=user_id)


@router.post(
    "/reviews/{review_id}/like",
    response_model=ToggleLikeResponse,
    status_code=status.HTTP_200_OK,
)
def toggle_review_like(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle like on a review."""
    # Verify review exists
    review = place_crud.get_review(db, review_id=review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="نظر مورد نظر یافت نشد."
        )

    liked = place_crud.toggle_review_like(
        db, user_id=current_user.user_id, review_id=review_id
    )
    return ToggleLikeResponse(liked=liked)


@router.get("/{place_id}/rating/stats", response_model=RatingStatsResponse)
def get_rating_stats(place_id: int, db: Session = Depends(get_db)):
    """Get rating statistics for a place (from reviews with ratings)."""
    # Verify place exists
    place = place_crud.get_place(db, place_id=place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="مکان مورد نظر یافت نشد."
        )

    return RatingStatsResponse(
        avg_rating=place_crud.get_place_avg_rating(db, place_id=place_id),
        rating_count=place_crud.get_place_rating_count(db, place_id=place_id),
    )


# ==================== PHOTO ENDPOINTS ====================


@router.get("/{place_id}/photos", response_model=List[PhotoResponse])
def get_photos(place_id: int, db: Session = Depends(get_db)):
    """Get all photos for a place (max 4)."""
    # Verify place exists
    place = place_crud.get_place(db, place_id=place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="مکان مورد نظر یافت نشد."
        )

    return place_crud.get_place_photos(db, place_id=place_id)


# ==================== BOOKMARK/WISHLIST ENDPOINTS ====================


@router.post(
    "/wishlist/{place_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_to_wishlist(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a place to wishlist (bookmark)."""
    # Verify place exists
    place = place_crud.get_place(db, place_id=place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="مکان مورد نظر یافت نشد."
        )

    # Check if already bookmarked
    if place_crud.is_place_bookmarked(
        db, user_id=current_user.user_id, place_id=place_id
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="این مکان قبلاً به لیست علاقه‌مندی‌ها اضافه شده است.",
        )

    place_crud.add_to_wishlist(db, user_id=current_user.user_id, place_id=place_id)
    return MessageResponse(message="مکان با موفقیت به لیست علاقه‌مندی‌ها اضافه شد.")


@router.delete("/wishlist/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a place from wishlist."""
    if not place_crud.remove_from_wishlist(
        db, user_id=current_user.user_id, place_id=place_id
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="این مکان در لیست علاقه‌مندی‌ها وجود ندارد.",
        )


@router.get("/wishlist/me", response_model=List[WishlistResponse])
def get_my_wishlist(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get current user wishlist."""
    return place_crud.get_user_wishlist(db, user_id=current_user.user_id)
