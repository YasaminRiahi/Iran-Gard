from sqlalchemy import Column, BigInteger, String, ForeignKey, Enum, DateTime, Integer
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class VoteType(str, enum.Enum):
    LIKE = "like"
    DISLIKE = "dislike"


class TripPlan(Base):
    """Trip plan model - represents a daily plan for a trip"""
    __tablename__ = "trip_plans"
    
    plan_id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)  # e.g., "روز اول"
    city_name = Column(String(100), ForeignKey("cities.city_name", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TripPlanLocation(Base):
    """Locations within a trip plan with order and estimated time"""
    __tablename__ = "trip_plan_locations"
    
    plan_id = Column(BigInteger, ForeignKey("trip_plans.plan_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    order = Column(Integer, nullable=False)  # Order of location in the plan
    estimated_time_minutes = Column(Integer, nullable=True)  # Estimated visit time in minutes (e.g., 120 for 2 hours)


class TripPlanVote(Base):
    """User votes on trip plans"""
    __tablename__ = "trip_plan_votes"
    
    plan_id = Column(BigInteger, ForeignKey("trip_plans.plan_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    vote_type = Column(Enum(VoteType), nullable=False)
