import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.exceptions import validation_exception_handler
from app.api.api import api_router
from app.utils.email_service import EmailService, set_email_service

# Get the directory where main.py is located
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"

# Create static directory if it doesn't exist
STATIC_DIR.mkdir(parents=True, exist_ok=True)
(STATIC_DIR / "images").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=(
        f"{settings.API_STR}/openapi.json" if settings.API_DOCS_ENABLED else None
    ),
    docs_url=f"{settings.API_STR}/docs" if settings.API_DOCS_ENABLED else None,
    redoc_url=f"{settings.API_STR}/redoc" if settings.API_DOCS_ENABLED else None,
)

# Serve static files (images, etc.)
app.mount(f"{settings.API_STR}/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handler for validation errors
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Initialize Email Service if configured
if settings.EMAIL_ADDRESS and settings.EMAIL_PASSWORD:
    email_service = EmailService(
        smtp_server=settings.EMAIL_SMTP_SERVER,
        smtp_port=settings.EMAIL_SMTP_PORT,
        email=settings.EMAIL_ADDRESS,
        password=settings.EMAIL_PASSWORD,
    )
    set_email_service(email_service)

# Include API router
app.include_router(api_router, prefix=settings.API_STR)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Iran-Gard API",
        "version": settings.VERSION,
        "docs": f"{settings.API_STR}/docs",
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.BACKEND_PORT, reload=True)
