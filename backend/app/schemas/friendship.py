from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class FriendRequestCreate(BaseModel):
    """Schema for creating a friend request."""
    username: str = Field(..., min_length=1, max_length=50)



class FriendRequestResponse(BaseModel):
    """Schema for friend request response."""
    friendship_id: int
    requester_id: int
    addressee_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class FriendRemove(BaseModel):
    """Schema for creating a friend request."""
    username: str = Field(..., min_length=1, max_length=50)


class FriendRemovalResponse(BaseModel):
    """Schema for friend request response."""
    status: bool

    class Config:
        from_attributes = True

class FriendInfo(BaseModel):
    """Schema for friend information."""
    user_id: int
    username: str
    full_name: Optional[str]
    profile_url: str
    about_me: Optional[str]

    class Config:
        from_attributes = True


class ReceivedFriendRequestInfo(BaseModel):
    """Schema for received pending friend request with user info."""
    friendship_id: int
    requester: FriendInfo
    created_at: datetime

    class Config:
        from_attributes = True


class SentFriendRequestInfo(BaseModel):
    """Schema for sent pending friend request with user info."""
    friendship_id: int
    addressee: FriendInfo
    created_at: datetime

    class Config:
        from_attributes = True