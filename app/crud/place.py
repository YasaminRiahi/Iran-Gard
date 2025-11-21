from sqlalchemy.orm import Session
from app.models.place import Place, Photo, Like, PlaceComment, LikedComment, Wishlist
from app.schemas.place import PlaceCreate, PlaceUpdate
from typing import List, Optional


def create_place(db: Session, place: PlaceCreate) -> Place:
    """Create a new place."""
    db_place = Place(**place.model_dump())
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


def get_place(db: Session, place_id: int) -> Optional[Place]:
    """Get place by ID."""
    return db.query(Place).filter(Place.place_id == place_id).first()


def get_places_by_city(db: Session, city_name: str, skip: int = 0, limit: int = 100) -> List[Place]:
    """Get all places in a city."""
    return db.query(Place).filter(Place.city_name == city_name).offset(skip).limit(limit).all()


def get_places_by_category(db: Session, category_id: int, skip: int = 0, limit: int = 100) -> List[Place]:
    """Get all places in a category."""
    return db.query(Place).filter(Place.category_id == category_id).offset(skip).limit(limit).all()


def get_places_by_user_preferences(
    db: Session,
    user_favorite_categories: List[int],
    city_name: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Place]:
    """Get places matching user's favorite categories."""
    query = db.query(Place).filter(Place.category_id.in_(user_favorite_categories))

    if city_name:
        query = query.filter(Place.city_name == city_name)

    return query.offset(skip).limit(limit).all()


def add_photo(db: Session, place_id: int, url: str) -> Photo:
    """Add a photo to a place."""
    photo = Photo(place_id=place_id, url=url)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


def get_place_photos(db: Session, place_id: int) -> List[Photo]:
    """Get all photos for a place."""
    return db.query(Photo).filter(Photo.place_id == place_id).all()


def toggle_like(db: Session, user_id: int, place_id: int) -> bool:
    """Toggle like on a place. Returns True if liked, False if unliked."""
    like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.place_id == place_id
    ).first()

    if like:
        db.delete(like)
        db.commit()
        return False
    else:
        new_like = Like(user_id=user_id, place_id=place_id)
        db.add(new_like)
        db.commit()
        return True


def get_place_likes_count(db: Session, place_id: int) -> int:
    """Get number of likes for a place."""
    return db.query(Like).filter(Like.place_id == place_id).count()


def create_comment(db: Session, user_id: int, place_id: int, content: str) -> PlaceComment:
    """Create a comment on a place."""
    comment = PlaceComment(
        user_id=user_id,
        place_id=place_id,
        comment_content=content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_place_comments(db: Session, place_id: int) -> List[PlaceComment]:
    """Get all comments for a place."""
    return db.query(PlaceComment).filter(PlaceComment.place_id == place_id).all()


def toggle_comment_like(db: Session, user_id: int, comment_id: int) -> bool:
    """Toggle like on a comment. Returns True if liked, False if unliked."""
    like = db.query(LikedComment).filter(
        LikedComment.user_id == user_id,
        LikedComment.comment_id == comment_id
    ).first()

    if like:
        db.delete(like)
        db.commit()
        return False
    else:
        new_like = LikedComment(user_id=user_id, comment_id=comment_id)
        db.add(new_like)
        db.commit()
        return True


def add_to_wishlist(db: Session, user_id: int, place_id: int) -> Wishlist:
    """Add a place to user's wishlist."""
    wishlist_item = Wishlist(user_id=user_id, place_id=place_id)
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    return wishlist_item


def remove_from_wishlist(db: Session, user_id: int, place_id: int) -> bool:
    """Remove a place from user's wishlist."""
    wishlist_item = db.query(Wishlist).filter(
        Wishlist.user_id == user_id,
        Wishlist.place_id == place_id
    ).first()

    if wishlist_item:
        db.delete(wishlist_item)
        db.commit()
        return True
    return False


def get_user_wishlist(db: Session, user_id: int) -> List[Wishlist]:
    """Get user's wishlist."""
    return db.query(Wishlist).filter(Wishlist.user_id == user_id).all()

