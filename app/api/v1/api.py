from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, friends, trips, places, expenses, categories
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(friends.router, prefix="/friends", tags=["friends"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(places.router, prefix="/places", tags=["places"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])

