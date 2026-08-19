import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.infrastructure.llm.base import BaseLLMClient


@pytest.fixture
def mock_llm_client():
    """
    Mock LLM Client fixture to prevent calling actual LLM APIs during tests.
    """
    client = MagicMock(spec=BaseLLMClient)
    client.generate_text = AsyncMock(return_value="Mocked AI response text")
    client.generate_structured_output = AsyncMock()
    client.health_check = AsyncMock(return_value={
        "status": "UP",
        "message": "Mock Groq AI status UP",
        "model": "llama-3.3-70b-versatile"
    })
    return client


@pytest.fixture
async def async_client():
    """
    HTTPX AsyncClient fixture configured for testing FastAPI endpoints.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
