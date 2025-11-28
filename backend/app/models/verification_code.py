"""
VerificationCode model for email verification and password reset.
"""

from sqlalchemy import Column, BigInteger, String, Boolean, DateTime
from datetime import datetime, timezone
from app.db.session import Base


class VerificationCode(Base):
    """Model for storing verification codes sent to users."""

    __tablename__ = "verification_codes"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    email = Column(String(100), nullable=False, index=True)
    code = Column(String(6), nullable=False)
    code_type = Column(String(20), default="signup", nullable=False)  # signup or reset
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
