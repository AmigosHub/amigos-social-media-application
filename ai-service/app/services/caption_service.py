from app.core.logging import logger
from app.infrastructure.llm.base import BaseLLMClient
from app.infrastructure.prompts.prompt_manager import PromptManager
from app.infrastructure.parsers.response_parser import ResponseParser
from app.schemas.caption import CaptionRequest, CaptionResponseData
from app.services.analytics_service import analytics_service


class CaptionService:
    """
    Business logic service for generating social media post captions.
    """

    def __init__(
        self,
        llm_client: BaseLLMClient,
        prompt_manager: PromptManager
    ):
        self.llm_client = llm_client
        self.prompt_manager = prompt_manager

    async def generate_captions(self, request: CaptionRequest) -> CaptionResponseData:
        # Increment metric
        analytics_service.increment_caption_requests()

        logger.info(f"Generating captions for topic: '{request.topic}' | Tone: {request.tone.value} | Lang: {request.language}")

        # 1. Load prompt template
        prompt_text = self.prompt_manager.get_prompt(
            "caption.txt",
            topic=request.topic,
            tone=request.tone.value,
            language=request.language
        )

        # 2. Call LLM Client with elevated temperature for high creativity and variety
        raw_response = await self.llm_client.generate_text(
            prompt=prompt_text,
            temperature=0.85
        )

        # 3. Parse JSON response
        parsed = ResponseParser.parse_to_schema(raw_response, CaptionResponseData)
        
        # Ensure exactly 3 captions
        if len(parsed.captions) > 3:
            parsed.captions = parsed.captions[:3]
        elif len(parsed.captions) < 3:
            # Fill missing if needed
            while len(parsed.captions) < 3:
                parsed.captions.append(f"{request.topic} - Captivating moment! #{request.tone.value}")

        return parsed
