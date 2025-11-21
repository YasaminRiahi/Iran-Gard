from sqlalchemy import Column, BigInteger, String, Text, ForeignKey, Date, TIMESTAMP
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.db.session import Base


class Place(Base):
    __tablename__ = "places"

    place_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    place_name = Column(String(100), nullable=False)
    city_name = Column(String(100), ForeignKey("cities.city_name", ondelete="SET NULL"), nullable=False, index=True)
    place_location = Column(JSONB)
    description = Column(Text)
    category_id = Column(BigInteger, ForeignKey("categories.category_id", ondelete="SET NULL"), nullable=False)


class Photo(Base):
    __tablename__ = "photos"

    photo_num = Column(BigInteger, primary_key=True, autoincrement=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    url = Column(String(500), nullable=False)


class Like(Base):
    __tablename__ = "likes"

    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)


class PlaceComment(Base):
    __tablename__ = "place_comments"

    comment_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), nullable=False)
    comment_content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class LikedComment(Base):
    __tablename__ = "liked_comments"

    comment_id = Column(BigInteger, ForeignKey("place_comments.comment_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)


class Wishlist(Base):
    __tablename__ = "wishlist"

    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    added_date = Column(Date, server_default=func.current_date())

