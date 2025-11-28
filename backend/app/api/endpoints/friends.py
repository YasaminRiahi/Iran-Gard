from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.friend import FriendRequestCreate, FriendRequestResponse, FriendResponse
from app.schemas.user import UserResponse
from app.crud import friend as friend_crud
from app.crud import user as user_crud

router = APIRouter()


@router.post("/requests", response_model=FriendRequestResponse, status_code=status.HTTP_201_CREATED)
def send_friend_request(
    request: FriendRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a friend request."""
    if request.requestee_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send friend request to yourself"
        )

    # Check if users are already friends
    if friend_crud.are_friends(db, current_user.user_id, request.requestee_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already friends"
        )

    # Check if request already exists
    if friend_crud.get_friend_request(db, current_user.user_id, request.requestee_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Friend request already sent"
        )

    friend_request = friend_crud.send_friend_request(
        db,
        requester_id=current_user.user_id,
        requestee_id=request.requestee_id
    )
    return friend_request


@router.get("/requests/pending", response_model=List[FriendRequestResponse])
def get_pending_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all pending friend requests."""
    requests = friend_crud.get_pending_requests(db, user_id=current_user.user_id)
    return requests


@router.get("/requests/sent", response_model=List[FriendRequestResponse])
def get_sent_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all sent friend requests."""
    requests = friend_crud.get_sent_requests(db, user_id=current_user.user_id)
    return requests


@router.delete("/requests/{requester_id}", status_code=status.HTTP_204_NO_CONTENT)
def reject_friend_request(
    requester_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reject a friend request."""
    if not friend_crud.delete_friend_request(db, requester_id, current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found"
        )


@router.get("", response_model=List[UserResponse])
def get_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all friends."""
    friends = friend_crud.get_friends(db, user_id=current_user.user_id)

    # Get friend user objects
    friend_users = []
    for friend in friends:
        friend_id = friend.user_id2 if friend.user_id1 == current_user.user_id else friend.user_id1
        friend_user = user_crud.get_user_by_id(db, user_id=friend_id)
        if friend_user:
            friend_users.append(friend_user)

    return friend_users


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_friend(
    friend_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a friend."""
    if not friend_crud.remove_friend(db, current_user.user_id, friend_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friendship not found"
        )

