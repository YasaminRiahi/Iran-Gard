from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.trip import (
    TripCreate, TripResponse, TripUpdate,
    TripInvitationCreate, TripInvitationResponse,
    TripMemberResponse, TripPlaceCreate, TripPlaceReactCreate, TripPlaceReactResponse
)
from app.crud import trip as trip_crud
from app.crud import friend as friend_crud

router = APIRouter()


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new trip."""
    return trip_crud.create_trip(db, trip=trip, creator_id=current_user.user_id)


@router.get("/my-trips", response_model=List[TripResponse])
def get_my_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all trips where current user is a member."""
    return trip_crud.get_user_trips(db, user_id=current_user.user_id)


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a trip by ID."""
    trip = trip_crud.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    # Check if user is a member
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    return trip


@router.patch("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    trip_update: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update trip details."""
    trip = trip_crud.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    # Only creator can update
    if trip.creator_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only trip creator can update trip"
        )

    return trip_crud.update_trip(db, trip_id=trip_id, trip_update=trip_update)


@router.get("/{trip_id}/members", response_model=List[TripMemberResponse])
def get_trip_members(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all members of a trip."""
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    return trip_crud.get_trip_members(db, trip_id=trip_id)


@router.post("/{trip_id}/invitations", response_model=TripInvitationResponse, status_code=status.HTTP_201_CREATED)
def invite_to_trip(
    trip_id: int,
    invitation: TripInvitationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Invite a user to the trip."""
    # Check if user is a member
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    # Check if invitee is already a member
    if trip_crud.is_trip_member(db, trip_id=trip_id, user_id=invitation.invitee_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member"
        )

    # Optional: Check if users are friends
    if not friend_crud.are_friends(db, current_user.user_id, invitation.invitee_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only invite friends"
        )

    return trip_crud.create_invitation(
        db,
        trip_id=trip_id,
        inviter_id=current_user.user_id,
        invitee_id=invitation.invitee_id
    )


@router.get("/invitations/me", response_model=List[TripInvitationResponse])
def get_my_invitations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all trip invitations for current user."""
    return trip_crud.get_user_invitations(db, user_id=current_user.user_id)


@router.post("/{trip_id}/invitations/accept", status_code=status.HTTP_200_OK)
def accept_invitation(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept a trip invitation."""
    if not trip_crud.accept_invitation(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found"
        )
    return {"message": "Invitation accepted"}


@router.post("/{trip_id}/invitations/reject", status_code=status.HTTP_200_OK)
def reject_invitation(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reject a trip invitation."""
    if not trip_crud.reject_invitation(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found"
        )
    return {"message": "Invitation rejected"}


@router.post("/{trip_id}/places", status_code=status.HTTP_201_CREATED)
def add_place_to_trip(
    trip_id: int,
    place: TripPlaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a place to the trip."""
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    trip_crud.add_place_to_trip(db, trip_id=trip_id, place_id=place.place_id)
    return {"message": "Place added to trip"}


@router.get("/{trip_id}/places")
def get_trip_places(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all places in the trip."""
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    return trip_crud.get_trip_places(db, trip_id=trip_id)


@router.post("/{trip_id}/places/{place_id}/react", response_model=TripPlaceReactResponse)
def react_to_place(
    trip_id: int,
    place_id: int,
    react: TripPlaceReactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add or update reaction to a trip place."""
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    return trip_crud.add_place_react(
        db,
        trip_id=trip_id,
        place_id=place_id,
        user_id=current_user.user_id,
        react_content=react.react_content
    )


@router.get("/{trip_id}/places/{place_id}/reacts", response_model=List[TripPlaceReactResponse])
def get_place_reacts(
    trip_id: int,
    place_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all reactions for a trip place."""
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    return trip_crud.get_place_reacts(db, trip_id=trip_id, place_id=place_id)


@router.get("/{trip_id}/cities", response_model=List[str])
def get_trip_cities(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all cities in the trip."""
    if not trip_crud.is_trip_member(db, trip_id=trip_id, user_id=current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this trip"
        )

    return trip_crud.get_trip_cities(db, trip_id=trip_id)


