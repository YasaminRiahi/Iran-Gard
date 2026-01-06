from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import GenderType
from typing import List


class UserCreate(BaseModel):
    """User Registration"""

    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """
    User login credentials.

    **Required fields:**
    - username: 3-50 characters
    - password: 6-100 characters (not encrypted in transit, use HTTPS)
    """

    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)


class UserUpdate(BaseModel):
    """User Update"""

    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None




class SearchUserResponse(BaseModel):
    """SearchUserResponse"""

    user_id: int
    username: str
    full_name: Optional[str]
    about_me: Optional[str]
    profile_url: str
    friendship_status: bool

    class Config:
        from_attributes = True



class UserUpdateInformation(BaseModel):
    """Schema for updating user information."""
    full_name: Optional[str] = Field(None, max_length=100)
    about_me: Optional[str] = Field(None, max_length=255)
    gender: Optional[GenderType] = None
    favorite_categories: Optional[List[str]] = None

class UserResponse(BaseModel):
    """User Response"""

    user_id: int
    username: str
    email: str
    gender: Optional[str] = None
    full_name: Optional[str]
    about_me: Optional[str]
    profile_url: str
    number_of_trips: Optional[int]
    number_of_friends: Optional[int]
    favorite_categories: List[str]

    class Config:
        from_attributes = True

class UserEditResponse(BaseModel):
    """User Response"""

    user_id: int
    gender: Optional[str] = None
    full_name: Optional[str]
    about_me: Optional[str]
    profile_url: str
    favorite_categories: List[str]

    class Config:
        from_attributes = True


class UserWithCategories(UserResponse):
    """User with Categories"""

    favorite_categories: list[int] = []


class Token(BaseModel):
    """
    JWT token response for authenticated requests.

    **Fields:**
    - access_token: JWT string, use in Authorization header: `Bearer <token>`
    - token_type: Always "bearer"

    **Token contains:**
    - sub: user_id (subject)
    - exp: expiration time
    - type: token type (login token has no type field)
    """

    access_token: str = Field(
        ..., description="JWT access token for authenticated requests"
    )
    token_type: str = Field(default="bearer", description="Token type (always bearer)")


class TokenData(BaseModel):
    """Token Data"""

    user_id: Optional[int] = None


# Verification Code Schemas
class SendVerificationCodeRequest(BaseModel):
    """
    Request to send verification code to email.

    **Step 1 of signup/password-reset**

    **Validation:**
    - email must be valid format
    - email must not already exist (for signup)
    """

    email: EmailStr = Field(..., description="Valid email address")


class VerifyCodeRequest(BaseModel):
    """
    Request to verify 6-digit code from email.

    **Step 2 of signup/password-reset**

    **Validation:**
    - code must be exactly 6 digits
    - code must match sent code
    - code must not be expired (10 min expiry)
    """

    email: EmailStr = Field(..., description="Email where code was sent")
    code: str = Field(
        ..., min_length=6, max_length=6, description="6-digit code from email"
    )


class CompleteSignupRequest(BaseModel):
    """
    Request to complete signup with credentials.

    **Step 3 of signup (requires successful step 2)**

    **Security:**
    - signup_token from step 2 is validated (must be type: signup_verification)
    - signup_token email must match request email
    - password is hashed before storage

    **Validation:**
    - username: 3-50 chars, must be unique
    - email: must be valid and match step 2 email
    - password: 6-100 chars
    - signup_token: must be valid and not expired (15 min)
    """

    email: EmailStr = Field(..., description="Email from step 2")
    username: str = Field(
        ..., min_length=3, max_length=50, description="Unique username"
    )
    password: str = Field(
        ..., min_length=6, max_length=100, description="Password (will be hashed)"
    )
    signup_token: str = Field(
        ..., description="Temporary token from verify-signup-code (step 2)"
    )


class ForgotPasswordRequest(BaseModel):
    """
    Request to start password reset.

    **Step 1 of password reset**

    **Security:**
    - Email existence is not revealed (404 returned regardless)
    - Code sent via email is 6 digits, expires in 10 minutes
    """

    email: EmailStr = Field(..., description="Email to reset password for")


class ResetPasswordRequest(BaseModel):
    """
    Request to reset password with code.

    **Step 2 of password reset (requires successful step 1)**

    **Security:**
    - code must be valid and not expired (10 min)
    - code must not have been used before
    - new_password is hashed with bcrypt
    - old password is not checked (recovery flow)

    **Validation:**
    - email: must be valid
    - code: must be exactly 6 digits
    - new_password: 6-100 chars, different from code
    """

    email: EmailStr = Field(..., description="Email from step 1")
    code: str = Field(
        ..., min_length=6, max_length=6, description="6-digit code from email"
    )
    new_password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        alias="newPassword",
        description="New password (will be hashed)",
    )

    class Config:
        populate_by_name = True
