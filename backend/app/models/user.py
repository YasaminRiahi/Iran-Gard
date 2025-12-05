import enum
from sqlalchemy import Column, BigInteger, String, Enum
from app.db.session import Base


class GenderType(str, enum.Enum):
    """Gender type enum."""

    Male = "Male"
    Female = "Female"


class User(Base):
    __tablename__ = "users"

    user_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    user_password = Column(String(255), nullable=False)
    gender = Column(Enum(GenderType), default=GenderType.Male, nullable=False)
    full_name = Column(String(100), nullable=True)
    about_me = Column(String(255), nullable=True)
    profile_url = Column(String(500), nullable=False)
