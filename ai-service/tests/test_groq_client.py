import pytest
from unittest.mock import MagicMock, AsyncMock

from app.infrastructure.llm.groq_client import GroqClient
from app.infrastructure.llm.factory import get_llm_client
from app.core.exceptions import LLMProviderException


@pytest.mark.asyncio
async def test_groq_client_mock_completion():
    """
    Tests text generation via mocked Groq client.
    """
    client = GroqClient(api_key="gsk_mock_test_key_12345")
    
    mock_choice = MagicMock()
    mock_choice.message.content = "Generated text from Groq AI"
    mock_response = MagicMock()
    mock_response.choices = [mock_choice]
    
    mock_async_groq = MagicMock()
    mock_async_groq.chat.completions.create = AsyncMock(return_value=mock_response)
    client._client = mock_async_groq

    result = await client.generate_text(prompt="Test prompt")
    assert result == "Generated text from Groq AI"


@pytest.mark.asyncio
async def test_groq_client_fallback_mode():
    """
    Tests fallback output generation when no API key is provided.
    """
    client = GroqClient(api_key="")
    assert client._client is None

    result = await client.generate_text(prompt="Generate caption for Beach Vacation")
    assert "Beach Vacation" in result or "captions" in result


@pytest.mark.asyncio
async def test_groq_client_health_check():
    """
    Tests health check in fallback and mocked live mode.
    """
    client = GroqClient(api_key="")
    health = await client.health_check()
    assert health["status"] == "UP"
    assert health["provider"] == "Groq AI"
    assert "fallback" in health["message"].lower()


def test_llm_factory_default():
    """
    Tests that get_llm_client defaults to GroqClient.
    """
    client = get_llm_client()
    assert isinstance(client, GroqClient)
