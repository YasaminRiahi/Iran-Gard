from fastapi import APIRouter
from app.api.endpoints import auth, friendships, users, places

api_router = APIRouter()

# Include auth endpoints
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(friendships.router, tags=["friendships"])
api_router.include_router(users.router, tags=["users"])

# Include places endpoints
api_router.include_router(places.router, prefix="/places", tags=["places"])
