from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func
from app.models.place import Place, PlacePhoto, PlaceReview, LikedReview, Wishlist
from app.schemas.place import (
    PlaceCreate,
    PlaceDetailResponse,
    PlaceLocation,
)
from typing import List, Optional


# Maximum photos per place
MAX_PHOTOS_PER_PLACE = 4


def create_place(db: Session, place: PlaceCreate) -> Place:
    """Create a new place."""
    db_place = Place(**place.model_dump())
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


def get_place(db: Session, place_id: int) -> Optional[Place]:
    """Get place by ID."""
    return db.query(Place).filter(Place.place_id == place_id).first()


def get_place_detail(
    db: Session, place_id: int, user_id: Optional[int] = None
) -> Optional[PlaceDetailResponse]:
    """
    Get detailed place information for the API response.
    Includes avg_rating, is_bookmarked status, and photo URLs.
    """
    place = db.query(Place).filter(Place.place_id == place_id).first()
    if not place:
        return None

    # Get average rating from reviews
    avg_rating = (
        db.query(sql_func.avg(PlaceReview.rating))
        .filter(PlaceReview.place_id == place_id)
        .scalar()
    )

    # Check if user has bookmarked this place
    is_bookmarked = False
    if user_id:
        bookmark = (
            db.query(Wishlist)
            .filter(Wishlist.user_id == user_id, Wishlist.place_id == place_id)
            .first()
        )
        is_bookmarked = bookmark is not None

    # Get photo URLs (max 4)
    photos = (
        db.query(PlacePhoto)
        .filter(PlacePhoto.place_id == place_id)
        .limit(MAX_PHOTOS_PER_PLACE)
        .all()
    )
    picture_urls = [photo.url for photo in photos]

    # Parse location
    location = None
    if place.place_location:
        try:
            location = PlaceLocation(
                lat=place.place_location.get("lat"), lng=place.place_location.get("lng")
            )
        except (TypeError, KeyError):
            pass

    return PlaceDetailResponse(
        id=place.place_id,
        title=place.place_name,
        description=place.description,
        location=location,
        avg_rating=round(float(avg_rating), 2) if avg_rating else None,
        review_summary=None,  # Placeholder for future AI-generated summary
        is_bookmarked=is_bookmarked,
        picture_urls=picture_urls,
    )


def get_places_by_city(
    db: Session, city_name: str, skip: int = 0, limit: int = 100
) -> List[Place]:
    """Get all places in a city."""
    return (
        db.query(Place)
        .filter(Place.city_name == city_name)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_places_by_category(
    db: Session, category_id: int, skip: int = 0, limit: int = 100
) -> List[Place]:
    """Get all places in a category."""
    return (
        db.query(Place)
        .filter(Place.category_id == category_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_places_by_user_preferences(
    db: Session,
    user_favorite_categories: List[int],
    city_name: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Place]:
    """Get places matching user's favorite categories."""
    query = db.query(Place).filter(Place.category_id.in_(user_favorite_categories))

    if city_name:
        query = query.filter(Place.city_name == city_name)

    return query.offset(skip).limit(limit).all()


def add_photo(db: Session, place_id: int, url: str) -> Optional[PlacePhoto]:
    """Add a photo to a place. Returns None if max photos reached."""
    # Check current photo count
    current_count = db.query(PlacePhoto).filter(PlacePhoto.place_id == place_id).count()
    if current_count >= MAX_PHOTOS_PER_PLACE:
        return None

    photo = PlacePhoto(place_id=place_id, url=url)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


def get_place_photos(db: Session, place_id: int) -> List[PlacePhoto]:
    """Get all photos for a place (max 4)."""
    return (
        db.query(PlacePhoto)
        .filter(PlacePhoto.place_id == place_id)
        .limit(MAX_PHOTOS_PER_PLACE)
        .all()
    )


def create_review(
    db: Session,
    user_id: int,
    place_id: int,
    rating: int,
    review_text: Optional[str] = None,
) -> PlaceReview:
    """
    Create or update a review on a place.
    Each user can only have one review per place - updates existing if found.
    """
    # Check if user already has a review for this place
    existing_review = (
        db.query(PlaceReview)
        .filter(PlaceReview.user_id == user_id, PlaceReview.place_id == place_id)
        .first()
    )

    if existing_review:
        # Update existing review
        existing_review.rating = rating
        existing_review.review = review_text
        db.commit()
        db.refresh(existing_review)
        return existing_review

    # Create new review
    review = PlaceReview(
        user_id=user_id, place_id=place_id, rating=rating, review=review_text
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_review(db: Session, review_id: int) -> Optional[PlaceReview]:
    """Get a review by ID."""
    return db.query(PlaceReview).filter(PlaceReview.review_id == review_id).first()


def get_place_reviews(
    db: Session, place_id: int, user_id: Optional[int] = None
) -> List[dict]:
    """
    Get all reviews for a place with like count and user's like status.

    Args:
        db: Database session
        place_id: Place ID
        user_id: Optional user ID to check if user liked each review

    Returns:
        List of reviews with like_count and is_liked_by_user fields
    """
    reviews = db.query(PlaceReview).filter(PlaceReview.place_id == place_id).all()

    result = []
    for review in reviews:
        # Get like count for this review
        like_count = (
            db.query(LikedReview)
            .filter(LikedReview.review_id == review.review_id)
            .count()
        )

        # Check if current user liked this review
        is_liked_by_user = False
        if user_id:
            user_like = (
                db.query(LikedReview)
                .filter(
                    LikedReview.review_id == review.review_id,
                    LikedReview.user_id == user_id,
                )
                .first()
            )
            is_liked_by_user = user_like is not None

        result.append(
            {
                "review_id": review.review_id,
                "user_id": review.user_id,
                "place_id": review.place_id,
                "rating": review.rating,
                "review": review.review,
                "created_at": review.created_at,
                "like_count": like_count,
                "is_liked_by_user": is_liked_by_user,
            }
        )

    return result


def toggle_review_like(db: Session, user_id: int, review_id: int) -> bool:
    """Toggle like on a review. Returns True if liked, False if unliked."""
    like = (
        db.query(LikedReview)
        .filter(LikedReview.user_id == user_id, LikedReview.review_id == review_id)
        .first()
    )

    if like:
        db.delete(like)
        db.commit()
        return False
    else:
        new_like = LikedReview(user_id=user_id, review_id=review_id)
        db.add(new_like)
        db.commit()
        return True


def add_to_wishlist(db: Session, user_id: int, place_id: int) -> Wishlist:
    """Add a place to user's wishlist."""
    wishlist_item = Wishlist(user_id=user_id, place_id=place_id)
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    return wishlist_item


def remove_from_wishlist(db: Session, user_id: int, place_id: int) -> bool:
    """Remove a place from user's wishlist."""
    wishlist_item = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == user_id, Wishlist.place_id == place_id)
        .first()
    )

    if wishlist_item:
        db.delete(wishlist_item)
        db.commit()
        return True
    return False


def get_user_wishlist(db: Session, user_id: int) -> List[Wishlist]:
    """Get user's wishlist."""
    return db.query(Wishlist).filter(Wishlist.user_id == user_id).all()


def is_place_bookmarked(db: Session, user_id: int, place_id: int) -> bool:
    """Check if a place is bookmarked by user."""
    bookmark = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == user_id, Wishlist.place_id == place_id)
        .first()
    )
    return bookmark is not None


# Rating functions (ratings are part of reviews)
def get_place_avg_rating(db: Session, place_id: int) -> Optional[float]:
    """Get average rating for a place from reviews."""
    avg = (
        db.query(sql_func.avg(PlaceReview.rating))
        .filter(PlaceReview.place_id == place_id)
        .scalar()
    )
    return round(float(avg), 2) if avg else None


def get_place_rating_count(db: Session, place_id: int) -> int:
    """Get total number of reviews/ratings for a place."""
    return db.query(PlaceReview).filter(PlaceReview.place_id == place_id).count()
