import enum
from sqlalchemy import Column, BigInteger, String, Date, ForeignKey, Enum, ARRAY, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class TripStatus(str, enum.Enum):
    ONGOING = "ongoing"
    COMPLETED = "completed"

class InvitationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class VoteType(str, enum.Enum):
    LIKE = "like"
    DISLIKE = "dislike"

class Trip(Base):
    __tablename__ = "trips"
    trip_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    owner_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(TripStatus), default=TripStatus.ONGOING)
    cover_image = Column(String(500), nullable=True, default="/static/images/cities/تهران.jpg")
    city_names = Column(ARRAY(String), default=[])

class TripParticipant(Base):
    __tablename__ = "trip_participants"
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)

class TripInvitation(Base):
    __tablename__ = "trip_invitations"
    invitation_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"))
    sender_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"))
    receiver_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"))
    status = Column(Enum(InvitationStatus), default=InvitationStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TripLocation(Base):
    """Association table between trips and places with visited status."""
    __tablename__ = "trip_locations"
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    visited = Column(Boolean, default=False, nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())


class TripLocationVote(Base):
    """User votes on trip locations - each user can vote once per location per trip."""
    __tablename__ = "trip_location_votes"
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    vote_type = Column(Enum(VoteType), nullable=False)
