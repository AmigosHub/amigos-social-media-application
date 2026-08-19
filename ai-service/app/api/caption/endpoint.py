from fastapi import APIRouter, Request, Depends
from app.schemas.response import ApiResponse, create_response
from app.schemas.caption import CaptionRequest, CaptionResponseData
from app.services.caption_service import CaptionService
from app.infrastructure.llm.factory import get_llm_client
from app.infrastructure.prompts.prompt_manager import PromptManager

router = APIRouter(tags=["AI Caption Generator"])


def get_caption_service() -> CaptionService:
    llm_client = get_llm_client()
    prompt_manager = PromptManager()
    return CaptionService(llm_client=llm_client, prompt_manager=prompt_manager)


@router.post(
    "/caption",
    response_model=ApiResponse[CaptionResponseData],
    summary="Generate Social Media Post Captions",
    description="Generates exactly 3 captions based on topic, tone, and language parameters."
)
async def generate_caption(
    request: Request,
    body: CaptionRequest,
    caption_service: CaptionService = Depends(get_caption_service)
) -> ApiResponse[CaptionResponseData]:
    result = await caption_service.generate_captions(body)

    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    return create_response(
        data=result,
        message="Captions Generated",
        success=True,
        request_id=request_id,
        processing_time=processing_time
    )
