from sqlalchemy import Column, BigInteger, String, ForeignKey, Date, Numeric, CheckConstraint
from app.db.session import Base


class TripPackage(Base):
    __tablename__ = "trip_packages"

    package_num = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    city_name = Column(String(100), ForeignKey("cities.city_name", ondelete="CASCADE"), nullable=False)
    package_name = Column(String(200))
    package_date = Column(Date)


class TripPackagePlaces(Base):
    __tablename__ = "trip_packages_places"

    package_num = Column(BigInteger, primary_key=True)
    trip_id = Column(BigInteger, primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    preference = Column(Numeric(12, 2), nullable=False)

    __table_args__ = (
        CheckConstraint('preference >= 0', name='check_preference_positive'),
    )


class TripPackageReact(Base):
    __tablename__ = "trip_package_react"

    trip_id = Column(BigInteger, primary_key=True)
    package_num = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    react_content = Column(String(50), nullable=False)


class TripPlaceReact(Base):
    __tablename__ = "trip_place_react"

    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True)
    place_id = Column(BigInteger, ForeignKey("places.place_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id"), primary_key=True)
    react_content = Column(String(50), nullable=False)

