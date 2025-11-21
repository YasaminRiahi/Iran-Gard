from typing import Generator, Optional
    return current_user
    """Get current active user."""
) -> User:
    current_user: User = Depends(get_current_user)
def get_current_active_user(


    return user

        raise credentials_exception
    if user is None:
    user = user_crud.get_user_by_id(db, user_id=int(user_id))

        raise credentials_exception
    if user_id is None:
    user_id: int = payload.get("sub")

        raise credentials_exception
    if payload is None:
    payload = decode_access_token(token)

    )
        headers={"WWW-Authenticate": "Bearer"},
        detail="Could not validate credentials",
        status_code=status.HTTP_401_UNAUTHORIZED,
    credentials_exception = HTTPException(
    """Get current authenticated user."""
) -> User:
    token: str = Depends(oauth2_scheme)
    db: Session = Depends(get_db),
def get_current_user(


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

from app.crud import user as user_crud
from app.models.user import User
from app.db.session import get_db
from app.core.security import decode_access_token
from sqlalchemy.orm import Session
from jose import JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

