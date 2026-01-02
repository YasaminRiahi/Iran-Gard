import enum
from sqlalchemy import Column, BigInteger, String, Date, ForeignKey, Enum, ARRAY, DateTime
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

class Trip(Base):
    __tablename__ = "trips"
    trip_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    owner_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(TripStatus), default=TripStatus.ONGOING)
    cover_image = Column(String(500), nullable=True, default="/static/images/cities/تهران.jpg")
    city_names = Column(ARRAY(String), default=[])
    place_ids = Column(ARRAY(BigInteger), default=[])

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