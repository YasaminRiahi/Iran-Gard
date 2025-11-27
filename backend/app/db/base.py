# Import all models here for Alembic auto-detection
from app.db.session import Base
from app.models.user import User
from app.models.verification_code import VerificationCode
from app.models.category import Category, FavoriteCategory
from app.models.city import City
from app.models.place import Place, Photo, Like, PlaceComment, LikedComment, Wishlist
from app.models.friend import Friend, FriendRequest
from app.models.trip import Trip, TripCity, TripMember, TripInvitation, TripPlace
from app.models.trip_package import (
    TripPackage,
    TripPackagePlaces,
    TripPackageReact,
    TripPlaceReact,
)
from app.models.expense import Expense, ExpenseShare
