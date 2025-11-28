from sqlalchemy import Column, BigInteger, ForeignKey, Date, CheckConstraint
from sqlalchemy.sql import func
from app.db.session import Base


class FriendRequest(Base):
    __tablename__ = "friend_requests"

    requester_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    requestee_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    request_date = Column(Date, server_default=func.current_date())

    __table_args__ = (
        CheckConstraint('requester_id <> requestee_id', name='check_requester_not_requestee'),
    )


class Friend(Base):
    __tablename__ = "friends"

    user_id1 = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    user_id2 = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)

    __table_args__ = (
        CheckConstraint('user_id1 <> user_id2', name='check_user1_not_user2'),
    )

