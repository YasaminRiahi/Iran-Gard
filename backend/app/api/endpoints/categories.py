from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.category import CategoryResponse

router = APIRouter()

# Hardcoded categories (no categories table exists)
CATEGORIES = [
    {"category_id": 1, "category_name": "Historical"},
    {"category_id": 2, "category_name": "Religious"},
    {"category_id": 3, "category_name": "Entertainment"},
    {"category_id": 4, "category_name": "Nature"}
]


@router.get("", response_model=List[CategoryResponse])
def get_categories():
    """Get all categories."""
    return [CategoryResponse(**cat) for cat in CATEGORIES]
