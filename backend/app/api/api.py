from fastapi import APIRouter
from app.api.endpoints import auth, places

api_router = APIRouter()

# Include auth endpoints
api_router.include_router(auth.router, tags=["auth"])

# Include places endpoints
api_router.include_router(places.router, prefix="/places", tags=["places"])
