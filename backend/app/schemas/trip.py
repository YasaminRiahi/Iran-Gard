from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from app.models.trip import TripStatus, InvitationStatus

class TripCreate(BaseModel):
    start_date: date
    end_date: date
    city_names: List[str]
    place_ids: List[int]
    cover_image: Optional[str] = None

class TripResponse(BaseModel):
    trip_id: int
    owner_id: int
    start_date: date
    end_date: date
    status: TripStatus
    city_names: List[str]
    place_ids: List[int]
    cover_image: Optional[str] = None
    class Config:
        from_attributes = True

class InvitationResponse(BaseModel):
    invitation_id: int
    trip_id: int
    sender_id: int
    status: InvitationStatus
    class Config:
        from_attributes = True


class TripDetailsResponse(TripResponse):
    participants: List[int]
    participants_count: int

    class Config:
        from_attributes = True


# Schemas for trip location management
class AddLocationRequest(BaseModel):
    locationId: int


class LocationVoteData(BaseModel):
    likes: int
    dislikes: int


class TripLocationResponse(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    city: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    votes: LocationVoteData
    userVote: Optional[str] = None
    visited: bool


class VoteLocationRequest(BaseModel):
    voteType: Optional[str] = None


class VoteLocationResponse(BaseModel):
    votes: LocationVoteData
    userVote: Optional[str] = None


class UpdateVisitedRequest(BaseModel):
    visited: bool


class UpdateVisitedResponse(BaseModel):
    visited: bool
