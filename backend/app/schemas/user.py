from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """User Registration"""

    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """User Login"""

    username: str
    password: str


class UserUpdate(BaseModel):
    """User Update"""

    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    """User Response"""

    user_id: int
    username: str
    email: str
    gender: Optional[str] = None
    profile_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserWithCategories(UserResponse):
    """User with Categories"""

    favorite_categories: list[int] = []


class Token(BaseModel):
    """Token Response"""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token Data"""

    user_id: Optional[int] = None


# Verification Code Schemas
class SendVerificationCodeRequest(BaseModel):
    """Send verification code request"""

    email: EmailStr


class VerifyCodeRequest(BaseModel):
    """Verify code request"""

    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)


class CompleteSignupRequest(BaseModel):
    """Complete signup request (after code verification)"""

    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)
    signup_token: str = Field(
        ..., description="Temporary token from verify-signup-code"
    )


class ForgotPasswordRequest(BaseModel):
    """Forgot password request"""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset password request"""

    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6, max_length=100, alias="newPassword")

    class Config:
        populate_by_name = True
