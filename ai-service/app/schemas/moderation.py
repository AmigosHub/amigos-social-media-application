from enum import Enum
from pydantic import BaseModel, Field, field_validator


class ActionEnum(str, Enum):
    BLOCK = "BLOCK"
    REVIEW = "REVIEW"
    ALLOW = "ALLOW"


class ModerationRequest(BaseModel):
    comment: str = Field(..., min_length=1, max_length=2000, description="User comment text to evaluate", json_schema_extra={"example": "You are stupid."})

    @field_validator("comment")
    @classmethod
    def validate_comment(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Comment text cannot be empty or whitespace only.")
        return stripped


class ModerationResponseData(BaseModel):
    safe: bool = Field(..., description="True if comment is compliant, False otherwise")
    confidence: int = Field(..., ge=0, le=100, description="AI confidence score (0 to 100)")
    category: str = Field(..., description="Flagged violation category or 'None'")
    reason: str = Field(..., description="Explanation of moderation decision")
    action: ActionEnum = Field(..., description="Action recommendation: BLOCK, REVIEW, or ALLOW")
