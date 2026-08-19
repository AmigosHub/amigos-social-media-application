from typing import List
from fastapi import APIRouter, Request
from app.schemas.response import ApiResponse, create_response
from app.schemas.analytics import AnalyticsResponseData, FlaggedCommentItem
from app.services.analytics_service import analytics_service

router = APIRouter(tags=["Admin AI Analytics"])


@router.get(
    "/analytics",
    response_model=ApiResponse[AnalyticsResponseData],
    summary="Retrieve Microservice AI Usage Statistics",
    description="Returns aggregate count for caption requests, moderation requests, and flagged comments."
)
async def get_analytics(request: Request) -> ApiResponse[AnalyticsResponseData]:
    metrics = analytics_service.get_metrics()

    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    return create_response(
        data=metrics,
        message="Analytics metrics retrieved successfully",
        success=True,
        request_id=request_id,
        processing_time=processing_time
    )


@router.get(
    "/flagged-comments",
    response_model=ApiResponse[List[FlaggedCommentItem]],
    summary="List Flagged Non-Compliant Comments",
    description="Returns log of comments flagged during moderation with confidence scores and recommended actions."
)
async def get_flagged_comments(request: Request) -> ApiResponse[List[FlaggedCommentItem]]:
    comments = analytics_service.get_flagged_comments()

    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    return create_response(
        data=comments,
        message="Flagged comments retrieved successfully",
        success=True,
        request_id=request_id,
        processing_time=processing_time
    )
