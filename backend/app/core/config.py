import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


# Determine which .env file to use
env_file = os.getenv("ENVIRONMENT", "dev")
if env_file == "prod":
    env_file_path = ".env.prod"
elif env_file == "test":
    env_file_path = ".env.test"
else:
    env_file_path = ".env.dev"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=env_file_path, case_sensitive=True, extra="ignore"
    )

    # Project Information
    PROJECT_NAME: str = "Iran-Gard API"
    VERSION: str = "1.0.0"
    API_STR: str = "/api"

    # Environment Mode
    ENVIRONMENT: str = "dev"  # dev, test, prod

    # Database
    DATABASE_URL: str = "postgresql://postgres:1@localhost:5432/iran-gard"

    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SIGNUP_TOKEN_EXPIRE_MINUTES: int = 15

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # Email Configuration (SMTP)
    EMAIL_SMTP_SERVER: str = "smtp.gmail.com"
    EMAIL_SMTP_PORT: int = 587
    EMAIL_ADDRESS: str = ""
    EMAIL_PASSWORD: str = ""

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v


settings = Settings()
