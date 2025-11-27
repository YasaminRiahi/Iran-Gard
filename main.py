from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.utils.email_service import EmailService, set_email_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_STR}/openapi.json",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
