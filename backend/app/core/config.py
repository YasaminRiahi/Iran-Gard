from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        # env_file=(
        #     [
        #         str(ROOT_DIR / ".env"),
        #         str(ROOT_DIR / ".env.local"),
        #     ]
        #     if (ROOT_DIR / ".env").exists()
        #     else []
        # ),
        # env_file_encoding="utf-8",
        extra="ignore",
    )

    # Project Information
    PROJECT_NAME: str
    VERSION: str
    API_STR: str

    # Server Configuration
    BACKEND_PORT: int

    # Database Configuration
    DB_DRIVER: str = "postgresql"
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    SIGNUP_TOKEN_EXPIRE_MINUTES: int

    # CORS
    BACKEND_CORS_ORIGINS: List[str]

    # Email Configuration (SMTP)
    EMAIL_SMTP_SERVER: str
    EMAIL_SMTP_PORT: int
    EMAIL_ADDRESS: str
    EMAIL_PASSWORD: str

    # Logging Configuration
    LOG_SQL: bool

    # API Documentation
    API_DOCS_ENABLED: bool = True

    # Grok AI / LLM Configuration
    GROQ_API_KEY: str = "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"
    LLM_MODEL: str = "openai/gpt-oss-120b"
    LLM_ENABLED: bool = False
    LLM_PROXY: str = ""

    @property
    def DATABASE_URL(self) -> str:
        """Construct DATABASE_URL from components."""
        return f"{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()
