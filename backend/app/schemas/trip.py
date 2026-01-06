from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional
from app.models.trip import TripStatus, InvitationStatus
from app.schemas.place import PlaceResponse

class TripCreate(BaseModel):
    """
    Trip Creation Request
    
    **Required fields:**
    - start_date: Trip start date in YYYY-MM-DD format
    - end_date: Trip end date in YYYY-MM-DD format (must be after start_date)
    - city_names: List of city names for the trip itinerary
    - place_ids: List of place IDs to be included in the trip
    
    **Optional fields:**
    - cover_image: Custom cover image URL (auto-generated if not provided)
    """
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    city_names: List[str] = Field(..., description="List of cities in the trip")
    place_ids: List[int] = Field(..., description="List of place IDs to include")
    cover_image: Optional[str] = Field(None, description="Custom cover image URL")

class TripResponse(BaseModel):
    """
    Trip Information Response
    
    Contains complete trip details including participants, dates, and locations.
    """
    trip_id: int = Field(..., description="Unique trip identifier")
    owner_id: int = Field(..., description="User ID of the trip creator")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    status: TripStatus = Field(..., description="Trip status: ONGOING or FINISHED")
    city_names: List[str] = Field(..., description="List of cities in the trip")
    place_ids: List[int] = Field(..., description="List of place IDs included in the trip")
    cover_image: Optional[str] = Field(None, description="Trip cover image URL")
    
    class Config:
        from_attributes = True

class InvitationResponse(BaseModel):
    """
    Trip Invitation Response
    
    Contains invitation details for users invited to join a trip.
    """
    invitation_id: int = Field(..., description="Unique invitation identifier")
    trip_id: int = Field(..., description="Trip ID the invitation is for")
    sender_id: int = Field(..., description="User ID who sent the invitation")
    status: InvitationStatus = Field(..., description="Invitation status: PENDING, ACCEPTED, or REJECTED")
    
    class Config:
        from_attributes = True


# Schemas for trip location management
class AddLocationRequest(BaseModel):
    """
    Add Location to Trip Request
    
    **Required fields:**
    - locationId: The place ID to add to the trip
    """
    locationId: int = Field(..., description="Place ID to add to the trip")


class LocationVoteData(BaseModel):
    """
    Location Vote Statistics
    
    Contains vote counts for a trip location.
    """
    likes: int = Field(..., description="Number of likes for this location")
    dislikes: int = Field(..., description="Number of dislikes for this location")


class TripLocationResponse(BaseModel):
    """
    Trip Location Details Response
    
    Contains complete information about a location within a trip including votes and visited status.
    """
    id: int = Field(..., description="Place ID")
    name: str = Field(..., description="Place name")
    category: Optional[str] = Field(None, description="Place category")
    city: Optional[str] = Field(None, description="City name")
    image: Optional[str] = Field(None, description="First photo URL")
    description: Optional[str] = Field(None, description="Place description")
    lat: Optional[float] = Field(None, description="Latitude coordinate")
    lng: Optional[float] = Field(None, description="Longitude coordinate")
    votes: LocationVoteData = Field(..., description="Vote statistics")
    userVote: Optional[str] = Field(None, description="Current user's vote: 'like', 'dislike', or null")
    visited: bool = Field(..., description="Whether the location has been visited")


class TripDetailsResponse(BaseModel):
    """
    Detailed Trip Information Response
    
    Extended trip information including participant list, count, and complete place details with trip-specific data.
    """
    trip_id: int = Field(..., description="Unique trip identifier")
    owner_id: int = Field(..., description="User ID of the trip creator")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    status: TripStatus = Field(..., description="Trip status: ONGOING or FINISHED")
    city_names: List[str] = Field(..., description="List of cities in the trip")
    cover_image: Optional[str] = Field(None, description="Trip cover image URL")
    participants: List[int] = Field(..., description="List of participant user IDs")
    participants_count: int = Field(..., description="Total number of participants")
    places: List[TripLocationResponse] = Field(..., description="Complete details of all trip locations including votes and visited status")

    class Config:
        from_attributes = True


class VoteLocationRequest(BaseModel):
    """
    Vote on Trip Location Request
    
    **Required fields:**
    - voteType: Type of vote ('like', 'dislike', or null to remove vote)
    """
    voteType: Optional[str] = Field(None, description="Vote type: 'like', 'dislike', or null to remove vote")


class VoteLocationResponse(BaseModel):
    """
    Vote Location Response
    
    Contains updated vote information after voting.
    """
    votes: LocationVoteData = Field(..., description="Updated vote statistics")
    userVote: Optional[str] = Field(None, description="Current user's vote after update")


class UpdateVisitedRequest(BaseModel):
    """
    Update Location Visited Status Request
    
    **Required fields:**
    - visited: Boolean indicating if the location has been visited
    """
    visited: bool = Field(..., description="Whether the location has been visited")


class UpdateVisitedResponse(BaseModel):
    """
    Update Visited Status Response
    
    Contains the updated visited status.
    """
    visited: bool = Field(..., description="Updated visited status")


class SuccessResponse(BaseModel):
    """
    Generic Success Response
    
    Standard success message response.
    """
    message: str = Field(..., description="Success message")


class AddLocationSuccessResponse(BaseModel):
    """
    Add Location Success Response
    
    Contains success status, message, and complete location details.
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")
    data: TripLocationResponse = Field(..., description="Added location details")


class RemoveLocationSuccessResponse(BaseModel):
    """
    Remove Location Success Response
    
    Contains success status and confirmation message.
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")


class VoteSuccessResponse(BaseModel):
    """
    Vote Success Response
    
    Contains success status and updated vote information.
    """
    success: bool = Field(..., description="Operation success status")
    data: VoteLocationResponse = Field(..., description="Updated vote information")


class UpdateVisitedSuccessResponse(BaseModel):
    """
    Update Visited Success Response
    
    Contains success status, message, and updated visited status.
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")
    data: UpdateVisitedResponse = Field(..., description="Updated visited status")


class IsOwnerResponse(BaseModel):
    """
    Is Owner Response
    
    Contains boolean indicating if user is the trip owner.
    """
    isOwner: bool = Field(..., description="Whether the current user is the trip owner")


# === Trip Place Recommendation Schemas ===


class TripPlaceResponse(BaseModel):
    """
    Trip Place Response with Scoring
    
    Contains place information with personalized scoring for trip planning.
    """
    place_id: int = Field(..., description="Place ID")
    place_name: str = Field(..., description="Place name")
    city_name: str = Field(..., description="City name")
    province_name: Optional[str] = Field(None, description="Province name")
    description: Optional[str] = Field(None, description="Place description")
    category_id: Optional[int] = Field(None, description="Category ID")
    avg_rating: Optional[float] = Field(None, description="Average rating (1-5)")
    score: float = Field(..., description="Personalized score for sorting")
    lat: Optional[float] = Field(None, description="Latitude coordinate")
    lng: Optional[float] = Field(None, description="Longitude coordinate")
    first_picture_url: Optional[str] = Field(None, description="First photo URL")
    
    class Config:
        from_attributes = True


class GetTripPlacesRequest(BaseModel):
    """
    Get Places for Trip Request
    
    **Optional fields:**
    - city_names: List of city names to filter places. If not provided, uses all cities in the trip.
    """
    city_names: Optional[List[str]] = Field(
        None,
        description="Optional list of city names to filter places. If null, uses trip's cities."
    )


class CityPlacesGroup(BaseModel):
    """
    Places grouped by city
    
    Contains city name and list of places in that city.
    """
    city_name: str = Field(..., description="City name")
    places: List[TripPlaceResponse] = Field(..., description="List of places in this city, sorted by score")


class GetTripPlacesResponse(BaseModel):
    """
    Get Places for Trip Response
    
    Contains places grouped by city and sorted by personalized score within each city.
    """
    cities: List[CityPlacesGroup] = Field(..., description="Places grouped by city")
    total_count: int = Field(..., description="Total number of places returned")


class AutoGeneratePlacesRequest(BaseModel):
    """
    Auto-Generate Trip Places Request
    
    **Required fields:**
    - top_n: Number of top places to select per city (minimum 1, maximum 20)
    
    **Optional fields:**
    - city_names: List of city names. If not provided, generates for all cities in the trip.
    """
    top_n: int = Field(..., ge=1, le=20, description="Number of top places to select per city (1-20)")
    city_names: Optional[List[str]] = Field(
        None,
        description="Optional list of city names. If null, uses all trip cities."
    )


class AutoGeneratePlacesResponse(BaseModel):
    """
    Auto-Generate Places Response
    
    Contains information about the places that were added to the trip.
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")
    added_count: int = Field(..., description="Number of places added")
    places: List[TripPlaceResponse] = Field(..., description="List of places that were added with their details")
