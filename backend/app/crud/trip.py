from sqlalchemy.orm import Session
from app.models.trip import Trip, TripMember, TripInvitation, TripCity, TripPlace
from app.models.trip_package import TripPlaceReact
from app.schemas.trip import TripCreate, TripUpdate
from typing import List, Optional
from datetime import datetime


def create_trip(db: Session, trip: TripCreate, creator_id: int) -> Trip:
    """Create a new trip."""
    db_trip = Trip(
        creator_id=creator_id,
        trip_title=trip.trip_title,
        start_date=trip.start_date,
        end_date=trip.end_date
    )
    db.add(db_trip)
    db.flush()

    # Add creator as member
    trip_member = TripMember(trip_id=db_trip.trip_id, user_id=creator_id)
    db.add(trip_member)

    # Add cities
    for city_name in trip.city_names:
        trip_city = TripCity(trip_id=db_trip.trip_id, city_name=city_name)
        db.add(trip_city)

    db.commit()
    db.refresh(db_trip)
    return db_trip


def get_trip(db: Session, trip_id: int) -> Optional[Trip]:
    """Get trip by ID."""
    return db.query(Trip).filter(Trip.trip_id == trip_id).first()


def get_user_trips(db: Session, user_id: int) -> List[Trip]:
    """Get all trips where user is a member."""
    return db.query(Trip).join(TripMember).filter(
        TripMember.user_id == user_id
    ).all()


def update_trip(db: Session, trip_id: int, trip_update: TripUpdate) -> Optional[Trip]:
    """Update trip details."""
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        return None

    update_data = trip_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_trip, field, value)

    db.commit()
    db.refresh(db_trip)
    return db_trip


def is_trip_member(db: Session, trip_id: int, user_id: int) -> bool:
    """Check if user is a member of the trip."""
    member = db.query(TripMember).filter(
        TripMember.trip_id == trip_id,
        TripMember.user_id == user_id
    ).first()
    return member is not None


def get_trip_members(db: Session, trip_id: int) -> List[TripMember]:
    """Get all members of a trip."""
    return db.query(TripMember).filter(TripMember.trip_id == trip_id).all()


def create_invitation(db: Session, trip_id: int, inviter_id: int, invitee_id: int) -> TripInvitation:
    """Create a trip invitation."""
    invitation = TripInvitation(
        trip_id=trip_id,
        inviter_id=inviter_id,
        invitee_id=invitee_id
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def get_user_invitations(db: Session, user_id: int) -> List[TripInvitation]:
    """Get all trip invitations for a user."""
    return db.query(TripInvitation).filter(
        TripInvitation.invitee_id == user_id
    ).all()


def accept_invitation(db: Session, trip_id: int, user_id: int) -> bool:
    """Accept a trip invitation."""
    invitation = db.query(TripInvitation).filter(
        TripInvitation.trip_id == trip_id,
        TripInvitation.invitee_id == user_id
    ).first()

    if not invitation:
        return False

    # Add user as member
    member = TripMember(trip_id=trip_id, user_id=user_id)
    db.add(member)

    # Delete invitation
    db.delete(invitation)
    db.commit()
    return True


def reject_invitation(db: Session, trip_id: int, user_id: int) -> bool:
    """Reject a trip invitation."""
    invitation = db.query(TripInvitation).filter(
        TripInvitation.trip_id == trip_id,
        TripInvitation.invitee_id == user_id
    ).first()

    if invitation:
        db.delete(invitation)
        db.commit()
        return True
    return False


def add_place_to_trip(db: Session, trip_id: int, place_id: int) -> TripPlace:
    """Add a place to trip."""
    trip_place = TripPlace(trip_id=trip_id, place_id=place_id)
    db.add(trip_place)
    db.commit()
    db.refresh(trip_place)
    return trip_place


def get_trip_places(db: Session, trip_id: int) -> List[TripPlace]:
    """Get all places in a trip."""
    return db.query(TripPlace).filter(TripPlace.trip_id == trip_id).all()


def add_place_react(db: Session, trip_id: int, place_id: int, user_id: int, react_content: str) -> TripPlaceReact:
    """Add or update a reaction to a trip place."""
    react = db.query(TripPlaceReact).filter(
        TripPlaceReact.trip_id == trip_id,
        TripPlaceReact.place_id == place_id,
        TripPlaceReact.user_id == user_id
    ).first()

    if react:
        react.react_content = react_content
    else:
        react = TripPlaceReact(
            trip_id=trip_id,
            place_id=place_id,
            user_id=user_id,
            react_content=react_content
        )
        db.add(react)

    db.commit()
    db.refresh(react)
    return react


def get_place_reacts(db: Session, trip_id: int, place_id: int) -> List[TripPlaceReact]:
    """Get all reactions for a trip place."""
    return db.query(TripPlaceReact).filter(
        TripPlaceReact.trip_id == trip_id,
        TripPlaceReact.place_id == place_id
    ).all()


def get_trip_cities(db: Session, trip_id: int) -> List[str]:
    """Get all cities in a trip."""
    cities = db.query(TripCity).filter(TripCity.trip_id == trip_id).all()
    return [city.city_name for city in cities]

