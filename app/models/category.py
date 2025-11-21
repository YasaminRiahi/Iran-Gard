from sqlalchemy import Column, BigInteger, String, ForeignKey
from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    category_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    category_name = Column(String(100), unique=True, nullable=False)


class FavoriteCategory(Base):
    __tablename__ = "favorite_categories"

    category_id = Column(BigInteger, ForeignKey("categories.category_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)

