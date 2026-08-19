from app.config.settings import settings
from app.infrastructure.llm.base import BaseLLMClient
from app.infrastructure.llm.groq_client import GroqClient
from app.infrastructure.llm.gemini_client import GeminiClient


def get_llm_client() -> BaseLLMClient:
    """
    Factory function returning configured LLM Client based on settings.LLM_PROVIDER.
    Defaults to GroqClient.
    """
    provider = settings.LLM_PROVIDER.lower().strip()
    if provider == "gemini":
        return GeminiClient()
    return GroqClient()
