from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.friendship import Friendship, FriendshipStatus
from app.models.user import User
from typing import List, Optional


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username."""
    return db.query(User).filter(User.username == username).first()


def create_friend_request(db: Session, requester_id: int, addressee_id: int) -> Friendship:
    """Create a friend request."""
    db_friendship = Friendship(
        requester_id=requester_id,
        addressee_id=addressee_id,
        status=FriendshipStatus.PENDING
    )
    db.add(db_friendship)
    db.commit()
    db.refresh(db_friendship)
    return db_friendship


def get_friendship(db: Session, user1_id: int, user2_id: int) -> Optional[Friendship]:
    """Check if friendship exists between two users (in any direction)."""
    return db.query(Friendship).filter(
        or_(
            and_(Friendship.requester_id == user1_id, Friendship.addressee_id == user2_id),
            and_(Friendship.requester_id == user2_id, Friendship.addressee_id == user1_id)
        )
    ).first()


def get_pending_requests(db: Session, user_id: int) -> List[Friendship]:
    """Get all pending friend requests for a user (where user is addressee)."""
    return db.query(Friendship).filter(
        Friendship.addressee_id == user_id,
        Friendship.status == FriendshipStatus.PENDING
    ).all()


def accept_friend_request(db: Session, friendship_id: int, user_id: int) -> Optional[Friendship]:
    """Accept a friend request."""
    friendship = db.query(Friendship).filter(
        Friendship.friendship_id == friendship_id,
        Friendship.addressee_id == user_id,
        Friendship.status == FriendshipStatus.PENDING
    ).first()

    if friendship:
        friendship.status = FriendshipStatus.ACCEPTED
        db.commit()
        db.refresh(friendship)

    return friendship


def get_friends(db: Session, user_id: int) -> List[User]:
    """Get all accepted friends for a user."""
    # Get friendships where user is either requester or addressee and status is accepted
    friendships = db.query(Friendship).filter(
        or_(
            Friendship.requester_id == user_id,
            Friendship.addressee_id == user_id
        ),
        Friendship.status == FriendshipStatus.ACCEPTED
    ).all()

    # Extract friend user IDs
    friend_ids = []
    for friendship in friendships:
        if friendship.requester_id == user_id:
            friend_ids.append(friendship.addressee_id)
        else:
            friend_ids.append(friendship.requester_id)

    # Get user objects
    friends = db.query(User).filter(User.user_id.in_(friend_ids)).all()
    return friends