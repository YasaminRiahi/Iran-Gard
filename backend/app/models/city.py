from sqlalchemy import Column, String
from app.db.session import Base


class City(Base):
    __tablename__ = "cities"

    city_name = Column(String(100), primary_key=True)

