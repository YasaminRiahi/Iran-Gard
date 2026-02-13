from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.trip_plan import TripPlan, TripPlanLocation, TripPlanVote, VoteType
from app.models.place import Place
from typing import List, Optional


def create_plan(db: Session, trip_id: int, title: str, city_name: str, location_ids: List[int]) -> TripPlan:
    """Create a new trip plan with locations."""
    # Create the plan
    plan = TripPlan(
        trip_id=trip_id,
        title=title,
        city_name=city_name
    )
    db.add(plan)
    db.flush()
    
    # Add locations with order
    for index, place_id in enumerate(location_ids):
        plan_location = TripPlanLocation(
            plan_id=plan.plan_id,
            place_id=place_id,
            order=index,
            estimated_time_minutes=120  # Default: 2 hours
        )
        db.add(plan_location)
    
    db.commit()
    db.refresh(plan)
    return plan


def get_plan_by_id(db: Session, plan_id: int) -> Optional[TripPlan]:
    """Get a plan by its ID."""
    return db.query(TripPlan).filter(TripPlan.plan_id == plan_id).first()


def get_plans_by_trip(db: Session, trip_id: int) -> List[TripPlan]:
    """Get all plans for a trip."""
    return db.query(TripPlan).filter(TripPlan.trip_id == trip_id).all()


def get_plan_locations(db: Session, plan_id: int) -> List[dict]:
    """Get all locations for a plan with their details, ordered by order field."""
    locations = db.query(TripPlanLocation, Place).join(
        Place, TripPlanLocation.place_id == Place.place_id
    ).filter(
        TripPlanLocation.plan_id == plan_id
    ).order_by(
        TripPlanLocation.order
    ).all()
    
    result = []
    for plan_location, place in locations:
        # Format estimated time for display
        estimated_time_str = None
        if plan_location.estimated_time_minutes:
            hours = plan_location.estimated_time_minutes // 60
            minutes = plan_location.estimated_time_minutes % 60
            if hours > 0 and minutes > 0:
                estimated_time_str = f"زمان تخمینی: {hours} ساعت و {minutes} دقیقه"
            elif hours > 0:
                estimated_time_str = f"زمان تخمینی: {hours} ساعت"
            else:
                estimated_time_str = f"زمان تخمینی: {minutes} دقیقه"
        
        result.append({
            "id": place.place_id,
            "name": place.place_name,
            "estimatedTime": estimated_time_str,
            "order": plan_location.order
        })
    
    return result


def update_plan(db: Session, plan_id: int, title: str, city_name: str, location_ids: List[int]) -> TripPlan:
    """
    Update a plan completely - updates title, city, and replaces all locations.
    
    This will:
    - Update the plan's title and city
    - Remove all existing locations
    - Add new locations in the specified order
    """
    # Get the plan
    plan = db.query(TripPlan).filter(TripPlan.plan_id == plan_id).first()
    if not plan:
        return None
    
    # Update plan details
    plan.title = title
    plan.city_name = city_name
    
    # Remove all existing locations
    db.query(TripPlanLocation).filter(
        TripPlanLocation.plan_id == plan_id
    ).delete()
    
    # Add new locations with order
    for index, place_id in enumerate(location_ids):
        plan_location = TripPlanLocation(
            plan_id=plan.plan_id,
            place_id=place_id,
            order=index,
            estimated_time_minutes=120  # Default: 2 hours
        )
        db.add(plan_location)
    
    db.commit()
    db.refresh(plan)
    return plan


def update_plan_order(db: Session, plan_id: int, location_ids: List[int]) -> bool:
    """Update the order of locations in a plan."""
    # Get existing plan locations
    existing_locations = db.query(TripPlanLocation).filter(
        TripPlanLocation.plan_id == plan_id
    ).all()
    
    # Create a map of place_id to plan_location
    location_map = {loc.place_id: loc for loc in existing_locations}
    
    # Update order for each location
    for index, place_id in enumerate(location_ids):
        if place_id in location_map:
            location_map[place_id].order = index
    
    db.commit()
    return True


def add_location_to_plan(db: Session, plan_id: int, place_id: int) -> bool:
    """Add a location to a plan."""
    # Check if location already exists
    existing = db.query(TripPlanLocation).filter(
        TripPlanLocation.plan_id == plan_id,
        TripPlanLocation.place_id == place_id
    ).first()
    
    if existing:
        return False
    
    # Get the max order
    max_order = db.query(func.max(TripPlanLocation.order)).filter(
        TripPlanLocation.plan_id == plan_id
    ).scalar() or -1
    
    # Add new location
    plan_location = TripPlanLocation(
        plan_id=plan_id,
        place_id=place_id,
        order=max_order + 1,
        estimated_time_minutes=120  # Default: 2 hours
    )
    db.add(plan_location)
    db.commit()
    return True


def remove_location_from_plan(db: Session, plan_id: int, place_id: int) -> bool:
    """Remove a location from a plan."""
    plan_location = db.query(TripPlanLocation).filter(
        TripPlanLocation.plan_id == plan_id,
        TripPlanLocation.place_id == place_id
    ).first()
    
    if not plan_location:
        return False
    
    db.delete(plan_location)
    db.commit()
    return True


def delete_plan(db: Session, plan_id: int) -> bool:
    """Delete a plan and all its locations."""
    plan = db.query(TripPlan).filter(TripPlan.plan_id == plan_id).first()
    
    if not plan:
        return False
    
    db.delete(plan)
    db.commit()
    return True


def vote_plan(db: Session, plan_id: int, user_id: int, vote_type: Optional[str]) -> None:
    """Vote on a plan. Pass None for vote_type to remove vote."""
    existing_vote = db.query(TripPlanVote).filter(
        TripPlanVote.plan_id == plan_id,
        TripPlanVote.user_id == user_id
    ).first()
    
    if vote_type is None:
        # Remove vote
        if existing_vote:
            db.delete(existing_vote)
            db.commit()
        return
    
    if existing_vote:
        # Update existing vote
        existing_vote.vote_type = VoteType(vote_type)
    else:
        # Create new vote
        new_vote = TripPlanVote(
            plan_id=plan_id,
            user_id=user_id,
            vote_type=VoteType(vote_type)
        )
        db.add(new_vote)
    
    db.commit()


def get_plan_vote_counts(db: Session, plan_id: int) -> dict:
    """Get vote counts for a plan."""
    likes = db.query(func.count(TripPlanVote.user_id)).filter(
        TripPlanVote.plan_id == plan_id,
        TripPlanVote.vote_type == VoteType.LIKE
    ).scalar() or 0
    
    dislikes = db.query(func.count(TripPlanVote.user_id)).filter(
        TripPlanVote.plan_id == plan_id,
        TripPlanVote.vote_type == VoteType.DISLIKE
    ).scalar() or 0
    
    return {"likes": likes, "dislikes": dislikes}


def get_user_vote_on_plan(db: Session, plan_id: int, user_id: int) -> Optional[str]:
    """Get user's vote on a plan. Returns 'like', 'dislike', or None."""
    vote = db.query(TripPlanVote).filter(
        TripPlanVote.plan_id == plan_id,
        TripPlanVote.user_id == user_id
    ).first()
    
    return vote.vote_type.value if vote else None


def is_location_in_plan(db: Session, plan_id: int, place_id: int) -> bool:
    """Check if a location exists in a plan."""
    return db.query(TripPlanLocation).filter(
        TripPlanLocation.plan_id == plan_id,
        TripPlanLocation.place_id == place_id
    ).first() is not None


def is_place_used_in_trip_plans(db: Session, trip_id: int, place_id: int) -> bool:
    """Check if a place is used in any plan of a trip."""
    plan_ids = db.query(TripPlan.plan_id).filter(
        TripPlan.trip_id == trip_id
    ).subquery()
    
    return db.query(TripPlanLocation).filter(
        TripPlanLocation.place_id == place_id,
        TripPlanLocation.plan_id.in_(plan_ids)
    ).first() is not None


def _calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculate approximate distance between two lat/lng points.
    Uses simplified Euclidean distance for nearby locations.
    """
    import math
    # Simple Euclidean distance (good enough for nearby locations)
    return math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2)


def _order_locations_geographically(locations: list) -> list:
    """
    Order locations using nearest neighbor algorithm to minimize travel distance.
    Starts from the first location and always picks the nearest unvisited location.
    """
    if len(locations) <= 1:
        return locations
    
    ordered = [locations[0]]
    remaining = locations[1:]
    
    while remaining:
        last = ordered[-1]
        # Find nearest location to the last one
        nearest = min(remaining, key=lambda loc: _calculate_distance(
            last['lat'], last['lng'], loc['lat'], loc['lng']
        ))
        ordered.append(nearest)
        remaining.remove(nearest)
    
    return ordered


def _order_cities_geographically(city_data: list) -> list:
    """
    Order cities using nearest neighbor algorithm based on their average locations.
    This ensures we visit nearby cities consecutively.
    """
    if len(city_data) <= 1:
        return city_data
    
    ordered = [city_data[0]]
    remaining = city_data[1:]
    
    while remaining:
        last = ordered[-1]
        # Find nearest city to the last one
        nearest = min(remaining, key=lambda city: _calculate_distance(
            last['avg_lat'], last['avg_lng'], city['avg_lat'], city['avg_lng']
        ))
        ordered.append(nearest)
        remaining.remove(nearest)
    
    return ordered


def auto_generate_plans(db: Session, trip_id: int, locations_per_day: int) -> List[TripPlan]:
    """
    Auto-generate daily plans for a trip based on top-rated locations.
    
    Algorithm:
    1. Calculate number of days from trip start_date and end_date
    2. Get all trip locations with votes and ratings
    3. Group locations by city
    4. Sort locations by vote score (likes - dislikes), then by average rating
    5. Distribute locations: take top N from each city, then next N, etc.
    6. Keep plans from same city consecutive
    7. Create plans with Persian day titles
    
    Args:
        db: Database session
        trip_id: Trip ID
        locations_per_day: Number of locations per day/plan
    
    Returns:
        List of created TripPlan objects
    """
    from app.models.trip import Trip, TripLocation, TripLocationVote, VoteType
    from app.models.place import Place, PlaceReview
    from app.models.location import City  # Import City model
    from datetime import datetime
    
    # Get trip details
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        return []
    
    # Calculate number of days (maximum 30 days for Persian titles)
    MAX_DAYS = 30
    num_days = min((trip.end_date - trip.start_date).days + 1, MAX_DAYS)
    
    # Get all trip locations with place details
    trip_locations = db.query(TripLocation, Place).join(
        Place, TripLocation.place_id == Place.place_id
    ).filter(
        TripLocation.trip_id == trip_id
    ).all()
    
    if not trip_locations:
        return []
    
    place_ids = [tl.place_id for tl, _ in trip_locations]
    
    # Get vote counts for all locations (likes - dislikes)
    votes_query = db.query(
        TripLocationVote.place_id,
        TripLocationVote.vote_type,
        func.count(TripLocationVote.user_id).label('count')
    ).filter(
        TripLocationVote.trip_id == trip_id,
        TripLocationVote.place_id.in_(place_ids)
    ).group_by(
        TripLocationVote.place_id,
        TripLocationVote.vote_type
    ).all()
    
    # Calculate vote scores (likes - dislikes)
    vote_scores = {}
    for place_id, vote_type, count in votes_query:
        if place_id not in vote_scores:
            vote_scores[place_id] = 0
        if vote_type == VoteType.LIKE:
            vote_scores[place_id] += count
        elif vote_type == VoteType.DISLIKE:
            vote_scores[place_id] -= count
    
    # Get average ratings for all places
    ratings_query = db.query(
        PlaceReview.place_id,
        func.avg(PlaceReview.rating).label('avg_rating')
    ).filter(
        PlaceReview.place_id.in_(place_ids)
    ).group_by(
        PlaceReview.place_id
    ).all()
    
    avg_ratings = {place_id: float(avg_rating) if avg_rating else 0.0 
                   for place_id, avg_rating in ratings_query}
    
    # Group locations by city and prepare data
    locations_by_city = {}
    for trip_location, place in trip_locations:
        city = place.city_name
        if city not in locations_by_city:
            locations_by_city[city] = []
        
        # Extract lat/lng from place_location JSONB
        lat = place.place_location.get('lat', 0) if place.place_location else 0
        lng = place.place_location.get('lng', 0) if place.place_location else 0
        
        locations_by_city[city].append({
            'place_id': place.place_id,
            'place_name': place.place_name,
            'city_name': city,
            'vote_score': vote_scores.get(place.place_id, 0),
            'avg_rating': avg_ratings.get(place.place_id, 0.0),
            'lat': lat,
            'lng': lng
        })
    
    # Sort locations within each city by vote_score desc, then avg_rating desc
    for city in locations_by_city:
        locations_by_city[city].sort(
            key=lambda x: (-x['vote_score'], -x['avg_rating'])
        )
    
    # Distribute locations across days using round-robin across cities
    # Pass 1: one plan for each city, Pass 2: another plan for each city, etc.
    plans_data = []  # List of {city, location_ids}
    city_names = list(locations_by_city.keys())
    city_indices = {city: 0 for city in city_names}  # Track next location index per city
    
    pass_num = 0
    while len(plans_data) < num_days:
        plans_added_in_pass = 0
        
        # In each pass, try to create one plan for each city
        for city in city_names:
            if len(plans_data) >= num_days:
                break
            
            city_locations = locations_by_city[city]
            start_idx = city_indices[city]
            end_idx = start_idx + locations_per_day
            
            # Get next batch of locations for this city
            batch = city_locations[start_idx:end_idx]
            
            if batch:
                # Order batch locations geographically (nearest neighbor)
                ordered_batch = _order_locations_geographically(batch)
                
                # Calculate average location for this plan
                avg_lat = sum(loc['lat'] for loc in ordered_batch) / len(ordered_batch)
                avg_lng = sum(loc['lng'] for loc in ordered_batch) / len(ordered_batch)
                
                plans_data.append({
                    'city': city,
                    'location_ids': [loc['place_id'] for loc in ordered_batch],
                    'locations': ordered_batch,
                    'avg_lat': avg_lat,
                    'avg_lng': avg_lng
                })
                city_indices[city] = end_idx
                plans_added_in_pass += 1
        
        # If no plans were added in this pass, we've exhausted all locations
        if plans_added_in_pass == 0:
            break
        
        pass_num += 1
    
    from itertools import groupby
    
    # Get one representative plan per city (first plan of each city)
    city_representatives = []
    for city, group in groupby(plans_data, key=lambda x: x['city']):
        city_plans = list(group)
        city_representatives.append({
            'city': city,
            'avg_lat': city_plans[0]['avg_lat'],
            'avg_lng': city_plans[0]['avg_lng'],
            'plans': city_plans
        })
    
    # Order cities geographically using nearest neighbor
    ordered_cities = _order_cities_geographically(city_representatives)
    
    # Flatten back to plans_data in geographical order
    plans_data = []
    for city_data in ordered_cities:
        plans_data.extend(city_data['plans'])
    
    # Persian day number converter
    persian_numbers = [
        "اول", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم",
        "یازدهم", "دوازدهم", "سیزدهم", "چهاردهم", "پانزدهم", "شانزدهم", "هفدهم", 
        "هجدهم", "نوزدهم", "بیستم", "بیست و یکم", "بیست و دوم", "بیست و سوم",
        "بیست و چهارم", "بیست و پنجم", "بیست و ششم", "بیست و هفتم", "بیست و هشتم",
        "بیست و نهم", "سی‌ام"
    ]
    
    # Create plans
    created_plans = []
    for idx, plan_data in enumerate(plans_data):
        if not plan_data['location_ids']:
            continue
        
        day_title = f"روز {persian_numbers[idx]}" if idx < len(persian_numbers) else f"روز {idx + 1}"
        
        plan = create_plan(
            db=db,
            trip_id=trip_id,
            title=day_title,
            city_name=plan_data['city'],
            location_ids=plan_data['location_ids']
        )
        created_plans.append(plan)
    
    return created_plans

