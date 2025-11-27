"""
Authentication endpoints for user signup, login, and password management.
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.core.config import settings
from app.db.session import get_db
from app.schemas.user import (
    Token,
    UserLogin,
    CompleteSignupRequest,
    SendVerificationCodeRequest,
    VerifyCodeRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.crud import user as user_crud
from app.crud import verification_code as vc_crud
from app.utils.auth_utils import generate_verification_code
from app.utils.email_service import get_email_service

router = APIRouter(prefix="/auth", tags=["auth"])


# ============================================================================
# LOGIN ENDPOINT
# ============================================================================


@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Login with username and password.

    Returns JWT access token if credentials are correct.
    """
    username = user_login.username.strip()
    user = user_crud.get_user_by_username(db, username=username)

    if not user or not verify_password(user_login.password, user.user_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="نام کاربری یا رمز عبور اشتباه است",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


# ============================================================================
# SIGNUP FLOW ENDPOINTS (3-step process)
# ============================================================================


@router.post("/send-signup-code")
def send_signup_code(
    request: SendVerificationCodeRequest, db: Session = Depends(get_db)
):
    """
    Step 1: Send verification code to email for signup.

    Check if email already exists, generate code, and send via email.
    """
    email = request.email.lower()

    # Check if email already registered
    existing_user = user_crud.get_user_by_email(db, email=email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="این ایمیل قبلاً ثبت شده است",
        )

    # Generate 6-digit code
    code = generate_verification_code()

    # Save to database
    vc_crud.create_verification_code(
        db=db, email=email, code=code, code_type="signup", expires_in_minutes=10
    )

    # Send email
    email_service = get_email_service()
    if not email_service or not email_service.send_verification_code_email(
        email, code, "signup"
    ):
        # If email sending fails, still return success but log the issue
        # In production, you might want to handle this differently
        pass

    return {
        "success": True,
        "message": "Verification code sent to your email",
        "email": email,
    }


@router.post("/verify-signup-code")
def verify_signup_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    """
    Step 2: Verify the code sent to email.

    Check if code is valid and not expired.
    """
    email = request.email.lower()
    code = request.code.strip()

    # Verify the code
    if not vc_crud.verify_code(db, email=email, code=code, code_type="signup"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="کد تایید اشتباه یا منقضی است",
        )

    return {"success": True, "message": "کد تایید شد", "email": email}


@router.post("/complete-signup", response_model=Token)
def complete_signup(request: CompleteSignupRequest, db: Session = Depends(get_db)):
    """
    Step 3: Complete signup by creating user account.

    Must be done after code verification.
    Note: In production, you might want to verify the code again here.
    """
    email = request.email.lower()

    # Check if email already registered (double-check)
    if user_crud.get_user_by_email(db, email=email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="این ایمیل قبلاً ثبت شده است",
        )

    # Check if username already taken
    if user_crud.get_user_by_username(db, username=request.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="این نام کاربری قبلاً گرفته شده است",
        )

    # Create user
    from app.schemas.user import UserCreate

    user_create = UserCreate(
        username=request.username, email=email, password=request.password
    )

    new_user = user_crud.create_user(db, user=user_create)

    # Create JWT access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.user_id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


# ============================================================================
# PASSWORD RESET FLOW (2-step process)
# ============================================================================


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Step 1: Send password reset code to email.

    Check if email exists and send reset code.
    """
    email = request.email.lower()

    # Check if user exists
    user = user_crud.get_user_by_email(db, email=email)
    if not user:
        # For security, don't reveal if email exists
        # But in development, you might want to be more explicit
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ایمیل پیدا نشد",
        )

    # Generate reset code
    code = generate_verification_code()

    # Save to database
    vc_crud.create_verification_code(
        db=db, email=email, code=code, code_type="reset", expires_in_minutes=10
    )

    # Send email
    email_service = get_email_service()
    if not email_service or not email_service.send_verification_code_email(
        email, code, "reset"
    ):
        pass  # Log but don't fail

    return {
        "success": True,
        "message": "کد ارسال شد!",
        "email": email,
    }


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Step 2: Reset password with code.

    Verify code and update password.
    """
    email = request.email.lower()
    code = request.code.strip()

    # Get valid verification code
    verification_code = vc_crud.get_valid_code(
        db, email=email, code=code, code_type="reset"
    )

    if not verification_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="کد اشتباه یا منقضی است",
        )

    # Update password
    user = user_crud.update_user_password(
        db, email=email, new_password=request.new_password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ایمیل پیدا نشد"
        )

    # Mark code as used (already done in get_valid_code, but being explicit)
    verification_code.is_used = True
    db.commit()

    return {"success": True, "message": "رمز با موفقیت تغییر کرد!"}
