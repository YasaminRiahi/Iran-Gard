from fastapi import APIRouter, Depends, HTTPException, status, Query
    return place_crud.get_user_wishlist(db, user_id=current_user.user_id)
    """Get current user's wishlist."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
def get_my_wishlist(
@router.get("/wishlist/me", response_model=List[WishlistResponse])


        )
            detail="Place not in wishlist"
            status_code=status.HTTP_404_NOT_FOUND,
        raise HTTPException(
    if not place_crud.remove_from_wishlist(db, user_id=current_user.user_id, place_id=place_id):
    """Remove a place from wishlist."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    place_id: int,
def remove_from_wishlist(
@router.delete("/wishlist/{place_id}", status_code=status.HTTP_204_NO_CONTENT)


    return {"message": "Added to wishlist"}
    place_crud.add_to_wishlist(db, user_id=current_user.user_id, place_id=place_id)
    """Add a place to wishlist."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    place_id: int,
def add_to_wishlist(
@router.post("/wishlist/{place_id}", status_code=status.HTTP_201_CREATED)


    return {"liked": liked}
    liked = place_crud.toggle_comment_like(db, user_id=current_user.user_id, comment_id=comment_id)
    """Toggle like on a comment."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    comment_id: int,
def toggle_comment_like(
@router.post("/comments/{comment_id}/like", status_code=status.HTTP_200_OK)


    return place_crud.get_place_comments(db, place_id=place_id)
    """Get all comments for a place."""
):
    db: Session = Depends(get_db)
    place_id: int,
def get_comments(
@router.get("/{place_id}/comments", response_model=List[PlaceCommentResponse])


    )
        content=comment.comment_content
        place_id=place_id,
        user_id=current_user.user_id,
        db,
    return place_crud.create_comment(
    """Create a comment on a place."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    comment: PlaceCommentCreate,
    place_id: int,
def create_comment(
@router.post("/{place_id}/comments", response_model=PlaceCommentResponse, status_code=status.HTTP_201_CREATED)


    return {"count": count}
    count = place_crud.get_place_likes_count(db, place_id=place_id)
    """Get number of likes for a place."""
):
    db: Session = Depends(get_db)
    place_id: int,
def get_likes_count(
@router.get("/{place_id}/likes/count", response_model=dict)


    return {"liked": liked}
    liked = place_crud.toggle_like(db, user_id=current_user.user_id, place_id=place_id)
    """Toggle like on a place."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    place_id: int,
def toggle_like(
@router.post("/{place_id}/like", status_code=status.HTTP_200_OK)


    return place_crud.get_place_photos(db, place_id=place_id)
    """Get all photos for a place."""
):
    db: Session = Depends(get_db)
    place_id: int,
def get_photos(
@router.get("/{place_id}/photos", response_model=List[PhotoResponse])


    return place_crud.add_photo(db, place_id=place_id, url=photo.url)
    """Add a photo to a place."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    photo: PhotoCreate,
    place_id: int,
def add_photo(
@router.post("/{place_id}/photos", response_model=PhotoResponse, status_code=status.HTTP_201_CREATED)


        )
            detail="Please provide city_name, category_id, or set user_preferences=true"
            status_code=status.HTTP_400_BAD_REQUEST,
        raise HTTPException(
    else:
        return place_crud.get_places_by_category(db, category_id=category_id, skip=skip, limit=limit)
    elif category_id:
        return place_crud.get_places_by_city(db, city_name=city_name, skip=skip, limit=limit)
    elif city_name:
        )
            limit=limit
            skip=skip,
            city_name=city_name,
            user_favorite_categories=category_ids,
            db,
        return place_crud.get_places_by_user_preferences(

            return []
        if not category_ids:

        category_ids = [fc.category_id for fc in fav_categories]
        ).all()
            FavoriteCategory.user_id == current_user.user_id
        fav_categories = db.query(FavoriteCategory).filter(
        # Get user's favorite categories
    if user_preferences:
    """
    - by user preferences (favorite categories)
    - by category
    - by city
    Get places with optional filtering:
    """
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    limit: int = 100,
    skip: int = 0,
    user_preferences: bool = Query(False),
    category_id: Optional[int] = Query(None),
    city_name: Optional[str] = Query(None),
def get_places(
@router.get("", response_model=List[PlaceResponse])


    return place
        )
            detail="Place not found"
            status_code=status.HTTP_404_NOT_FOUND,
        raise HTTPException(
    if not place:
    place = place_crud.get_place(db, place_id=place_id)
    """Get a place by ID."""
):
    db: Session = Depends(get_db)
    place_id: int,
def get_place(
@router.get("/{place_id}", response_model=PlaceResponse)


    return place_crud.create_place(db, place=place)
    """Create a new place."""
):
    current_user: User = Depends(get_current_user)
    db: Session = Depends(get_db),
    place: PlaceCreate,
def create_place(
@router.post("", response_model=PlaceResponse, status_code=status.HTTP_201_CREATED)


router = APIRouter()

from app.models.category import FavoriteCategory
from app.crud import place as place_crud
)
    WishlistResponse, LikeResponse
    PhotoCreate, PhotoResponse, PlaceCommentCreate, PlaceCommentResponse,
    PlaceCreate, PlaceResponse, PlaceUpdate,
from app.schemas.place import (
from app.models.user import User
from app.api.deps import get_current_user
from app.db.session import get_db
from typing import List, Optional
from sqlalchemy.orm import Session

