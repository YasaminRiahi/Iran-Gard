from sqlalchemy import Column, BigInteger, String, ForeignKey, Date, TIMESTAMP, Enum, CheckConstraint
from sqlalchemy.sql import func
import enum
from app.db.session import Base


class TripStatus(str, enum.Enum):
    planning = "planning"
    finished = "finished"


class Trip(Base):
    __tablename__ = "trips"

    trip_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    creator_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    trip_title = Column(String(200), nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(Enum(TripStatus), default=TripStatus.planning)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint('end_date >= start_date', name='check_end_date_after_start'),
    )


class TripCity(Base):
    __tablename__ = "trip_cities"

    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    city_name = Column(String(100), ForeignKey("cities.city_name", ondelete="CASCADE"), primary_key=True)


class TripMember(Base):
    __tablename__ = "trip_members"

    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    joined_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class TripInvitation(Base):
    __tablename__ = "trip_invitations"

    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    inviter_id = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
    invitee_id = Column(BigInteger, ForeignKey("users.user_id"), primary_key=True)
    invited_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class TripPlace(Base):
    __tablename__ = "trip_places"

    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)

