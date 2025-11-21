from sqlalchemy.orm import Session
from app.models.friend import Friend, FriendRequest
from typing import List, Optional


def send_friend_request(db: Session, requester_id: int, requestee_id: int) -> FriendRequest:
    """Send a friend request."""
    friend_request = FriendRequest(
        requester_id=requester_id,
        requestee_id=requestee_id
    )
    db.add(friend_request)
    db.commit()
    db.refresh(friend_request)
    return friend_request


def get_friend_request(db: Session, requester_id: int, requestee_id: int) -> Optional[FriendRequest]:
    """Get a specific friend request."""
    return db.query(FriendRequest).filter(
        FriendRequest.requester_id == requester_id,
        FriendRequest.requestee_id == requestee_id
    ).first()


def get_pending_requests(db: Session, user_id: int) -> List[FriendRequest]:
    """Get all pending friend requests for a user."""
    return db.query(FriendRequest).filter(
        FriendRequest.requestee_id == user_id
    ).all()


def get_sent_requests(db: Session, user_id: int) -> List[FriendRequest]:
    """Get all sent friend requests by a user."""
    return db.query(FriendRequest).filter(
        FriendRequest.requester_id == user_id
    ).all()


def delete_friend_request(db: Session, requester_id: int, requestee_id: int) -> bool:
    """Delete a friend request."""
    friend_request = get_friend_request(db, requester_id, requestee_id)
    if friend_request:
        db.delete(friend_request)
        db.commit()
        return True
    return False


def get_friends(db: Session, user_id: int) -> List[Friend]:
    """Get all friends of a user."""
    return db.query(Friend).filter(
        (Friend.user_id1 == user_id) | (Friend.user_id2 == user_id)
    ).all()


def are_friends(db: Session, user_id1: int, user_id2: int) -> bool:
    """Check if two users are friends."""
    min_id = min(user_id1, user_id2)
    max_id = max(user_id1, user_id2)

    friend = db.query(Friend).filter(
        Friend.user_id1 == min_id,
        Friend.user_id2 == max_id
    ).first()

    return friend is not None


def remove_friend(db: Session, user_id1: int, user_id2: int) -> bool:
    """Remove friendship between two users."""
    min_id = min(user_id1, user_id2)
    max_id = max(user_id1, user_id2)

    friend = db.query(Friend).filter(
        Friend.user_id1 == min_id,
        Friend.user_id2 == max_id
    ).first()

    if friend:
        db.delete(friend)
        db.commit()
        return True
    return False

