from fastapi import APIRouter, Request, Depends
from app.schemas.response import ApiResponse, create_response
from app.schemas.moderation import ModerationRequest, ModerationResponseData
from app.services.moderation_service import ModerationService
from app.infrastructure.llm.factory import get_llm_client
from app.infrastructure.prompts.prompt_manager import PromptManager

router = APIRouter(tags=["AI Comment Moderation"])


def get_moderation_service() -> ModerationService:
    llm_client = get_llm_client()
    prompt_manager = PromptManager()
    return ModerationService(llm_client=llm_client, prompt_manager=prompt_manager)


@router.post(
    "/moderate",
    response_model=ApiResponse[ModerationResponseData],
    summary="Evaluate Comment Safety & Category",
    description="Evaluates comment text for toxicity, harassment, spam, and returns safe/confidence/action classification."
)
async def moderate_comment(
    request: Request,
    body: ModerationRequest,
    moderation_service: ModerationService = Depends(get_moderation_service)
) -> ApiResponse[ModerationResponseData]:
    result = await moderation_service.moderate_comment(body)

    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    return create_response(
        data=result,
        message="Moderation Completed",
        success=True,
        request_id=request_id,
        processing_time=processing_time
    )
