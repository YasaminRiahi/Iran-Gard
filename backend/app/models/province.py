from sqlalchemy import Column, String
from app.db.session import Base

class Province(Base):
    __tablename__ = "provinces"

    province_name = Column(String(100), primary_key=True)