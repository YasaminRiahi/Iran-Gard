from pydantic import BaseModel
from typing import Optional
from datetime import date


class FriendRequestCreate(BaseModel):
    requestee_id: int


class FriendRequestResponse(BaseModel):
    requester_id: int
    requestee_id: int
    request_date: date

    class Config:
        from_attributes = True


class FriendResponse(BaseModel):
    user_id1: int
    user_id2: int

    class Config:
        from_attributes = True

