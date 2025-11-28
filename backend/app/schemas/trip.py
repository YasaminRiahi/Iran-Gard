from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.models.trip import TripStatus


class TripCreate(BaseModel):
    trip_title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    city_names: List[str] = []


class TripUpdate(BaseModel):
    trip_title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[TripStatus] = None


class TripResponse(BaseModel):
    trip_id: int
    creator_id: int
    trip_title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: TripStatus
    created_at: datetime

    class Config:
        from_attributes = True


class TripInvitationCreate(BaseModel):
    invitee_id: int


class TripInvitationResponse(BaseModel):
    trip_id: int
    inviter_id: int
    invitee_id: int
    invited_at: datetime

    class Config:
        from_attributes = True


class TripMemberResponse(BaseModel):
    trip_id: int
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True


class TripPlaceCreate(BaseModel):
    place_id: int


class TripPlaceReactCreate(BaseModel):
    react_content: str


class TripPlaceReactResponse(BaseModel):
    trip_id: int
    place_id: int
    user_id: int
    react_content: str

    class Config:
        from_attributes = True

