import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
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
from app.utils.llm_service import get_llm_service

router = APIRouter()

# ==================== PLACE ENDPOINTS ====================


@router.get("/{place_id}", response_model=PlaceDetailResponse)
def get_place(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get a place by ID with complete detailed information.

    Returns all place fields including:
    - id: place ID
    - title: place name
    - description: place description
    - city_name: city where the place is located
    - province_name: province where the place is located
    - category_id: category ID of the place
    - location: Google Maps coordinates {lat, lng}
    - avg_rating: average rating from reviews (1-5)
    - picture_urls: list of up to 4 photo URLs
    - is_bookmarked: whether current user has bookmarked this place
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
    city_name: Optional[str] = Query(None, description="Filter by city name"),
    province_name: Optional[str] = Query(None, description="Filter by province name"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    skip: int = Query(
        0, ge=0, description="Number of records to skip (pagination offset)"
    ),
    limit: int = Query(
        100, ge=1, le=500, description="Maximum number of results to return"
    ),
    sort_by: str = Query(
        "name",
        description="Field to sort by: 'name' (place name), 'rating' (average rating), 'city' (city name). Default: 'name'",
    ),
    sort_order: str = Query(
        "asc",
        description="Sort order: 'asc' (ascending) or 'desc' (descending). Default: 'asc'",
    ),
    db: Session = Depends(get_db),
):
    """
    Get places with optional filtering and sorting.

    **Filtering:**
    All filters can be combined together:
    - `province_name`: Filter by province name
    - `city_name`: Filter by city name
    - `category_id`: Filter by category ID
    - Can use any combination of these filters (they work together with AND logic)

    **Examples:**
    - `GET /places?city_name=Tehran&category_id=1` - Places in Tehran AND category 1
    - `GET /places?province_name=Tehran&sort_by=rating&sort_order=desc` - All places in Tehran province, sorted by highest rating
    - `GET /places?city_name=Isfahan&category_id=2&sort_by=rating` - Places in Isfahan AND category 2, sorted by rating

    **Sorting:**
    - `sort_by`: Choose field to sort by
      - `name`: Sort by place name (alphabetical)
      - `rating`: Sort by average rating from reviews (1-5)
      - `city`: Sort by city name
      - Default: `name`
    - `sort_order`: Choose sort direction
      - `asc`: Ascending (A-Z, 0-5 for ratings)
      - `desc`: Descending (Z-A, 5-0 for ratings)
      - Default: `asc`

    **Pagination:**
    - `skip`: Number of records to skip
    - `limit`: Maximum number of results (1-500)
    """
    # Validate sort_by parameter
    valid_sort_fields = ["name", "rating", "city"]
    if sort_by.lower() not in valid_sort_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid sort_by value. Must be one of: {', '.join(valid_sort_fields)}",
        )

    # Validate sort_order parameter
    valid_sort_orders = ["asc", "desc"]
    if sort_order.lower() not in valid_sort_orders:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid sort_order value. Must be 'asc' or 'desc'",
        )

    # Use the unified filter function that supports all filter combinations
    return place_crud.get_places_filtered(
        db,
        city_name=city_name,
        province_name=province_name,
        category_id=category_id,
        skip=skip,
        limit=limit,
        sort_by=sort_by.lower(),
        sort_order=sort_order.lower(),
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


@router.get("/{place_id}/review-summary/stream")
def get_review_summary_stream(
    place_id: int,
    db: Session = Depends(get_db),
):
    """
    Get AI-generated summary of place reviews in streaming format.

    Streams the summary as it's being generated by the AI model, allowing the frontend
    to display the text progressively as it arrives.

    The response uses Server-Sent Events (SSE) format with the following JSON chunks:
    - `chunk`: The text piece generated
    - `is_complete`: Boolean indicating if generation is complete
    - `stop_reason`: Reason why generation stopped (only in final chunk)

    Returns:
        StreamingResponse with text/event-stream content type

    Example:
        ```
        GET /places/123/review-summary/stream

        Response events:
        data: {"chunk":"خلاصه بسیار خوب","is_complete":false}
        data: {"chunk":" از نظرات کاربران...","is_complete":false}
        data: {"chunk":"","is_complete":true,"stop_reason":"end_turn"}
        ```
    """

    # Get all reviews for this place
    reviews = place_crud.get_place_reviews(db, place_id=place_id, user_id=None)

    # Extract review text from review dictionaries
    review_texts = [review["review"] for review in reviews if review.get("review")]

    # Get LLM service
    llm_service = get_llm_service()
    if not llm_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="خدمت خلاصه‌سازی هوش مصنوعی در حال حاضر در دسترس نیست.",
        )

    async def stream_summary():
        """Stream the AI summary as it's generated."""
        try:
            for stream_chunk in llm_service.summarize_reviews_stream(review_texts):
                response_data = {
                    "chunk": stream_chunk.chunk,
                    "is_complete": stream_chunk.is_complete,
                }
                if stream_chunk.stop_reason:
                    response_data["stop_reason"] = stream_chunk.stop_reason

                yield f"data: {json.dumps(response_data)}\n\n"
        except Exception as e:
            error_data = {
                "chunk": "",
                "is_complete": True,
                "stop_reason": "error",
                "error": str(e),
            }
            yield f"data: {json.dumps(error_data)}\n\n"

    return StreamingResponse(
        stream_summary(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache"},
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
