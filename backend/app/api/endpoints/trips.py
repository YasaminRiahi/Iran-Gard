"""
Trip management endpoints for creating trips, inviting friends, and managing locations.
"""

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
    VoteLocationRequest, VoteLocationResponse, UpdateVisitedRequest, UpdateVisitedResponse,
    SuccessResponse, AddLocationSuccessResponse, RemoveLocationSuccessResponse,
    VoteSuccessResponse, UpdateVisitedSuccessResponse, IsOwnerResponse
)
from typing import List, Optional
from app.models.trip import TripParticipant, TripInvitation, InvitationStatus
from app.schemas.friendship import FriendInviteDetail


router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/create_trip", response_model=TripResponse)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new trip with selected places and cities.
    
    **Flow:**
    1. Creates a trip with specified dates, cities, and places
    2. Automatically adds the creator as the first participant
    3. Generates a cover image based on selected cities
    
    **Authentication:** Required (Bearer token)
    
    **Errors:**
    - 401: Not authenticated
    - 422: Validation error (invalid dates, empty lists, etc.)
    
    **Response:** Complete trip information including trip_id
    """
    trip = trip_crud.create_trip(db, trip_in, current_user.user_id)
    # Add place_ids from trip_locations
    trip.place_ids = trip_crud.get_trip_place_ids(db, trip.trip_id)
    return trip


@router.post("/invite/{trip_id}/{friend_id}", response_model=InvitationResponse)
def invite_friend(
        trip_id: int, friend_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Invite a friend to join your trip.
    
    **Flow:**
    1. Validates that you are a member of the trip
    2. Checks that the invitee is your friend
    3. Ensures the friend is not already a participant
    4. Creates a pending invitation
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - friend_id: User ID of the friend to invite
    
    **Errors:**
    - 400: Not friends, already a member, or duplicate invitation
    - 403: Not a member of the trip
    - 404: Trip or user not found
    
    **Response:** Invitation details with pending status
    """
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
    """
    Get all trip invitations for the current user.
    
    **Flow:**
    1. Retrieves all pending, accepted, and rejected invitations
    2. Returns invitation details including sender and trip information
    
    **Authentication:** Required (Bearer token)
    
    **Response:** List of all invitations with their status
    """
    return trip_crud.get_user_invitations(db, current_user.user_id)

@router.patch("/invitations/{invitation_id}/respond", response_model=SuccessResponse)
def respond_invite(invitation_id: int, accept: bool, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Accept or reject a trip invitation.
    
    **Flow:**
    1. Validates that the invitation exists and belongs to you
    2. Updates invitation status to ACCEPTED or REJECTED
    3. If accepted, adds you as a trip participant
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - invitation_id: ID of the invitation to respond to
    
    **Query Parameters:**
    - accept: true to accept, false to reject
    
    **Errors:**
    - 404: Invitation not found or not addressed to you
    
    **Response:** Success message
    """
    res = trip_crud.respond_invitation(db, invitation_id, current_user.user_id, accept)
    if not res: raise HTTPException(status_code=404, detail="Invitation not found")
    return {"message": "Success"}

@router.get("/ongoing", response_model=List[TripResponse])
def get_ongoing(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all ongoing trips for the current user.
    
    **Flow:**
    1. Retrieves trips with status ONGOING where you are a participant
    2. Includes all trip details and location information
    
    **Authentication:** Required (Bearer token)
    
    **Response:** List of ongoing trips with complete details
    """
    trips = trip_crud.get_trips_by_time(db, current_user.user_id, ongoing=True)
    # Add place_ids from trip_locations for each trip
    for trip in trips:
        trip.place_ids = trip_crud.get_trip_place_ids(db, trip.trip_id)
    return trips

@router.get("/finished", response_model=List[TripResponse])
def get_finished(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all finished trips for the current user.
    
    **Flow:**
    1. Retrieves trips with status FINISHED where you are a participant
    2. Includes all trip details and location information
    
    **Authentication:** Required (Bearer token)
    
    **Response:** List of finished trips with complete details
    """
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
    Get detailed information about a specific trip.
    
    **Flow:**
    1. Retrieves complete trip information
    2. Includes list of all participant user IDs
    3. Provides total participant count
    4. Returns all trip locations
    
    **Path Parameters:**
    - trip_id: ID of the trip to retrieve
    
    **Errors:**
    - 404: Trip not found
    
    **Response:** Detailed trip information including participants and locations
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
    Get list of friends who can be invited to a specific trip.
    
    **Flow:**
    1. Retrieves your friend list
    2. Filters out friends already in the trip
    3. Filters out friends with pending invitations
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Response:** List of friends available to invite with their details
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
    Get list of all your friends.
    
    **Flow:**
    1. Retrieves complete friend list for the current user
    2. Useful for creating new trips and invitations
    
    **Authentication:** Required (Bearer token)
    
    **Response:** List of all friends with their details
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


@router.post("/{trip_id}/locations", response_model=AddLocationSuccessResponse)
def add_location_to_trip(
        trip_id: int,
        location_data: AddLocationRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Add a location to an existing trip.
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Verifies that the place exists
    4. Ensures the location is not already in the trip
    5. Adds the location with initial vote counts and visited status
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Request Body:**
    - locationId: ID of the place to add
    
    **Errors:**
    - 400: Location already exists in this trip
    - 403: You must be a participant of this trip
    - 404: Trip or place not found
    
    **Response:** Success message with complete location details including votes
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if place exists
    place = place_crud.get_place(db, location_data.locationId)
    if not place:
        raise HTTPException(status_code=404, detail="مکان یافت نشد")
    
    # Check if location already in trip
    if trip_crud.is_location_in_trip(db, trip_id, location_data.locationId):
        raise HTTPException(status_code=400, detail="این مکان قبلاً به سفر اضافه شده است")
    
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


@router.delete("/{trip_id}/locations/{location_id}", response_model=RemoveLocationSuccessResponse)
def remove_location_from_trip(
        trip_id: int,
        location_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Remove a location from a trip.
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Removes the location along with all associated votes
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - location_id: ID of the location to remove
    
    **Errors:**
    - 403: You must be a participant of this trip
    - 404: Trip or location not found in this trip
    
    **Response:** Success confirmation message
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Remove location
    success = trip_crud.remove_location_from_trip(db, trip_id, location_id)
    if not success:
        raise HTTPException(status_code=404, detail="این مکان در این سفر یافت نشد")
    
    return {
        "success": True,
        "message": "مکان با موفقیت حذف شد"
    }


@router.post("/{trip_id}/locations/{location_id}/vote", response_model=VoteSuccessResponse)
def vote_on_location(
        trip_id: int,
        location_id: int,
        vote_data: VoteLocationRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Vote on a trip location (like, dislike, or remove vote).
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Verifies the location exists in the trip
    4. Updates or removes your vote
    5. Returns updated vote statistics
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - location_id: ID of the location to vote on
    
    **Request Body:**
    - voteType: 'like', 'dislike', or null to remove vote
    
    **Errors:**
    - 400: Invalid vote type
    - 403: You must be a participant of this trip
    - 404: Trip or location not found in this trip
    
    **Response:** Updated vote counts and your current vote
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if location exists in trip
    if not trip_crud.is_location_in_trip(db, trip_id, location_id):
        raise HTTPException(status_code=404, detail="این مکان در این سفر یافت نشد")
    
    # Validate vote type
    if vote_data.voteType not in [None, "like", "dislike"]:
        raise HTTPException(status_code=400, detail="نوع رای نامعتبر است. باید 'like'، 'dislike' یا null باشد")
    
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


@router.patch("/{trip_id}/locations/{location_id}/visited", response_model=UpdateVisitedSuccessResponse)
def update_visited_status(
        trip_id: int,
        location_id: int,
        visited_data: UpdateVisitedRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Update visited status for a location (trip owner only).
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are the trip owner (only owner can mark as visited)
    3. Verifies the location exists in the trip
    4. Updates the visited status
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - location_id: ID of the location
    
    **Request Body:**
    - visited: Boolean indicating if the location has been visited
    
    **Errors:**
    - 403: Only trip owner can update visited status
    - 404: Trip or location not found in this trip
    - 500: Failed to update visited status
    
    **Response:** Success message with updated visited status
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is the trip owner
    if trip.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="فقط مالک سفر می‌تواند وضعیت بازدید را تغییر دهد")
    
    # Check if location exists in trip
    if not trip_crud.is_location_in_trip(db, trip_id, location_id):
        raise HTTPException(status_code=404, detail="این مکان در این سفر یافت نشد")
    
    # Update visited status
    success = trip_crud.update_location_visited_status(db, trip_id, location_id, visited_data.visited)
    if not success:
        raise HTTPException(status_code=500, detail="به‌روزرسانی وضعیت بازدید ناموفق بود")
    
    return {
        "success": True,
        "message": "وضعیت بازدید به‌روز شد",
        "data": {
            "visited": visited_data.visited
        }
    }


@router.get("/{trip_id}/is-owner", response_model=IsOwnerResponse)
def check_is_owner(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Check if current user is the owner of the trip.
    
    **Flow:**
    1. Validates that the trip exists
    2. Compares trip owner_id with current user's ID
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Errors:**
    - 404: Trip not found
    
    **Response:** Boolean indicating ownership status
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    is_owner = trip.owner_id == current_user.user_id
    
    return {
        "isOwner": is_owner
    }
