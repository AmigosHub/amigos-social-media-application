from fastapi import APIRouter, Request, Depends
from app.schemas.response import ApiResponse, create_response
from app.schemas.health import HealthResponse
from app.services.health_service import HealthService
from app.infrastructure.llm.factory import get_llm_client

router = APIRouter(tags=["Health"])


def get_health_service() -> HealthService:
    # Dependency injection for LLM client and Health service
    llm_client = get_llm_client()
    return HealthService(llm_client=llm_client)


@router.get(
    "/health",
    response_model=ApiResponse[HealthResponse],
    summary="Microservice Health Status Check",
    description="Returns status of the microservice, environment settings, and Groq AI / LLM API connectivity."
)
async def check_health(
    request: Request,
    health_service: HealthService = Depends(get_health_service)
) -> ApiResponse[HealthResponse]:
    health_data = await health_service.get_health_status()
    
    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    return create_response(
        data=health_data,
        message="AI Microservice status retrieved successfully",
        success=health_data.status == "HEALTHY",
        request_id=request_id,
        processing_time=processing_time
    )
