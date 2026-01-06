"""
Trip management endpoints for creating trips, inviting friends, and managing locations.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.deps import get_current_user
from app.crud import trip as trip_crud
from app.crud import place as place_crud
from app.crud import friendship as friendship_crud
from app.crud import user as user_crud
from app.crud import trip_plan as plan_crud
from app.crud import trip_places as trip_places_crud
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.trip import (
    TripResponse, TripCreate, InvitationResponse, TripDetailsResponse,
    AddLocationRequest, VoteLocationRequest, UpdateVisitedRequest, SuccessResponse, AddLocationSuccessResponse, RemoveLocationSuccessResponse,
    VoteSuccessResponse, UpdateVisitedSuccessResponse, IsOwnerResponse,
    GetTripPlacesResponse, TripPlaceResponse, CityPlacesGroup,
    AutoGeneratePlacesRequest, AutoGeneratePlacesResponse
)
from app.schemas.trip_plan import (
    CreatePlanRequest, CreatePlanSuccessResponse, UpdatePlanRequest, UpdatePlanOrderRequest,
    UpdateOrderSuccessResponse, AddLocationToPlanRequest, AddLocationSuccessResponse as PlanAddLocationSuccessResponse,
    DeleteLocationSuccessResponse, DeletePlanSuccessResponse, VotePlanRequest, VotePlanSuccessResponse,
    AutoGeneratePlansRequest, AutoGeneratePlansSuccessResponse, GetPlansResponse
)
from typing import List, Optional
from itertools import groupby
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
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Get detailed information about a specific trip.
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Retrieves complete trip information
    4. Includes list of all participant user IDs
    5. Provides total participant count
    6. Returns complete details for all trip locations with votes and visited status
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip to retrieve
    
    **Errors:**
    - 401: Not authenticated
    - 403: You must be a participant of this trip
    - 404: Trip not found
    
    **Response:** Detailed trip information including participants and complete trip-specific place details
    """
    trip = trip_crud.get_trip_by_id(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    

    # Get participants
    participants_query = db.query(TripParticipant.user_id).filter(
        TripParticipant.trip_id == trip_id
    ).all()
    participant_ids = [p[0] for p in participants_query]
    
    # Get all trip locations with details
    places = trip_crud.get_all_trip_locations_with_details(db, trip_id, current_user.user_id)

    return {
        **trip.__dict__,
        "participants": participant_ids,
        "participants_count": len(participant_ids),
        "places": places
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


# ==================== TRIP PLAN ENDPOINTS ====================

@router.get("/{trip_id}/plans", response_model=GetPlansResponse)
def get_trip_plans(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Get all plans for a trip with their details.
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Retrieves all plans for the trip
    4. For each plan, fetches locations, vote counts, and current user's vote
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Errors:**
    - 403: You must be a participant of this trip
    - 404: Trip not found
    
    **Response:** List of all plans with complete details including locations and votes
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Get all plans for the trip
    plans = plan_crud.get_plans_by_trip(db, trip_id)
    
    # Build response with details for each plan
    plans_data = []
    for plan in plans:
        # Get locations with details
        locations = plan_crud.get_plan_locations(db, plan.plan_id)
        
        # Get vote counts and user vote
        votes = plan_crud.get_plan_vote_counts(db, plan.plan_id)
        user_vote = plan_crud.get_user_vote_on_plan(db, plan.plan_id, current_user.user_id)
        
        plans_data.append({
            "id": plan.plan_id,
            "title": plan.title,
            "city": plan.city_name,
            "locations": locations,
            "votes": votes,
            "userVote": user_vote
        })
    
    return {"plans": plans_data}


@router.post("/{trip_id}/plans", response_model=CreatePlanSuccessResponse)
def create_plan(
        trip_id: int,
        plan_data: CreatePlanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Create a daily plan for a trip.
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Verifies all locations exist
    4. Creates the plan with locations in specified order
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Request Body:**
    - title: Day title (e.g., "روز اول")
    - city: City name
    - locationIds: List of place IDs in order
    
    **Errors:**
    - 400: Empty location list or invalid place IDs
    - 403: You must be a participant of this trip
    - 404: Trip not found
    
    **Response:** Success message with created plan details
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Validate location IDs
    if not plan_data.locationIds:
        raise HTTPException(status_code=400, detail="لیست مکان‌ها نمی‌تواند خالی باشد")
    
    # Verify all places exist
    for place_id in plan_data.locationIds:
        place = place_crud.get_place(db, place_id)
        if not place:
            raise HTTPException(status_code=404, detail=f"مکان با شناسه {place_id} یافت نشد")
    
    # Create the plan
    plan = plan_crud.create_plan(db, trip_id, plan_data.title, plan_data.city, plan_data.locationIds)
    
    # Get locations with details
    locations = plan_crud.get_plan_locations(db, plan.plan_id)
    
    # Get vote counts and user vote
    votes = plan_crud.get_plan_vote_counts(db, plan.plan_id)
    user_vote = plan_crud.get_user_vote_on_plan(db, plan.plan_id, current_user.user_id)
    
    return {
        "success": True,
        "message": "پلن با موفقیت ایجاد شد",
        "data": {
            "id": plan.plan_id,
            "title": plan.title,
            "city": plan.city_name,
            "locations": locations,
            "votes": votes,
            "userVote": user_vote
        }
    }


@router.put("/{trip_id}/plans/{plan_id}", response_model=CreatePlanSuccessResponse)
def update_plan(
        trip_id: int,
        plan_id: int,
        plan_data: UpdatePlanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Update a plan completely - updates title, city, and all locations.
    
    **Flow:**
    1. Validates that the trip and plan exist
    2. Checks that you are a participant of the trip
    3. Verifies the plan belongs to the trip
    4. Validates all location IDs exist
    5. Updates plan title and city
    6. Replaces all locations with the new ordered list
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - plan_id: ID of the plan
    
    **Request Body:**
    - title: Updated plan title
    - city: Updated city name
    - locationIds: Complete ordered list of place IDs (replaces all existing locations)
    
    **Errors:**
    - 400: Empty location list or invalid place IDs
    - 403: You must be a participant of this trip or plan doesn't belong to trip
    - 404: Trip, plan, or place not found
    
    **Response:** Success message with updated plan details
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if plan exists
    plan = plan_crud.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="پلن یافت نشد")
    
    # Verify plan belongs to trip
    if plan.trip_id != trip_id:
        raise HTTPException(status_code=403, detail="این پلن متعلق به این سفر نیست")
    
    # Validate location IDs
    if not plan_data.locationIds:
        raise HTTPException(status_code=400, detail="لیست مکان‌ها نمی‌تواند خالی باشد")
    
    # Verify all places exist
    for place_id in plan_data.locationIds:
        place = place_crud.get_place(db, place_id)
        if not place:
            raise HTTPException(status_code=404, detail=f"مکان با شناسه {place_id} یافت نشد")
    
    # Update the plan
    updated_plan = plan_crud.update_plan(db, plan_id, plan_data.title, plan_data.city, plan_data.locationIds)
    if not updated_plan:
        raise HTTPException(status_code=500, detail="به‌روزرسانی پلن ناموفق بود")
    
    # Get locations with details
    locations = plan_crud.get_plan_locations(db, updated_plan.plan_id)
    
    # Get vote counts and user vote
    votes = plan_crud.get_plan_vote_counts(db, updated_plan.plan_id)
    user_vote = plan_crud.get_user_vote_on_plan(db, updated_plan.plan_id, current_user.user_id)
    
    return {
        "success": True,
        "message": "پلن با موفقیت به‌روز شد",
        "data": {
            "id": updated_plan.plan_id,
            "title": updated_plan.title,
            "city": updated_plan.city_name,
            "locations": locations,
            "votes": votes,
            "userVote": user_vote
        }
    }


@router.put("/{trip_id}/plans/{plan_id}/order", response_model=UpdateOrderSuccessResponse)
def update_plan_order(
        trip_id: int,
        plan_id: int,
        order_data: UpdatePlanOrderRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Update the order of locations in a plan.
    
    **Flow:**
    1. Validates that the trip and plan exist
    2. Checks that you are a participant of the trip
    3. Verifies the plan belongs to the trip
    4. Updates the order of locations based on the provided list
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - plan_id: ID of the plan
    
    **Request Body:**
    - locationIds: Ordered list of place IDs (defines new order)
    
    **Errors:**
    - 400: Empty location list
    - 403: You must be a participant of this trip or plan doesn't belong to trip
    - 404: Trip or plan not found
    
    **Response:** Success message with updated location orders
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if plan exists
    plan = plan_crud.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="پلن یافت نشد")
    
    # Verify plan belongs to trip
    if plan.trip_id != trip_id:
        raise HTTPException(status_code=403, detail="این پلن متعلق به این سفر نیست")
    
    # Validate location IDs
    if not order_data.locationIds:
        raise HTTPException(status_code=400, detail="لیست مکان‌ها نمی‌تواند خالی باشد")
    
    # Update order
    plan_crud.update_plan_order(db, plan_id, order_data.locationIds)
    
    # Get updated locations
    locations = [{"id": place_id, "order": index} for index, place_id in enumerate(order_data.locationIds)]
    
    return {
        "success": True,
        "message": "ترتیب مکان‌ها به‌روز شد",
        "data": {
            "id": plan_id,
            "locations": locations
        }
    }


@router.post("/{trip_id}/plans/{plan_id}/locations", response_model=PlanAddLocationSuccessResponse)
def add_location_to_plan(
        trip_id: int,
        plan_id: int,
        location_data: AddLocationToPlanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Add a location to an existing plan.
    
    **Flow:**
    1. Validates that the trip and plan exist
    2. Checks that you are a participant of the trip
    3. Verifies the plan belongs to the trip
    4. Ensures the place exists and is not already in the plan
    5. Adds the location to the end of the plan
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - plan_id: ID of the plan
    
    **Request Body:**
    - locationId: Place ID to add
    
    **Errors:**
    - 400: Location already exists in plan
    - 403: You must be a participant of this trip or plan doesn't belong to trip
    - 404: Trip, plan, or place not found
    
    **Response:** Success confirmation message
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if plan exists
    plan = plan_crud.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="پلن یافت نشد")
    
    # Verify plan belongs to trip
    if plan.trip_id != trip_id:
        raise HTTPException(status_code=403, detail="این پلن متعلق به این سفر نیست")
    
    # Check if place exists
    place = place_crud.get_place(db, location_data.locationId)
    if not place:
        raise HTTPException(status_code=404, detail="مکان یافت نشد")
    
    # Check if location already in plan
    if plan_crud.is_location_in_plan(db, plan_id, location_data.locationId):
        raise HTTPException(status_code=400, detail="این مکان قبلاً به پلن اضافه شده است")
    
    # Add location
    success = plan_crud.add_location_to_plan(db, plan_id, location_data.locationId)
    if not success:
        raise HTTPException(status_code=500, detail="افزودن مکان ناموفق بود")
    
    return {
        "success": True,
        "message": "مکان به پلن اضافه شد"
    }


@router.delete("/{trip_id}/plans/{plan_id}/locations/{location_id}", response_model=DeleteLocationSuccessResponse)
def remove_location_from_plan(
        trip_id: int,
        plan_id: int,
        location_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Remove a location from a plan.
    
    **Flow:**
    1. Validates that the trip and plan exist
    2. Checks that you are a participant of the trip
    3. Verifies the plan belongs to the trip
    4. Removes the location from the plan
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - plan_id: ID of the plan
    - location_id: ID of the location to remove
    
    **Errors:**
    - 403: You must be a participant of this trip or plan doesn't belong to trip
    - 404: Trip, plan, or location not found in plan
    
    **Response:** Success confirmation message
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if plan exists
    plan = plan_crud.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="پلن یافت نشد")
    
    # Verify plan belongs to trip
    if plan.trip_id != trip_id:
        raise HTTPException(status_code=403, detail="این پلن متعلق به این سفر نیست")
    
    # Remove location
    success = plan_crud.remove_location_from_plan(db, plan_id, location_id)
    if not success:
        raise HTTPException(status_code=404, detail="این مکان در این پلن یافت نشد")
    
    return {
        "success": True,
        "message": "مکان از پلن حذف شد"
    }


@router.delete("/{trip_id}/plans/{plan_id}", response_model=DeletePlanSuccessResponse)
def delete_plan(
        trip_id: int,
        plan_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Delete a plan.
    
    **Flow:**
    1. Validates that the trip and plan exist
    2. Checks that you are a participant of the trip
    3. Verifies the plan belongs to the trip
    4. Deletes the plan and all its locations
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - plan_id: ID of the plan to delete
    
    **Errors:**
    - 403: You must be a participant of this trip or plan doesn't belong to trip
    - 404: Trip or plan not found
    
    **Response:** Success confirmation message
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if plan exists
    plan = plan_crud.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="پلن یافت نشد")
    
    # Verify plan belongs to trip
    if plan.trip_id != trip_id:
        raise HTTPException(status_code=403, detail="این پلن متعلق به این سفر نیست")
    
    # Delete plan
    success = plan_crud.delete_plan(db, plan_id)
    if not success:
        raise HTTPException(status_code=500, detail="حذف پلن ناموفق بود")
    
    return {
        "success": True,
        "message": "پلن با موفقیت حذف شد"
    }


@router.post("/{trip_id}/plans/{plan_id}/vote", response_model=VotePlanSuccessResponse)
def vote_plan(
        trip_id: int,
        plan_id: int,
        vote_data: VotePlanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Vote on a plan (like, dislike, or remove vote).
    
    **Flow:**
    1. Validates that the trip and plan exist
    2. Checks that you are a participant of the trip
    3. Verifies the plan belongs to the trip
    4. Updates or removes your vote
    5. Returns updated vote statistics
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    - plan_id: ID of the plan to vote on
    
    **Request Body:**
    - voteType: 'like', 'dislike', or null to remove vote
    
    **Errors:**
    - 400: Invalid vote type
    - 403: You must be a participant of this trip or plan doesn't belong to trip
    - 404: Trip or plan not found
    
    **Response:** Updated vote counts and your current vote
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if plan exists
    plan = plan_crud.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="پلن یافت نشد")
    
    # Verify plan belongs to trip
    if plan.trip_id != trip_id:
        raise HTTPException(status_code=403, detail="این پلن متعلق به این سفر نیست")
    
    # Validate vote type
    if vote_data.voteType not in [None, "like", "dislike"]:
        raise HTTPException(status_code=400, detail="نوع رای نامعتبر است. باید 'like'، 'dislike' یا null باشد")
    
    # Vote on plan
    plan_crud.vote_plan(db, plan_id, current_user.user_id, vote_data.voteType)
    
    # Get updated vote counts and user vote
    votes = plan_crud.get_plan_vote_counts(db, plan_id)
    user_vote = plan_crud.get_user_vote_on_plan(db, plan_id, current_user.user_id)
    
    return {
        "success": True,
        "data": {
            "votes": votes,
            "userVote": user_vote
        }
    }


@router.post("/{trip_id}/plans/auto-generate", response_model=AutoGeneratePlansSuccessResponse)
def auto_generate_plans(
        trip_id: int,
        request_data: AutoGeneratePlansRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Auto-generate daily plans for a trip based on top-rated locations.
    
    **Algorithm:**
    1. Calculates number of days from trip start_date and end_date
    2. Gets all trip locations with their votes and ratings
    3. Groups locations by city
    4. Sorts by vote score (likes - dislikes), then by average rating
    5. Distributes locations across days:
       - Takes top N from each city for round 1
       - Takes next N from each city for round 2, etc.
       - Keeps plans from same city consecutive
    6. Creates plans with Persian day titles (روز اول, روز دوم, ...)
    
    **Flow:**
    1. Validates that the trip exists
    2. Checks that you are a participant of the trip
    3. Ensures trip has locations to plan
    4. Auto-generates plans based on the algorithm
    5. Returns list of created plans
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Request Body:**
    - locationsPerDay: Number of locations to include per day (must be > 0)
    
    **Errors:**
    - 400: Trip has no locations to plan
    - 403: You must be a participant of this trip
    - 404: Trip not found
    
    **Response:** Success message with list of generated plans
    """
    # Check if trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر یافت نشد")
    
    # Check if user is a participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما باید شرکت‌کننده این سفر باشید")
    
    # Check if trip has locations
    trip_locations = trip_crud.get_trip_place_ids(db, trip_id)
    if not trip_locations:
        raise HTTPException(status_code=400, detail="این سفر هیچ مکانی ندارد")
    
    # Auto-generate plans
    created_plans = plan_crud.auto_generate_plans(db, trip_id, request_data.locationsPerDay)
    
    if not created_plans:
        raise HTTPException(status_code=400, detail="امکان ایجاد پلن وجود ندارد")
    
    # Build response with full plan details
    plans_response = []
    for plan in created_plans:
        locations = plan_crud.get_plan_locations(db, plan.plan_id)
        votes = plan_crud.get_plan_vote_counts(db, plan.plan_id)
        user_vote = plan_crud.get_user_vote_on_plan(db, plan.plan_id, current_user.user_id)
        
        plans_response.append({
            "id": plan.plan_id,
            "title": plan.title,
            "city": plan.city_name,
            "locations": locations,
            "votes": votes,
            "userVote": user_vote
        })
    
    return {
        "success": True,
        "message": f"{len(created_plans)} پلن به صورت خودکار ایجاد شد",
        "data": plans_response
    }


# === Trip Place Recommendation Endpoints ===


@router.post("/{trip_id}/places", response_model=GetTripPlacesResponse)
def get_places_for_trip(
    trip_id: int,
    city_names: Optional[List[str]] = Query(None, description="فیلتر شهرها (اختیاری)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get available places for a trip with intelligent scoring and grouping.
    
    **Flow:**
    1. Validates that the trip exists and user is a participant
    2. Gets available places from specified cities (or all trip cities if not specified)
    3. Excludes places already added to the trip
    4. Scores places based on:
       - User's personal rating (+2 points if user has rated it)
       - User's favorite categories (+1 point if place is in favorites)
       - Average rating from all users (0-5 points)
    5. Groups places by city
    6. Sorts within each city by score (highest first)
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Query Parameters:**
    - city_names: Optional list of city names to filter. If not provided, uses all cities in the trip.
    
    **Errors:**
    - 403: کاربر عضو این سفر نیست
    - 404: سفر پیدا نشد
    - 400: نام شهر نامعتبر است (اگر شهری در سفر موجود نباشد)
    
    **Response:** List of places with scores, grouped by city
    """
    # Validate trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر پیدا نشد")
    
    # Validate user is participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما عضو این سفر نیستید")
    
    # Determine cities to query
    query_cities = city_names if city_names else (trip.city_names or [])
    
    # Validate city_names if provided
    if city_names:
        # Check that all provided cities are in the trip
        trip_cities = set(trip.city_names or [])
        provided_cities = set(city_names)
        invalid_cities = provided_cities - trip_cities
        
        if invalid_cities:
            raise HTTPException(
                status_code=400,
                detail=f"شهرهای زیر در این سفر موجود نیستند: {', '.join(invalid_cities)}"
            )
    
    # Get places with scoring
    places = trip_places_crud.get_places_for_trip_with_scoring(
        db=db,
        user_id=current_user.user_id,
        city_names=query_cities,
        trip_id=trip_id
    )
    
    # Convert to response schema and group by city
    place_responses = [TripPlaceResponse(**place) for place in places]
    
    # Group places by city_name
    cities_grouped = []
    for city_name, city_places in groupby(place_responses, key=lambda p: p.city_name):
        cities_grouped.append(CityPlacesGroup(
            city_name=city_name,
            places=list(city_places)
        ))
    
    return GetTripPlacesResponse(
        cities=cities_grouped,
        total_count=len(place_responses)
    )


@router.post("/{trip_id}/auto-generate-places", response_model=AutoGeneratePlacesResponse)
def auto_generate_trip_places(
    trip_id: int,
    request: AutoGeneratePlacesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Automatically generate and add top places to a trip.
    
    **Flow:**
    1. Validates that the trip exists and user is a participant
    2. Gets top N places per city based on intelligent scoring
    3. Excludes places already in the trip
    4. Adds selected places to the trip
    5. Returns list of added place IDs
    
    **Scoring Algorithm:**
    - Places are scored the same way as in get_places_for_trip endpoint
    - Top N places from each city are selected
    - Places already in trip are excluded
    
    **Authentication:** Required (Bearer token)
    
    **Path Parameters:**
    - trip_id: ID of the trip
    
    **Request Body:**
    - top_n: Number of places to add per city (1-20)
    - city_names: Optional list of cities. If not provided, generates for all trip cities.
    
    **Errors:**
    - 403: کاربر عضو این سفر نیست
    - 404: سفر پیدا نشد
    - 400: نام شهر نامعتبر است یا تعداد مکان‌ها خارج از محدوده است
    
    **Response:** Success message with count and list of added place IDs
    """
    # Validate trip exists
    trip = trip_crud.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="سفر پیدا نشد")
    
    # Validate user is participant
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="شما عضو این سفر نیستید")
    
    # Determine cities to use
    query_cities = request.city_names if request.city_names else (trip.city_names or [])
    
    # Validate city_names if provided
    if request.city_names:
        trip_cities = set(trip.city_names or [])
        provided_cities = set(request.city_names)
        invalid_cities = provided_cities - trip_cities
        
        if invalid_cities:
            raise HTTPException(
                status_code=400,
                detail=f"شهرهای زیر در این سفر موجود نیستند: {', '.join(invalid_cities)}"
            )
    
    # Auto-generate places (CRUD handles filtering and database operations)
    selected_places = trip_places_crud.auto_generate_trip_places(
        db=db,
        trip_id=trip_id,
        user_id=current_user.user_id,
        top_n=request.top_n,
        city_names=query_cities
    )
    
    # Convert to response schema
    place_responses = [TripPlaceResponse(**place) for place in selected_places]
    
    return AutoGeneratePlacesResponse(
        success=True,
        message=f"{len(selected_places)} مکان به طور خودکار به سفر اضافه شد",
        added_count=len(selected_places),
        places=place_responses
    )


@router.post("/preview-places", response_model=GetTripPlacesResponse)
def preview_places_for_cities(
    city_names: List[str] = Query(..., description="لیست شهرها"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Preview available places for given cities with personalized scoring.
    
    **Use Case:** When creating a new trip, preview which places are available
    in the selected cities before actually creating the trip.
    
    **Flow:**
    1. Gets available places from specified cities
    2. NO exclusion of places (no trip context)
    3. Scores places based on:
       - User's personal rating (+2 points if user has rated it)
       - User's favorite categories (+1 point if place is in favorites)
       - Average rating from all users (0-5 points)
    4. Groups places by city
    5. Sorts within each city by score (highest first)
    
    **Authentication:** Required (Bearer token)
    
    **Query Parameters:**
    - city_names: Required list of city names (at least one)
    
    **Errors:**
    - 400: لیست شهرها خالی است
    
    **Response:** List of places with scores, grouped by city
    """
    if not city_names:
        raise HTTPException(status_code=400, detail="لیست شهرها نمی‌تواند خالی باشد")
    
    # Get places with scoring (no trip_id, so no exclusions)
    places = trip_places_crud.get_places_for_trip_with_scoring(
        db=db,
        user_id=current_user.user_id,
        city_names=city_names,
        trip_id=None  # No trip context = no exclusions
    )
    
    # Convert to response schema and group by city
    place_responses = [TripPlaceResponse(**place) for place in places]
    
    # Group places by city_name
    cities_grouped = []
    for city_name, city_places in groupby(place_responses, key=lambda p: p.city_name):
        cities_grouped.append(CityPlacesGroup(
            city_name=city_name,
            places=list(city_places)
        ))
    
    return GetTripPlacesResponse(
        cities=cities_grouped,
        total_count=len(place_responses)
    )

