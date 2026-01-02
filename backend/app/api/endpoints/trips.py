from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.crud import trip as trip_crud
from app.crud import place as place_crud
from app.crud import friendship as friendship_crud
from app.crud import user as user_crud
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.trip import (
    TripResponse, TripCreate, InvitationResponse, TripDetailsResponse,
    AddLocationRequest, TripLocationResponse, LocationVoteData,
    VoteLocationRequest, VoteLocationResponse, UpdateVisitedRequest, UpdateVisitedResponse
)
from typing import List, Optional
from app.models.trip import TripParticipant, TripInvitation, InvitationStatus
from app.schemas.friendship import FriendInviteDetail


router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/create_trip", response_model=TripResponse)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = trip_crud.create_trip(db, trip_in, current_user.user_id)
    # Add place_ids from trip_locations
    trip.place_ids = trip_crud.get_trip_place_ids(db, trip.trip_id)
    return trip


@router.post("/invite/{trip_id}/{friend_id}")
def invite_friend(
        trip_id: int, friend_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="You must be a member of the trip to invite others.")

    if not friendship_crud.are_friends(db, current_user.user_id, friend_id):
        raise HTTPException(status_code=400, detail="You can only invite your friends.")

    if trip_crud.is_user_in_trip(db, trip_id, friend_id):
        raise HTTPException(status_code=400, detail="This friend is already a member of the trip.")

    invitation = trip_crud.send_invitation(db, trip_id, current_user.user_id, friend_id)
    if not invitation:
        raise HTTPException(status_code=400, detail="An invitation is already pending for this friend.")

    return invitation


@router.get("/invitations", response_model=List[InvitationResponse])
def get_my_invitations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return trip_crud.get_user_invitations(db, current_user.user_id)

@router.patch("/invitations/{invitation_id}/respond")
def respond_invite(invitation_id: int, accept: bool, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = trip_crud.respond_invitation(db, invitation_id, current_user.user_id, accept)
    if not res: raise HTTPException(status_code=404, detail="Invitation not found")
    return {"message": "Success"}

@router.get("/ongoing", response_model=List[TripResponse])
def get_ongoing(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trips = trip_crud.get_trips_by_time(db, current_user.user_id, ongoing=True)
    # Add place_ids from trip_locations for each trip
    for trip in trips:
        trip.place_ids = trip_crud.get_trip_place_ids(db, trip.trip_id)
    return trips

@router.get("/finished", response_model=List[TripResponse])
def get_finished(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trips = trip_crud.get_trips_by_time(db, current_user.user_id, ongoing=False)
    # Add place_ids from trip_locations for each trip
    for trip in trips:
        trip.place_ids = trip_crud.get_trip_place_ids(db, trip.trip_id)
    return trips


@router.get("/{trip_id}/details", response_model=TripDetailsResponse)
def get_trip_details(
        trip_id: int,
        db: Session = Depends(get_db)
):
    """
    دریافت اطلاعات کامل سفر به همراه لیست آی‌دی اعضا و تعداد آن‌ها
    """
    trip = trip_crud.get_trip_by_id(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    participants_query = db.query(TripParticipant.user_id).filter(
        TripParticipant.trip_id == trip_id
    ).all()

    participant_ids = [p[0] for p in participants_query]
    
    # Add place_ids from trip_locations
    place_ids = trip_crud.get_trip_place_ids(db, trip_id)

    return {
        **trip.__dict__,
        "place_ids": place_ids,
        "participants": participant_ids,
        "participants_count": len(participant_ids)
    }


#if we decided to let others add too
@router.get("/{trip_id}/available-friends", response_model=List[FriendInviteDetail])
def get_available_friends_for_trip(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    نمایش آی‌دی دوستانی که کاربر می‌تواند به این سفر دعوت کند.
    """
    friends = friendship_crud.get_friends(db, current_user.user_id)
    friend_ids = {f.user_id for f in friends}

    participants = db.query(TripParticipant.user_id).filter(
        TripParticipant.trip_id == trip_id
    ).all()
    participant_ids = {p[0] for p in participants}

    pending_invites = db.query(TripInvitation.receiver_id).filter(
        TripInvitation.trip_id == trip_id,
        TripInvitation.status == InvitationStatus.PENDING
    ).all()
    pending_ids = {i[0] for i in pending_invites}

    available_ids = friend_ids - participant_ids - pending_ids

    available_friends = []
    for cur_id in available_ids:
        user = user_crud.get_user_by_id(db, cur_id)
        available_friends.append(user)

    return available_friends


@router.get("/available-friends", response_model=List[FriendInviteDetail])
def get_available_friends(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    نمایش آی‌دی دوستانی که کاربر می‌تواند به این سفر دعوت کند.
    """
    friends = friendship_crud.get_friends(db, current_user.user_id)
    # friend_ids = {f.user_id for f in friends}
    #
    # available_ids = friend_ids
    #
    # available_friends = []
    # for cur_id in available_ids:
    #     user = user_crud.get_user_by_id(db, cur_id)
    #     available_friends.append(user)
    #
    # return available_friends

    return friends


@router.post("/{trip_id}/locations")
def add_location_to_trip(
        trip_id: int,
        location_data: AddLocationRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    افزودن مکان به سفر
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="You must be a participant of this trip")
    
    # Check if place exists
    place = place_crud.get_place(db, location_data.locationId)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    # Check if location already in trip
    if trip_crud.is_location_in_trip(db, trip_id, location_data.locationId):
        raise HTTPException(status_code=400, detail="Location already exists in this trip")
    
    # Add location
    trip_crud.add_location_to_trip(db, trip_id, location_data.locationId)
    
    # Get vote counts and user vote
    votes = trip_crud.get_location_vote_counts(db, trip_id, location_data.locationId)
    user_vote = trip_crud.get_user_vote_on_location(db, trip_id, location_data.locationId, current_user.user_id)
    visited = trip_crud.get_location_visited_status(db, trip_id, location_data.locationId)
    
    # Parse location coordinates
    lat = None
    lng = None
    if place.place_location:
        lat = place.place_location.get("lat")
        lng = place.place_location.get("lng")
    
    # Get first photo
    first_photo = place.photos[0].url if place.photos else None
    
    return {
        "success": True,
        "message": "مکان با موفقیت اضافه شد",
        "data": {
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
            "visited": visited
        }
    }


@router.delete("/{trip_id}/locations/{location_id}")
def remove_location_from_trip(
        trip_id: int,
        location_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    حذف مکان از سفر
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="You must be a participant of this trip")
    
    # Remove location
    success = trip_crud.remove_location_from_trip(db, trip_id, location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found in this trip")
    
    return {
        "success": True,
        "message": "مکان با موفقیت حذف شد"
    }


@router.post("/{trip_id}/locations/{location_id}/vote")
def vote_on_location(
        trip_id: int,
        location_id: int,
        vote_data: VoteLocationRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    رای دادن به مکان در سفر (like, dislike, یا null برای حذف رای)
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="You must be a participant of this trip")
    
    # Check if location exists in trip
    if not trip_crud.is_location_in_trip(db, trip_id, location_id):
        raise HTTPException(status_code=404, detail="Location not found in this trip")
    
    # Validate vote type
    if vote_data.voteType not in [None, "like", "dislike"]:
        raise HTTPException(status_code=400, detail="Invalid vote type. Must be 'like', 'dislike', or null")
    
    # Add/update/remove vote
    trip_crud.vote_trip_location(db, trip_id, location_id, current_user.user_id, vote_data.voteType)
    
    # Get updated vote counts and user vote
    votes = trip_crud.get_location_vote_counts(db, trip_id, location_id)
    user_vote = trip_crud.get_user_vote_on_location(db, trip_id, location_id, current_user.user_id)
    
    return {
        "success": True,
        "data": {
            "votes": votes,
            "userVote": user_vote
        }
    }


@router.patch("/{trip_id}/locations/{location_id}/visited")
def update_visited_status(
        trip_id: int,
        location_id: int,
        visited_data: UpdateVisitedRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    تغییر وضعیت بازدید مکان (فقط مالک سفر)
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if user is the trip owner
    if trip.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Only trip owner can update visited status")
    
    # Check if location exists in trip
    if not trip_crud.is_location_in_trip(db, trip_id, location_id):
        raise HTTPException(status_code=404, detail="Location not found in this trip")
    
    # Update visited status
    success = trip_crud.update_location_visited_status(db, trip_id, location_id, visited_data.visited)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update visited status")
    
    return {
        "success": True,
        "message": "وضعیت بازدید به‌روز شد",
        "data": {
            "visited": visited_data.visited
        }
    }


@router.get("/{trip_id}/is-owner")
def check_is_owner(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    بررسی اینکه آیا کاربر جاری مالک این سفر است
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    is_owner = trip.owner_id == current_user.user_id
    
    return {
        "isOwner": is_owner
    }
