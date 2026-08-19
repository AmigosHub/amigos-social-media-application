from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel


class BaseLLMClient(ABC):
    """
    Abstract Base Client Interface for LLM Providers.
    Ensures Open/Closed Principle so OpenAI, Ollama, Claude, or RAG clients
    can be swapped without altering business logic.
    """

    @abstractmethod
    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """Generates raw string response from LLM given a prompt."""
        pass

    @abstractmethod
    async def generate_structured_output(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: Optional[str] = None,
        temperature: float = 0.2
    ) -> BaseModel:
        """Generates validated Pydantic model response from LLM."""
        pass

    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Checks provider connection status and API key validity."""
        pass
