from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.trip import (
    Trip, TripParticipant, TripInvitation, TripLocation, TripLocationVote,
    TripStatus, InvitationStatus, VoteType
)
from app.schemas.trip import TripCreate

import random

def create_trip(db: Session, trip_in: TripCreate, owner_id: int):
    cover_image_city = random.choice(trip_in.city_names) if trip_in.city_names else None
    cover_image = f"/static/images/cities/{cover_image_city}.jpg"
    db_trip = Trip(
        **trip_in.dict(exclude={"cover_image", "place_ids"}),
        owner_id=owner_id,
        cover_image=cover_image,
    )

    db.add(db_trip)
    db.flush()

    # Add owner as participant
    participant = TripParticipant(
        trip_id=db_trip.trip_id,
        user_id=owner_id
    )
    db.add(participant)

    # Add places to trip_locations
    if trip_in.place_ids:
        for place_id in trip_in.place_ids:
            trip_location = TripLocation(
                trip_id=db_trip.trip_id,
                place_id=place_id,
                visited=False
            )
            db.add(trip_location)

    db.commit()
    db.refresh(db_trip)
    return db_trip


def is_user_in_trip(db: Session, trip_id: int, user_id: int) -> bool:
    """بررسی اینکه آیا کاربر عضو این سفر هست یا خیر"""
    return db.query(TripParticipant).filter(
        TripParticipant.trip_id == trip_id,
        TripParticipant.user_id == user_id
    ).first() is not None


def send_invitation(db: Session, trip_id: int, sender_id: int, receiver_id: int):
    existing = db.query(TripInvitation).filter(
        TripInvitation.trip_id == trip_id,
        TripInvitation.receiver_id == receiver_id,
        TripInvitation.status == InvitationStatus.PENDING
    ).first()

    if existing:
        return None

    invitation = TripInvitation(trip_id=trip_id, sender_id=sender_id, receiver_id=receiver_id)
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation

def get_user_invitations(db: Session, user_id: int):
    return db.query(TripInvitation).filter(TripInvitation.receiver_id == user_id, TripInvitation.status == "pending").all()

def respond_invitation(db: Session, invitation_id: int, user_id: int, accept: bool):
    inv = db.query(TripInvitation).filter(TripInvitation.invitation_id == invitation_id, TripInvitation.receiver_id == user_id).first()
    if not inv: return None
    inv.status = InvitationStatus.ACCEPTED if accept else InvitationStatus.REJECTED
    if accept:
        db.add(TripParticipant(trip_id=inv.trip_id, user_id=user_id))
    db.commit()
    return inv

def get_trips_by_time(db: Session, user_id: int, ongoing: bool):

    trip_ids = db.query(TripParticipant.trip_id).filter(TripParticipant.user_id == user_id).subquery()
    query = db.query(Trip).filter(Trip.trip_id.in_(trip_ids))
    if ongoing:
        return query.filter(Trip.status==TripStatus.ONGOING).all()
    return query.filter(Trip.status==TripStatus.COMPLETED).all()

def get_trip_by_id(db: Session, trip_id: int):
    return db.query(Trip).filter(Trip.trip_id == trip_id).first()


def get_trip_place_ids(db: Session, trip_id: int) -> list[int]:
    """Get list of place IDs for a trip from trip_locations table."""
    locations = db.query(TripLocation.place_id).filter(TripLocation.trip_id == trip_id).all()
    return [loc[0] for loc in locations]


def add_location_to_trip(db: Session, trip_id: int, place_id: int) -> TripLocation:
    """Add a location to a trip."""
    trip_location = TripLocation(
        trip_id=trip_id,
        place_id=place_id,
        visited=False
    )
    db.add(trip_location)
    db.commit()
    db.refresh(trip_location)
    return trip_location


def remove_location_from_trip(db: Session, trip_id: int, place_id: int) -> bool:
    """Remove a location from a trip. Returns True if successful, False if not found."""
    trip_location = db.query(TripLocation).filter(
        TripLocation.trip_id == trip_id,
        TripLocation.place_id == place_id
    ).first()
    
    if not trip_location:
        return False
    
    db.delete(trip_location)
    db.commit()
    return True


def is_location_in_trip(db: Session, trip_id: int, place_id: int) -> bool:
    """Check if a location exists in a trip."""
    return db.query(TripLocation).filter(
        TripLocation.trip_id == trip_id,
        TripLocation.place_id == place_id
    ).first() is not None


def vote_trip_location(db: Session, trip_id: int, place_id: int, user_id: int, vote_type: str):
    """Vote on a trip location. Pass None for vote_type to remove vote."""
    existing_vote = db.query(TripLocationVote).filter(
        TripLocationVote.trip_id == trip_id,
        TripLocationVote.place_id == place_id,
        TripLocationVote.user_id == user_id
    ).first()
    
    if vote_type is None:
        # Remove vote
        if existing_vote:
            db.delete(existing_vote)
            db.commit()
        return None
    
    if existing_vote:
        # Update existing vote
        existing_vote.vote_type = VoteType(vote_type)
    else:
        # Create new vote
        new_vote = TripLocationVote(
            trip_id=trip_id,
            place_id=place_id,
            user_id=user_id,
            vote_type=VoteType(vote_type)
        )
        db.add(new_vote)
    
    db.commit()
    return vote_type


def get_location_vote_counts(db: Session, trip_id: int, place_id: int) -> dict:
    """Get vote counts for a location in a trip."""
    likes = db.query(func.count(TripLocationVote.user_id)).filter(
        TripLocationVote.trip_id == trip_id,
        TripLocationVote.place_id == place_id,
        TripLocationVote.vote_type == VoteType.LIKE
    ).scalar() or 0
    
    dislikes = db.query(func.count(TripLocationVote.user_id)).filter(
        TripLocationVote.trip_id == trip_id,
        TripLocationVote.place_id == place_id,
        TripLocationVote.vote_type == VoteType.DISLIKE
    ).scalar() or 0
    
    return {"likes": likes, "dislikes": dislikes}


def get_user_vote_on_location(db: Session, trip_id: int, place_id: int, user_id: int):
    """Get user's vote on a location. Returns 'like', 'dislike', or None."""
    vote = db.query(TripLocationVote).filter(
        TripLocationVote.trip_id == trip_id,
        TripLocationVote.place_id == place_id,
        TripLocationVote.user_id == user_id
    ).first()
    
    return vote.vote_type.value if vote else None


def update_location_visited_status(db: Session, trip_id: int, place_id: int, visited: bool) -> bool:
    """Update visited status for a location in a trip. Returns True if successful."""
    trip_location = db.query(TripLocation).filter(
        TripLocation.trip_id == trip_id,
        TripLocation.place_id == place_id
    ).first()
    
    if not trip_location:
        return False
    
    trip_location.visited = visited
    db.commit()
    return True


def get_location_visited_status(db: Session, trip_id: int, place_id: int) -> bool:
    """Get visited status for a location in a trip."""
    trip_location = db.query(TripLocation).filter(
        TripLocation.trip_id == trip_id,
        TripLocation.place_id == place_id
    ).first()
    
    return trip_location.visited if trip_location else False


def get_all_trip_locations_with_details(db: Session, trip_id: int, user_id: int):
    """Get all trip locations with their details, votes, and user vote in optimized queries."""
    from app.models.place import Place
    from sqlalchemy.orm import joinedload
    
    trip_locations = db.query(TripLocation, Place).join(
        Place, TripLocation.place_id == Place.place_id
    ).filter(
        TripLocation.trip_id == trip_id
    ).options(
        joinedload(Place.photos)
    ).all()
    
    if not trip_locations:
        return []
    
    place_ids = [tl.place_id for tl, _ in trip_locations]
    
    # Get all votes for these locations in one query
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
    
    # Organize votes by place_id
    votes_by_place = {}
    for place_id, vote_type, count in votes_query:
        if place_id not in votes_by_place:
            votes_by_place[place_id] = {"likes": 0, "dislikes": 0}
        if vote_type == VoteType.LIKE:
            votes_by_place[place_id]["likes"] = count
        elif vote_type == VoteType.DISLIKE:
            votes_by_place[place_id]["dislikes"] = count
    
    # Get user's votes in one query
    user_votes_query = db.query(
        TripLocationVote.place_id,
        TripLocationVote.vote_type
    ).filter(
        TripLocationVote.trip_id == trip_id,
        TripLocationVote.user_id == user_id,
        TripLocationVote.place_id.in_(place_ids)
    ).all()
    
    user_votes = {place_id: vote_type.value for place_id, vote_type in user_votes_query}
    
    # Build response
    locations = []
    for trip_location, place in trip_locations:
        # Parse location coordinates
        lat = None
        lng = None
        if place.place_location:
            lat = place.place_location.get("lat")
            lng = place.place_location.get("lng")
        
        # Get first photo
        first_photo = place.photos[0].url if place.photos else None
        
        # Get votes
        votes = votes_by_place.get(place.place_id, {"likes": 0, "dislikes": 0})
        user_vote = user_votes.get(place.place_id)
        
        locations.append({
            "id": place.place_id,
            "name": place.place_name,
            "category": str(place.category_id) if place.category_id else None,
            "city": place.city_name,
            "image": first_photo,
            "description": place.description,
            "lat": lat,
            "lng": lng,
            "votes": votes,
            "userVote": user_vote,
            "visited": trip_location.visited
        })
    
    return locations
