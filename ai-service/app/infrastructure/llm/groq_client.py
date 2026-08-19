import asyncio
import json
import random
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel

from app.config.settings import settings
from app.core.exceptions import LLMProviderException
from app.core.logging import logger
from app.infrastructure.llm.base import BaseLLMClient


class GroqClient(BaseLLMClient):
    """
    Production-ready Groq AI client using Groq Async SDK.
    Leverages Groq's high-speed inference engine (Llama-3.3-70b, Llama-3.1-8b, Mixtral).
    Includes automatic retries, fallback simulation for unconfigured keys, and strict error handling.
    """

    INVALID_KEYS = ["", "your_groq_api_key_here", "gsk_your_groq_api_key_here", "your_actual_groq_api_key"]

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        timeout: int = 30
    ):
        self.api_key = api_key if api_key is not None else settings.GROQ_API_KEY
        self.model_name = model_name or settings.GROQ_MODEL
        self.timeout = timeout
        self._client = None
        self._initialize_client()

    def _initialize_client(self) -> None:
        """Initializes the Groq Async client if a valid API key is present."""
        if not self.api_key or self.api_key in self.INVALID_KEYS:
            logger.warning("Groq API key is not set or using placeholder. Client running in smart fallback mode.")
            return

        try:
            from groq import AsyncGroq
            self._client = AsyncGroq(
                api_key=self.api_key,
                timeout=float(self.timeout)
            )
            logger.info(f"GroqClient initialized successfully with model: {self.model_name}")
        except ImportError:
            logger.warning("groq SDK not installed. Operating in smart fallback mode.")
        except Exception as e:
            logger.error(f"Failed to initialize GroqClient: {str(e)}")

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.85,
        max_tokens: Optional[int] = None,
        max_retries: int = 2
    ) -> str:
        """
        Sends prompt to Groq API with retry logic and returns string output.
        """
        if not self._client:
            return self._fallback_generate_text(prompt)

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        last_error = None
        for attempt in range(max_retries + 1):
            try:
                kwargs: Dict[str, Any] = {
                    "model": self.model_name,
                    "messages": messages,
                    "temperature": temperature,
                }
                if max_tokens:
                    kwargs["max_tokens"] = max_tokens

                # If prompt requests JSON format, enable JSON object mode
                if "json" in prompt.lower() or (system_instruction and "json" in system_instruction.lower()):
                    kwargs["response_format"] = {"type": "json_object"}

                response = await self._client.chat.completions.create(**kwargs)

                if response and response.choices and response.choices[0].message.content:
                    return response.choices[0].message.content.strip()

                raise LLMProviderException("Groq returned an empty response.")

            except Exception as e:
                last_error = e
                logger.warning(f"Groq API attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries:
                    await asyncio.sleep(0.5 * (attempt + 1))

        logger.error(f"Groq API request failed after {max_retries + 1} attempts: {str(last_error)}")
        raise LLMProviderException(f"Groq API Error: {str(last_error)}")

    async def generate_structured_output(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: Optional[str] = None,
        temperature: float = 0.2
    ) -> BaseModel:
        """
        Sends prompt to Groq API and parses response into requested Pydantic model.
        """
        if not self._client:
            fallback_text = self._fallback_generate_text(prompt)
            return response_schema.model_validate_json(fallback_text)

        json_instruction = (system_instruction or "") + "\nReturn output formatted strictly as a valid JSON object."
        raw_text = await self.generate_text(
            prompt=prompt,
            system_instruction=json_instruction,
            temperature=temperature
        )

        try:
            return response_schema.model_validate_json(raw_text)
        except Exception as e:
            logger.error(f"Structured Groq API call parsing failed: {str(e)}")
            raise LLMProviderException(f"Failed to parse structured Groq response: {str(e)}")

    def _fallback_generate_text(self, prompt: str) -> str:
        """
        Smart fallback response generator for development/interview environments without live API key.
        Produces realistic, dynamic, human-like social media captions with randomized variety on each request.
        """
        lower_prompt = prompt.lower()

        # Extract topic and tone from prompt
        topic = "this moment"
        tone = "casual"

        if "topic:" in lower_prompt:
            try:
                topic = prompt.split("Topic:")[1].split("\n")[0].strip()
            except Exception:
                pass

        if "desired tone:" in lower_prompt:
            try:
                tone = prompt.split("Desired Tone:")[1].split("\n")[0].strip().lower()
            except Exception:
                pass

        if "caption" in lower_prompt or "captions" in lower_prompt:
            hashtag_topic = "".join(e for e in topic.title() if e.isalnum())

            pool_short = [
                f"✨ Late night vibes enjoying {topic}. 🌙 #{hashtag_topic} #GoodVibes #NightOut",
                f"Unwinding with {topic}. Pure bliss! 🌌 #{hashtag_topic} #ChillVibes #Moments",
                f"Savoring every moment of {topic}. 🍷 #{hashtag_topic} #Vibes #LivingLife",
                f"Terrace breeze and amazing feelings with {topic}. 🌿 #{hashtag_topic} #SunsetVibes"
            ]

            pool_engaging = [
                f"Nothing beats {topic} under the open sky. What is your favorite way to unwind? 👇 #{hashtag_topic} #Foodie #NightOut",
                f"Great food, cool breeze, and unbeatable vibes with {topic}. Rate this setup 1-10! 🥂 #{hashtag_topic} #WeekendVibes",
                f"Good company and {topic} make the best memories. Who else loves nights like this? 💬 #{hashtag_topic} #Lifestyle",
                f"Taking in the view with {topic}. How are you spending your evening? ✨ #{hashtag_topic} #EveningVibes"
            ]

            pool_cta = [
                f"Living for days and nights like this! Enjoying {topic} to the fullest. 🔥 #{hashtag_topic} #Goals #Memories",
                f"Creating unforgettable moments with {topic}. Here is to non-stop growth! 🚀 #{hashtag_topic} #SpecialMoments",
                f"Tag someone you would share {topic} with! 🍕✨ #{hashtag_topic} #TagAFriend #GoodTimes",
                f"Making core memories with {topic}. Never take small moments for granted! 💖 #{hashtag_topic} #Blessed"
            ]

            if tone == "funny":
                pool_short = [
                    f"Came for {topic}, staying because I ate too much to walk home! 😂 #{hashtag_topic} #FoodComa",
                    f"My doctor said I need more outdoors time... so here is {topic}! 🌌🍕 #{hashtag_topic} #HealthFirst",
                    f"Is it really {topic} if you don't take 50 photos before eating? 📸🍷 #{hashtag_topic} #InstaFood"
                ]
            elif tone == "inspirational":
                pool_short = [
                    f"🌟 Take time to pause, appreciate the small moments, and savor {topic}. ✨ #{hashtag_topic} #Inspiration",
                    f"Surround yourself with good energy, great vibes, and memories like {topic}. 💖 #{hashtag_topic} #Mindfulness",
                    f"Every sunset brings the promise of a new dawn. Enjoying {topic}! 🌅 #{hashtag_topic} #Grateful"
                ]
            elif tone == "marketing":
                pool_short = [
                    f"🔥 Elevate your experience with {topic}! Discover unforgettable moments today. 🚀 #{hashtag_topic} #Trending",
                    f"Looking for the ultimate experience? Don't miss out on {topic}! 🌟 #{hashtag_topic} #MustTry",
                    f"Transform your evening with {topic}! Book your spot now. 🎉 #{hashtag_topic} #Exclusive"
                ]

            captions = [
                random.choice(pool_short),
                random.choice(pool_engaging),
                random.choice(pool_cta)
            ]

            return json.dumps({"captions": captions})

        elif "moderation" in lower_prompt or "comment" in lower_prompt:
            comment_text = lower_prompt.split("evaluate:")[-1] if "evaluate:" in lower_prompt else lower_prompt
            toxic_keywords = ["stupid", "idiot", "kill", "shut up", "dumb", "trash", "scam", "loser"]
            found_toxic = any(word in comment_text for word in toxic_keywords)

            if found_toxic:
                return json.dumps({
                    "safe": False,
                    "confidence": 95,
                    "category": "Harassment",
                    "reason": "Detected abusive or hostile language violating community guidelines."
                })

            return json.dumps({
                "safe": True,
                "confidence": 98,
                "category": "None",
                "reason": "Comment complies fully with platform community guidelines."
            })

        return json.dumps({"result": "Groq AI response generated successfully."})

    async def health_check(self) -> Dict[str, Any]:
        """
        Validates connection with Groq AI API.
        """
        if not self.api_key or self.api_key in self.INVALID_KEYS:
            return {
                "status": "UP",
                "provider": "Groq AI",
                "message": "GroqClient operating in smart fallback mode (no live API key provided).",
                "model": self.model_name
            }

        try:
            test_response = await self.generate_text(prompt="Reply with 'pong'", temperature=0.0, max_tokens=10)
            return {
                "status": "UP",
                "provider": "Groq AI",
                "message": "Successfully connected to Groq AI API",
                "model": self.model_name,
                "probeResponse": test_response
            }
        except Exception as e:
            return {
                "status": "DOWN",
                "provider": "Groq AI",
                "message": f"Groq AI connection error: {str(e)}",
                "model": self.model_name
            }
