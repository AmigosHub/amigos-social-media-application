from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class AnalyticsResponseData(BaseModel):
    captionRequests: int = Field(..., description="Total AI caption generation requests processed")
    moderationRequests: int = Field(..., description="Total comment moderation requests processed")
    flaggedComments: int = Field(..., description="Total non-compliant/flagged comments detected")


class FlaggedCommentItem(BaseModel):
    id: str = Field(..., description="Unique log ID")
    comment: str = Field(..., description="Flagged user comment")
    confidence: int = Field(..., description="Moderation confidence score")
    category: str = Field(..., description="Violation category")
    reason: str = Field(..., description="Reasoning for flag")
    action: str = Field(..., description="Recommended action (BLOCK, REVIEW, ALLOW)")
    timestamp: str = Field(..., description="ISO 8601 timestamp of request")
