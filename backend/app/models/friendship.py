import enum
from sqlalchemy import Column, BigInteger, String, Enum, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class FriendshipStatus(str, enum.Enum):
    """Friendship status enum."""
    PENDING = "pending"
    ACCEPTED = "accepted"


class Friendship(Base):
    __tablename__ = "friendships"

    friendship_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    requester_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    addressee_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(FriendshipStatus), default=FriendshipStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('requester_id', 'addressee_id', name='unique_friendship'),
    )