"""
CRUD operations for verification codes.
Handles sending, verifying, and managing verification codes for signup and password reset.
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.verification_code import VerificationCode


def create_verification_code(
    db: Session,
    email: str,
    code: str,
    code_type: str = "signup",
    expires_in_minutes: int = 10,
) -> VerificationCode:
    """
    Create a new verification code.

    Args:
        db: Database session
        email: Email address
        code: Verification code
        code_type: Type of code ('signup' or 'reset')
        expires_in_minutes: Minutes until code expires

    Returns:
        Created VerificationCode
    """
    # Delete existing codes for this email and type
    db.query(VerificationCode).filter(
        VerificationCode.email == email, VerificationCode.code_type == code_type
    ).delete()

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)

    verification_code = VerificationCode(
        email=email,
        code=code,
        code_type=code_type,
        expires_at=expires_at,
        is_used=False,
    )
    db.add(verification_code)
    db.commit()
    db.refresh(verification_code)
    return verification_code


def verify_code(db: Session, email: str, code: str, code_type: str = "signup") -> bool:
    """
    Verify a code and mark it as used.

    Args:
        db: Database session
        email: Email address
        code: Code to verify
        code_type: Type of code ('signup' or 'reset')

    Returns:
        True if code is valid and not expired, False otherwise
    """
    verification_code = (
        db.query(VerificationCode)
        .filter(
            VerificationCode.email == email,
            VerificationCode.code == code,
            VerificationCode.code_type == code_type,
        )
        .order_by(VerificationCode.created_at.desc())
        .first()
    )

    if not verification_code:
        return False

    # Check if code is already used
    if verification_code.is_used:
        return False

    # Check if code is expired
    expires_at = verification_code.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        return False

    # Mark as used
    verification_code.is_used = True
    db.commit()

    return True


def get_valid_code(
    db: Session, email: str, code: str, code_type: str = "signup"
) -> VerificationCode | None:
    """
    Get a valid (not used, not expired) verification code.

    Args:
        db: Database session
        email: Email address
        code: Code to check
        code_type: Type of code

    Returns:
        VerificationCode if valid, None otherwise
    """
    verification_code = (
        db.query(VerificationCode)
        .filter(
            VerificationCode.email == email,
            VerificationCode.code == code,
            VerificationCode.code_type == code_type,
        )
        .order_by(VerificationCode.created_at.desc())
        .first()
    )

    if not verification_code:
        return None

    if verification_code.is_used:
        return None

    expires_at = verification_code.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        return None

    return verification_code
