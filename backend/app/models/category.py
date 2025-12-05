from sqlalchemy import Column, BigInteger, String, ForeignKey,Enum
from app.db.session import Base
import enum


class CategoryType(str, enum.Enum):
    """Category type enum."""

    Nature = "Nature"
    Historical = "Historical"
    Entertainment = "Entertainment"
    Religious = "Religious"


class FavoriteCategory(Base):
    __tablename__ = "favorite_categories"

    category = Column(Enum(CategoryType), default=CategoryType.Historical, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)

