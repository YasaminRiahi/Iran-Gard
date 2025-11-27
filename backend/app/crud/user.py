from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username."""
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID."""
    return db.query(User).filter(User.user_id == user_id).first()


def create_user(db: Session, user: UserCreate) -> User:
    """
    Create a new user.

    Args:
        db: Database session
        user: UserCreate schema with username, email, password

    Returns:
        Created User object
    """
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        user_password=hashed_password,
        gender="Male",  # Default gender
        profile_url="default.jpg",  # Default profile URL
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def search_users(db: Session, query: str, limit: int = 20) -> list[User]:
    """Search users by username or email."""
    search_pattern = f"%{query}%"
    return (
        db.query(User)
        .filter(
            (User.username.ilike(search_pattern)) | (User.email.ilike(search_pattern))
        )
        .limit(limit)
        .all()
    )


def update_user_password(db: Session, email: str, new_password: str) -> Optional[User]:
    """
    Update user's password.

    Args:
        db: Database session
        email: User's email
        new_password: New password (plain text, will be hashed)

    Returns:
        Updated User object or None if user not found
    """
    user = get_user_by_email(db, email)
    if not user:
        return None

    hashed_password = get_password_hash(new_password)
    user.user_password = hashed_password
    db.commit()
    db.refresh(user)
    return user
