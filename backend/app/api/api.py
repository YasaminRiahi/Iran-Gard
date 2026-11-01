from fastapi import APIRouter
from app.api.endpoints import auth, friendships, users, places, trips,city,expenses,ai

api_router = APIRouter()

# Include auth endpoints
api_router.include_router(auth.router, tags=["auth"])

# Include friendship endpoints
api_router.include_router(friendships.router, tags=["friendships"])

# Include users endpoints
api_router.include_router(users.router, tags=["users"])

# Include trips endpoints
api_router.include_router(trips.router, tags=["trips"])

# Include places endpoints
api_router.include_router(places.router, prefix="/places", tags=["places"])

# Include city endpoints
api_router.include_router(city.router, prefix="/city", tags=["city"])

# Include expense endpoints
api_router.include_router(expenses.router)

# include ai endpoints
api_router.include_router(ai.router)