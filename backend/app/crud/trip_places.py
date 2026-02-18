"""CRUD operations for trip place recommendations and management."""

from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.models.trip import TripLocation, Trip
from app.models.place import Place, PlaceReview, PlacePhoto
from app.models.user import User
from typing import List, Optional, Dict
from app.core.config import settings


# Hardcoded category mapping (since no categories table exists)
CATEGORY_MAP = {"Historical": 1, "Religious": 2, "Entertainment": 3, "Nature": 4}


def get_places_for_trip_with_scoring(
    db: Session, user_id: int, city_names: List[str], trip_id: Optional[int] = None
) -> List[Dict]:
    """
    Get places with intelligent scoring and grouping by city.

    Args:
        db: Database session
        user_id: Current user ID (for personalization)
        city_names: List of city names to filter
        trip_id: Optional trip ID. If provided, excludes places already in the trip.

    Returns:
        List of places grouped by city, sorted by score within each city
    """
    if not city_names:
        return []

    # Get user's favorite categories
    user = db.query(User).filter(User.user_id == user_id).first()
    user_fav_categories = (
        user.favorite_categories if user and user.favorite_categories else []
    )

    # Map category names to IDs using hardcoded mapping
    user_fav_category_ids = [
        CATEGORY_MAP.get(cat) for cat in user_fav_categories if cat in CATEGORY_MAP
    ]

    # Get place IDs already in the trip (if trip_id provided)
    existing_place_ids_query = None
    if trip_id is not None:
        existing_place_ids_query = (
            db.query(TripLocation.place_id)
            .filter(TripLocation.trip_id == trip_id)
            .subquery()
        )

    # Build the main query with scoring
    # Score = user_rating_bonus (2.0) + favorite_category_bonus (1.0) + avg_rating (0-5)

    # Subquery for user's rating on each place
    user_rating_subquery = (
        db.query(PlaceReview.place_id, PlaceReview.rating.label("user_rating"))
        .filter(PlaceReview.user_id == user_id)
        .subquery()
    )

    # Subquery for average rating
    avg_rating_subquery = (
        db.query(PlaceReview.place_id, func.avg(PlaceReview.rating).label("avg_rating"))
        .group_by(PlaceReview.place_id)
        .subquery()
    )

    # Subquery for first photo
    first_photo_subquery = (
        db.query(PlacePhoto.place_id, func.min(PlacePhoto.url).label("first_photo"))
        .group_by(PlacePhoto.place_id)
        .subquery()
    )

    # Build scoring expression
    user_rating_bonus = case(
        (user_rating_subquery.c.user_rating.isnot(None), 2.0), else_=0.0
    )

    # Check if place category is in user's favorites
    favorite_category_bonus = case(
        (
            (Place.category_id.in_(user_fav_category_ids), 1.0)
            if user_fav_category_ids
            else (False, 0.0)
        ),
        else_=0.0,
    )

    # Coalesce avg_rating to 0 if no reviews
    avg_rating_value = func.coalesce(avg_rating_subquery.c.avg_rating, 0.0)

    # Total score
    total_score = (
        user_rating_bonus + favorite_category_bonus + avg_rating_value
    ).label("score")

    # Main query
    query = (
        db.query(
            Place.place_id,
            Place.place_name,
            Place.city_name,
            Place.province_name,
            Place.description,
            Place.category_id,
            Place.place_location,
            avg_rating_subquery.c.avg_rating,
            first_photo_subquery.c.first_photo,
            total_score,
        )
        .outerjoin(
            user_rating_subquery, Place.place_id == user_rating_subquery.c.place_id
        )
        .outerjoin(
            avg_rating_subquery, Place.place_id == avg_rating_subquery.c.place_id
        )
        .outerjoin(
            first_photo_subquery, Place.place_id == first_photo_subquery.c.place_id
        )
        .filter(Place.city_name.in_(city_names))
    )

    # Exclude places already in trip if trip_id is provided
    if existing_place_ids_query is not None:
        query = query.filter(~Place.place_id.in_(existing_place_ids_query))

    query = query.order_by(
        Place.city_name.asc(),  # Group by city
        total_score.desc(),  # Sort by score within each city
    )

    results = query.all()

    # Format results
    places = []
    for row in results:
        # Parse location
        lat = None
        lng = None
        if row.place_location:
            lat = row.place_location.get("lat")
            lng = row.place_location.get("lng")

        photo_url = row.first_photo
        if photo_url and photo_url.startswith("/static"):
            photo_url = f"{settings.SERVER_URL}:{settings.BACKEND_PORT}{settings.API_STR}{photo_url}"

        places.append(
            {
                "place_id": row.place_id,
                "place_name": row.place_name,
                "city_name": row.city_name,
                "province_name": row.province_name,
                "description": row.description,
                "category_id": row.category_id,
                "avg_rating": (
                    round(float(row.avg_rating), 2) if row.avg_rating else None
                ),
                "score": round(float(row.score), 2),
                "lat": lat,
                "lng": lng,
                "first_picture_url": photo_url,
            }
        )

    return places


def auto_generate_trip_places(
    db: Session, trip_id: int, user_id: int, top_n: int, city_names: List[str]
) -> List[Dict]:
    """
    Auto-generate and add top N places per city to a trip.

    Args:
        db: Database session
        trip_id: ID of the trip
        user_id: Current user ID (for personalization)
        top_n: Number of places to select per city
        city_names: List of city names

    Returns:
        List of place dictionaries that were added to the trip
    """
    # Get all available places with scoring (reuse the same function)
    all_places = get_places_for_trip_with_scoring(
        db=db, user_id=user_id, city_names=city_names, trip_id=trip_id
    )

    # Group by city and take top N from each
    places_by_city = {}
    for place in all_places:
        city = place["city_name"]
        if city not in places_by_city:
            places_by_city[city] = []
        places_by_city[city].append(place)

    # Select top N from each city (already sorted by score)
    selected_places = []
    for city, city_places in places_by_city.items():
        top_places = city_places[:top_n]
        selected_places.extend(top_places)

    # Add selected places to trip_locations
    for place in selected_places:
        trip_location = TripLocation(
            trip_id=trip_id, place_id=place["place_id"], visited=False
        )
        db.add(trip_location)

    db.commit()

    return selected_places
