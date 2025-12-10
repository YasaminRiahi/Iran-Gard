from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.models.user import User
from app.schemas.friendship import (
    FriendRequestCreate,
    FriendRequestResponse,
    FriendInfo,
    ReceivedFriendRequestInfo,
    SentFriendRequestInfo,
    FriendRemovalResponse,
    FriendRemoveID,
    FriendshipInfoWithID
)
from app.crud import friendship as crud_friendship

router = APIRouter(prefix="/friendships", tags=["friendships"])

@router.delete("/remove", response_model=FriendRemovalResponse, status_code=status.HTTP_201_CREATED)
def remove_friend(
        request: FriendRemoveID,
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):


    deleted_status = crud_friendship.remove_friend(db, request.friendship_id)
    resp = {"status": deleted_status}
    return resp


@router.post("/request", response_model=FriendRequestResponse, status_code=status.HTTP_201_CREATED)
def send_friend_request(
        request: FriendRequestCreate,
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):

    """Send a friend request to another user by username."""

    # Get the addressee by username
    addressee = crud_friendship.get_user_by_username(db, request.username)
    if not addressee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Can't send request to yourself
    if addressee.user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send friend request to yourself"
        )



    # Check if friendship already exists
    existing_friendship = crud_friendship.get_friendship(
        db, current_user.user_id, addressee.user_id
    )

    if existing_friendship:
        if existing_friendship.status == "accepted":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are already friends with this user"
            )
        if existing_friendship.status == "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A request exists between you and this user"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Friend request already exists"
            )

    # Create friend request
    friendship = crud_friendship.create_friend_request(
        db, current_user.user_id, addressee.user_id
    )

    return friendship


@router.get("/received_pending", response_model=List[ReceivedFriendRequestInfo])
def get_received_pending_requests(
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):
    """Get all received pending friend requests (where current user is the addressee)."""

    pending_requests = crud_friendship.get_received_pending_requests(db, current_user.user_id)

    # Build response with requester info
    result = []
    for friendship in pending_requests:
        requester = db.query(User).filter(User.user_id == friendship.requester_id).first()
        if requester:
            result.append({
                "friendship_id": friendship.friendship_id,
                "requester": {
                    "user_id": requester.user_id,
                    "username": requester.username,
                    "full_name": requester.full_name,
                    "profile_url": requester.profile_url,
                    "about_me": requester.about_me
                },
                "created_at": friendship.created_at
            })

    return result


@router.get("/sent_pending", response_model=List[SentFriendRequestInfo])
def get_sent_pending_requests(
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):
    """Get all sent pending friend requests (where current user is the requester)."""

    pending_requests = crud_friendship.get_sent_pending_requests(db, current_user.user_id)

    # Build response with requester info
    result = []
    for friendship in pending_requests:
        addressee = db.query(User).filter(User.user_id == friendship.addressee_id).first()
        if addressee:
            result.append({
                "friendship_id": friendship.friendship_id,
                "addressee": {
                    "user_id": addressee.user_id,
                    "username": addressee.username,
                    "full_name": addressee.full_name,
                    "profile_url": addressee.profile_url,
                    "about_me": addressee.about_me
                },
                "created_at": friendship.created_at
            })

    return result

@router.post("/accept/{friendship_id}", response_model=FriendRequestResponse)
def accept_request(
        friendship_id: int,
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):
    """Accept a friend request."""

    friendship = crud_friendship.accept_friend_request(db, friendship_id, current_user.user_id)

    if not friendship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found or you don't have permission to accept it"
        )

    return friendship

@router.post("/reject/{friendship_id}", response_model=FriendRequestResponse)
def accept_request(
        friendship_id: int,
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):
    """Reject a friend request."""

    friendship = crud_friendship.reject_friend_request(db, friendship_id, current_user.user_id)

    if not friendship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found or you don't have permission to reject it"
        )

    return friendship


@router.get("/", response_model=List[FriendshipInfoWithID])
def get_friends(
        current_user: User = Depends(deps.get_current_user),
        db: Session = Depends(deps.get_db)
):
    """Get all accepted friends."""

    friends = crud_friendship.get_friends(db, current_user.user_id)

    return [
        {
            "friendship_id":crud_friendship.get_friendship(db,current_user.user_id,friend.user_id).friendship_id,
            "user_id": friend.user_id,
            "username": friend.username,
            "full_name": friend.full_name,
            "profile_url": friend.profile_url,
            "about_me": friend.about_me
        }
        for friend in friends
    ]

#