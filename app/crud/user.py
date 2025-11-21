from typing import Optional
    ).limit(limit).all()
        (User.username.ilike(search_pattern)) | (User.email.ilike(search_pattern))
    return db.query(User).filter(
    search_pattern = f"%{query}%"
    """Search users by username or email."""
def search_users(db: Session, query: str, limit: int = 20) -> list[User]:


    return db_user
    db.refresh(db_user)
    db.commit()
    db.add(db_user)
    )
        user_password=hashed_password
        email=user.email,
        username=user.username,
    db_user = User(
    hashed_password = get_password_hash(user.password)
    """Create a new user."""
def create_user(db: Session, user: UserCreate) -> User:


    return db.query(User).filter(User.user_id == user_id).first()
    """Get user by ID."""
def get_user_by_id(db: Session, user_id: int) -> Optional[User]:


    return db.query(User).filter(User.username == username).first()
    """Get user by username."""
def get_user_by_username(db: Session, username: str) -> Optional[User]:


    return db.query(User).filter(User.email == email).first()
    """Get user by email."""
def get_user_by_email(db: Session, email: str) -> Optional[User]:


from app.core.security import get_password_hash
from app.schemas.user import UserCreate
from app.models.user import User
from sqlalchemy.orm import Session

