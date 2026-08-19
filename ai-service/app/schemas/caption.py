from enum import Enum
from typing import List
from pydantic import BaseModel, Field, field_validator


class ToneEnum(str, Enum):
    PROFESSIONAL = "Professional"
    CASUAL = "Casual"
    FUNNY = "Funny"
    INSPIRATIONAL = "Inspirational"
    MARKETING = "Marketing"


class CaptionRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=500, description="Topic or context of the post", json_schema_extra={"example": "Beach Vacation"})
    tone: ToneEnum = Field(default=ToneEnum.PROFESSIONAL, description="Desired tone for captions", json_schema_extra={"example": "Professional"})
    language: str = Field(default="English", min_length=2, max_length=50, description="Language of captions", json_schema_extra={"example": "English"})

    @field_validator("topic", "language")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be empty or whitespace only.")
        return stripped


class CaptionResponseData(BaseModel):
    captions: List[str] = Field(..., min_length=3, max_length=3, description="List of exactly 3 generated captions")
