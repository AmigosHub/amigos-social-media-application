import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings loaded from Environment Variables or .env file.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # Application Configuration
    APP_NAME: str = "Amigos AI Microservice"
    APP_ENV: str = "development"
    PORT: int = 8000
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # CORS & Security
    ALLOWED_ORIGINS: List[str] = ["*"]
    INTERNAL_API_KEY: str = Field(default="secret-internal-api-key")

    # LLM Provider Configuration ("groq" or "gemini")
    LLM_PROVIDER: str = Field(default="groq")

    # Groq AI Config (Free tier model)
    GROQ_API_KEY: str = Field(default="")
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile")
    GROQ_TIMEOUT_SECONDS: int = 30

    # Google Gemini AI Config (Legacy / Alternative)
    GEMINI_API_KEY: str = Field(default="")
    GEMINI_MODEL: str = Field(default="gemini-2.5-flash")
    GEMINI_TIMEOUT_SECONDS: int = 30

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v


settings = Settings()
