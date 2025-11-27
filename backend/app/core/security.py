from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
import bcrypt
from app.core.config import settings


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    # Ensure password is a string
    if isinstance(password, bytes):
        password = password.decode("utf-8")
    elif not isinstance(password, str):
        password = str(password)

    password = password.strip()
    if not password:
        raise ValueError("Password cannot be empty")

    # Generate salt and hash with bcrypt (cost factor 12)
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)

    # Return as string
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    # Ensure plain_password is a string
    if isinstance(plain_password, bytes):
        plain_password = plain_password.decode("utf-8")
    elif not isinstance(plain_password, str):
        plain_password = str(plain_password)

    # Ensure hashed_password is bytes for bcrypt
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode("utf-8")

    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password)
    except Exception:
        # Invalid hash format
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode a JWT access token. Returns None if invalid or expired."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
