from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse
from app.schemas.category import FavoriteCategoryCreate, CategoryResponse
from app.crud import user as user_crud
from app.models.category import FavoriteCategory, Category

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user


@router.get("/search", response_model=List[UserResponse])
def search_users(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for users by username or email."""
    users = user_crud.search_users(db, query=q)
    return users


@router.get("/me/favorite-categories", response_model=List[CategoryResponse])
def get_favorite_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's favorite categories."""
    favorites = db.query(Category).join(FavoriteCategory).filter(
        FavoriteCategory.user_id == current_user.user_id
    ).all()
    return favorites


@router.post("/me/favorite-categories", status_code=status.HTTP_201_CREATED)
def add_favorite_category(
    category: FavoriteCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a category to user's favorites."""
    # Check if already exists
    existing = db.query(FavoriteCategory).filter(
        FavoriteCategory.user_id == current_user.user_id,
        FavoriteCategory.category_id == category.category_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already in favorites"
        )

    favorite = FavoriteCategory(
        user_id=current_user.user_id,
        category_id=category.category_id
    )
    db.add(favorite)
    db.commit()
    return {"message": "Category added to favorites"}


@router.delete("/me/favorite-categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a category from user's favorites."""
    favorite = db.query(FavoriteCategory).filter(
        FavoriteCategory.user_id == current_user.user_id,
        FavoriteCategory.category_id == category_id
    ).first()

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite category not found"
        )

    db.delete(favorite)
    db.commit()

