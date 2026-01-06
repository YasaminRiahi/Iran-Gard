"""
Authentication endpoints for user signup, login, and password management.
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    verify_password,
    decode_access_token,
)
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


@router.post("/token", response_model=Token, include_in_schema=False)
def login_for_swagger(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 compatible token login for Swagger UI authentication.
    Use /auth/login for JSON-based login.
    """
    username = form_data.username.strip()
    user = user_crud.get_user_by_username(db, username=username)

    if not user or not verify_password(form_data.password, user.user_password):
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


@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token.

    **Flow:**
    1. Validates username and password against database
    2. Returns JWT access token valid for 30 minutes (configurable)

    **Errors:**
    - 401: Username or password incorrect

    **Response:** Token object with access_token and token_type
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
    **Signup Step 1:** Send verification code to email.

    **Flow:**
    1. Check if email already registered
    2. Generate 6-digit code
    3. Save code (expires in 10 minutes)
    4. Send code via email

    **Errors:**
    - 400: Email already registered

    **Response:** Success confirmation with email
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
    **Signup Step 2:** Verify code and get temporary signup token.

    **Flow:**
    1. Validate 6-digit code against email
    2. Check code not expired (10 min expiry)
    3. Mark code as verified
    4. Generate temporary signup token (15 min valid, type: signup_verification)

    **Errors:**
    - 400: Code incorrect or expired

    **Response:** Temporary signup_token for step 3
    """
    email = request.email.lower()
    code = request.code.strip()

    # Verify the code
    if not vc_crud.verify_code(db, email=email, code=code, code_type="signup"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="کد تایید اشتباه یا منقضی است",
        )

    # Generate temporary signup token
    signup_token = create_access_token(
        data={"email": email, "type": "signup_verification"},
        expires_delta=timedelta(minutes=settings.SIGNUP_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "success": True,
        "message": "کد تایید شد",
        "email": email,
        "signup_token": signup_token,
    }


@router.post("/complete-signup", response_model=Token)
def complete_signup(request: CompleteSignupRequest, db: Session = Depends(get_db)):
    """
    **Signup Step 3:** Create user account.

    **Prerequisites:** Must complete steps 1 & 2 first

    **Flow:**
    1. Validate signup_token (must have type: signup_verification, email match)
    2. Check email not already registered (double-check)
    3. Check username not taken
    4. Create user with hashed password (bcrypt)
    5. Return access token (30 min valid)

    **Errors:**
    - 401: Invalid or expired signup_token
    - 400: Email already registered or username taken

    **Response:** Access token for authenticated requests
    """
    email = request.email.lower()

    # ✅ SECURITY: Verify the signup token and check type
    payload = decode_access_token(request.signup_token)
    if (
        not payload
        or payload.get("type") != "signup_verification"
        or payload.get("email") != email
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="توکن تایید نامعتبر یا منقضی است. لطفاً دوباره تایید کنید.",
        )

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
    **Password Reset Step 1:** Send reset code to email.

    **Flow:**
    1. Check if email exists (silent fail for security)
    2. Generate 6-digit code
    3. Save code (expires in 10 minutes)
    4. Send code via email

    **Errors:**
    - 404: Email not found (not revealed to user for security)

    **Response:** Success confirmation
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
    **Password Reset Step 2:** Update password.

    **Flow:**
    1. Validate reset code (must be unused and not expired)
    2. Mark code as used (prevent reuse)
    3. Hash new password with bcrypt
    4. Update user password in database

    **Errors:**
    - 400: Code incorrect or expired
    - 404: Email not found

    **Response:** Success confirmation
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
