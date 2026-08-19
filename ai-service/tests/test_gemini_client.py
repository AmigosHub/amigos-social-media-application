import pytest
from unittest.mock import MagicMock

from app.infrastructure.llm.gemini_client import GeminiClient


@pytest.mark.asyncio
async def test_gemini_client_mock_text_generation():
    """
    Tests text generation via mocked Gemini client.
    """
    client = GeminiClient(api_key="mock_key")
    
    mock_genai_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Generated caption response"
    mock_genai_client.models.generate_content.return_value = mock_response

    client._client = mock_genai_client

    result = await client.generate_text(prompt="Hello Gemini")
    assert result == "Generated caption response"


@pytest.mark.asyncio
async def test_gemini_client_fallback_mode():
    """
    Tests fallback behavior when API key is unconfigured.
    """
    client = GeminiClient(api_key="")
    client._client = None

    result = await client.generate_text(prompt="Generate caption for Beach Vacation")
    assert "captions" in result
