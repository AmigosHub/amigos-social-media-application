import asyncio
import json
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel

from app.config.settings import settings
from app.core.exceptions import LLMProviderException
from app.core.logging import logger
from app.infrastructure.llm.base import BaseLLMClient


class GeminiClient(BaseLLMClient):
    """
    Production-ready Gemini API client using Google GenAI SDK.
    Supports automatic retries, fallback simulation for unconfigured keys, and strict error handling.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        timeout: int = 30
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL
        self.timeout = timeout
        self._client = None
        self._initialize_client()

    def _initialize_client(self) -> None:
        """Initializes the google-genai client if API key is present."""
        if not self.api_key or self.api_key in ["your_gemini_api_key_here", "your_actual_gemini_api_key"]:
            logger.warning("Gemini API key is not set or using placeholder. Client running in fallback mode.")
            return

        try:
            from google import genai
            self._client = genai.Client(api_key=self.api_key)
            logger.info(f"GeminiClient initialized successfully with model: {self.model_name}")
        except ImportError:
            logger.warning("google-genai SDK not installed. Operating in fallback mode.")
        except Exception as e:
            logger.error(f"Failed to initialize GeminiClient: {str(e)}")

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        max_retries: int = 2
    ) -> str:
        """
        Sends prompt to Gemini API with retry logic and returns plain text output.
        """
        if not self._client:
            return self._fallback_generate_text(prompt)

        last_error = None
        for attempt in range(max_retries + 1):
            try:
                from google.genai import types
                config = types.GenerateContentConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                    system_instruction=system_instruction
                )

                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=config
                )

                if response and response.text:
                    return response.text.strip()
                
                raise LLMProviderException("Gemini returned an empty text response.")

            except Exception as e:
                last_error = e
                logger.warning(f"Gemini API attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries:
                    await asyncio.sleep(0.5 * (attempt + 1))

        logger.error(f"Gemini API request failed after {max_retries + 1} attempts: {str(last_error)}")
        raise LLMProviderException(f"Gemini API Error: {str(last_error)}")

    async def generate_structured_output(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: Optional[str] = None,
        temperature: float = 0.2
    ) -> BaseModel:
        """
        Sends prompt to Gemini API and parses response into requested Pydantic model.
        """
        if not self._client:
            fallback_text = self._fallback_generate_text(prompt)
            return response_schema.model_validate_json(fallback_text)

        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                temperature=temperature,
                response_mime_type="application/json",
                response_schema=response_schema,
                system_instruction=system_instruction
            )

            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config
            )

            if hasattr(response, "parsed") and response.parsed:
                return response.parsed

            if response.text:
                return response_schema.model_validate_json(response.text)

            raise LLMProviderException("Gemini returned empty structured output.")

        except Exception as e:
            logger.error(f"Structured Gemini API call failed: {str(e)}")
            raise LLMProviderException(f"Failed to obtain structured response: {str(e)}")

    def _fallback_generate_text(self, prompt: str) -> str:
        """
        Fallback response generator for development/test environments without live API key.
        """
        lower_prompt = prompt.lower()
        if "caption" in lower_prompt or "captions" in lower_prompt:
            return json.dumps({
                "captions": [
                    "✨ Exploring new horizons! Every moment spent here brings endless memories. 🌊 #VacationVibes #TravelGoals",
                    "Living for days like these! Sunny skies, good times, and unforgettable experiences. ☀️ #GoodTimes #Adventure",
                    "Unplugged and rejuvenated. Taking in the beauty of life one sunset at a time. 🌴 #Wanderlust #Relaxation"
                ]
            })
        elif "moderation" in lower_prompt or "comment" in lower_prompt:
            toxic_words = [
                "stupid", "idiot", "hate", "kill", "shut up", "dumb", "fuck", "shit",
                "bitch", "bastard", "asshole", "crap", "chutiya", "gaand", "bakwas"
            ]
            if any(toxic_word in lower_prompt for toxic_word in toxic_words):
                return json.dumps({
                    "safe": False,
                    "confidence": 95,
                    "category": "Toxicity / Profanity",
                    "reason": "Detected inappropriate, slang, or offensive language."
                })
            return json.dumps({
                "safe": True,
                "confidence": 98,
                "category": "None",
                "reason": "Comment complies with community guidelines."
            })
        
        return json.dumps({"result": "AI response generated successfully."})

    async def health_check(self) -> Dict[str, Any]:
        """
        Validates connection with Gemini API.
        """
        if not self.api_key or self.api_key in ["your_gemini_api_key_here", "your_actual_gemini_api_key"]:
            return {
                "status": "UP",
                "message": "GeminiClient operating in fallback mode (no live API key provided).",
                "model": self.model_name
            }

        try:
            test_response = await self.generate_text(prompt="ping", temperature=0.0, max_tokens=5)
            return {
                "status": "UP",
                "message": "Successfully connected to Gemini API",
                "model": self.model_name,
                "probeResponse": test_response
            }
        except Exception as e:
            return {
                "status": "DOWN",
                "message": f"Gemini API connection error: {str(e)}",
                "model": self.model_name
            }
