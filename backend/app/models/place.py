from sqlalchemy import Column, BigInteger, String, Text, ForeignKey, Date, TIMESTAMP, Integer, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Place(Base):
    __tablename__ = "places"

    place_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    place_name = Column(String(100), nullable=False)
    city_name = Column(String(100), ForeignKey("cities.city_name", ondelete="SET NULL"), nullable=False, index=True)
    province_name = Column(String(100), ForeignKey("provinces.province_name", ondelete="SET NULL"), nullable=False)
    # Location stored as {"lat": float, "lng": float} for Google Maps compatibility
    place_location = Column(JSONB)
    description = Column(Text)
    # TODO: Add FK when Category model is created
    category_id = Column(BigInteger, nullable=True)

    # Relationships
    photos = relationship("PlacePhoto", back_populates="place", lazy="selectin")
    reviews = relationship("PlaceReview", back_populates="place", lazy="selectin")


class PlacePhoto(Base):
    """Photos for places - max 4 URLs per place recommended"""
    __tablename__ = "place_photos"

    photo_num = Column(BigInteger, primary_key=True, autoincrement=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String(500), nullable=False)

    # Relationship
    place = relationship("Place", back_populates="photos")


class PlaceReview(Base):
    """User reviews with ratings for places"""
    __tablename__ = "place_reviews"

    review_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars, optional
    review = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Constraints
    __table_args__ = (
        CheckConstraint('rating IS NULL OR (rating >= 1 AND rating <= 5)', name='review_rating_range'),
        UniqueConstraint('user_id', 'place_id', name='unique_user_place_review'),
    )

    # Relationship
    place = relationship("Place", back_populates="reviews")


class LikedReview(Base):
    """Likes on reviews"""
    __tablename__ = "liked_reviews"

    review_id = Column(BigInteger, ForeignKey("place_reviews.review_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)


class Wishlist(Base):
    __tablename__ = "wishlist"

    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    added_date = Column(Date, server_default=func.current_date())

