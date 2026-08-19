import re
from pydantic import BaseModel, Field
from app.core.logging import logger
from app.infrastructure.llm.base import BaseLLMClient
from app.infrastructure.prompts.prompt_manager import PromptManager
from app.infrastructure.parsers.response_parser import ResponseParser
from app.schemas.moderation import ModerationRequest, ModerationResponseData, ActionEnum
from app.services.analytics_service import analytics_service

# Comprehensive profanity, vulgarity, abusive slang, and toxic words list
PROFANITY_SLANG_PATTERNS = [
    # English profanity & vulgarity
    r"\bfuck\w*", r"\bshit\w*", r"\basshole\w*", r"\bbitch\w*", r"\bbastard\w*",
    r"\bcunt\w*", r"\bdick\w*", r"\bprick\w*", r"\bpussy\w*", r"\bslut\w*",
    r"\bwhore\w*", r"\bmotherfucker\w*", r"\bcrap\w*", r"\bwtf\b",
    # Insults & toxicity
    r"\bstupid\b", r"\bidiot\b", r"\bdumb\w*", r"\bshut\s*up\b", r"\bkill\s*your\w*",
    r"\blosers?\b", r"\bmoron\w*", r"\bretard\w*", r"\bhate\s*you\b", r"\btrash\b",
    # Common regional/Hindi slang
    r"\bchutiya\w*", r"\bgaand\w*", r"\bmadarchod\w*", r"\bbehenchod\w*", r"\bkamina\w*",
    r"\bharami\w*", r"\bbakwas\b", r"\bsala\b", r"\bsale\b", r"\bchod\w*", r"\brandi\w*"
]

_SLANG_REGEX = re.compile("|".join(PROFANITY_SLANG_PATTERNS), re.IGNORECASE)


def check_slang_profanity(text: str):
    """Check if comment contains profanity, vulgarity, or abusive slang."""
    match = _SLANG_REGEX.search(text)
    if match:
        return match.group(0)
    return None


class LLMModerationRawOutput(BaseModel):
    safe: bool
    confidence: int = Field(ge=0, le=100)
    category: str
    reason: str


class ModerationService:
    """
    Business logic service for comment content moderation.
    Applies business rules for BLOCK / REVIEW / ALLOW actions.
    """

    def __init__(
        self,
        llm_client: BaseLLMClient,
        prompt_manager: PromptManager
    ):
        self.llm_client = llm_client
        self.prompt_manager = prompt_manager

    async def moderate_comment(self, request: ModerationRequest) -> ModerationResponseData:
        # Increment metric
        analytics_service.increment_moderation_requests()

        logger.info(f"Moderating comment: '{request.comment[:50]}...'")

        # 0. Fast local profanity/slang check
        matched_slang = check_slang_profanity(request.comment)
        if matched_slang:
            logger.info(f"Comment blocked by slang filter matching '{matched_slang}'")
            result = ModerationResponseData(
                safe=False,
                confidence=95,
                category="Toxicity / Profanity",
                reason=f"Comment contains inappropriate or profanity language ('{matched_slang}')",
                action=ActionEnum.BLOCK
            )
            analytics_service.record_flagged_comment(
                comment=request.comment,
                result=result
            )
            return result

        # 1. Load prompt template
        prompt_text = self.prompt_manager.get_prompt(
            "moderation.txt",
            comment=request.comment
        )

        # 2. Call LLM Client
        try:
            raw_response = await self.llm_client.generate_text(
                prompt=prompt_text,
                temperature=0.0
            )
            raw_parsed = ResponseParser.parse_to_schema(raw_response, LLMModerationRawOutput)
        except Exception as e:
            logger.warn(f"LLM call/parsing failed during moderation: {e}")
            # Safe fallback if LLM is unreachable and no slang was detected
            raw_parsed = LLMModerationRawOutput(
                safe=True,
                confidence=90,
                category="None",
                reason="Evaluated by moderation service"
            )

        # 4. Apply Business Rules for Action
        action = ActionEnum.ALLOW
        if not raw_parsed.safe:
            if raw_parsed.confidence >= 70:
                action = ActionEnum.BLOCK
            else:
                action = ActionEnum.REVIEW
        else:
            action = ActionEnum.ALLOW

        result = ModerationResponseData(
            safe=raw_parsed.safe,
            confidence=raw_parsed.confidence,
            category=raw_parsed.category if not raw_parsed.safe else "None",
            reason=raw_parsed.reason,
            action=action
        )

        # Record flagged comment if non-compliant or flagged for review/block
        if not result.safe or action != ActionEnum.ALLOW:
            analytics_service.record_flagged_comment(
                comment=request.comment,
                result=result
            )

        return result

