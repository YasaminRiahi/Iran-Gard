from sqlalchemy import Column, String
from app.db.session import Base


class City(Base):
    """Cities table - city_name is the primary key."""
    __tablename__ = "cities"

    city_name = Column(String(100), primary_key=True)


class Province(Base):
    """Provinces table - province_name is the primary key."""
    __tablename__ = "provinces"

    province_name = Column(String(100), primary_key=True)
