# Import all models here for Alembic auto-detection
from app.db.session import Base
from app.models.user import User
from app.models.verification_code import VerificationCode
from app.models.friendship import Friendship

# Location models (must be imported before Place due to FK dependencies)
from app.models.location import City, Province

# Place related models
from app.models.place import Place, PlacePhoto, PlaceReview, LikedReview, Wishlist

from app.models.trip import Trip, TripParticipant, TripInvitation, TripLocation, TripLocationVote
from app.models.trip_plan import TripPlan, TripPlanLocation, TripPlanVote
