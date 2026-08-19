import pytest


@pytest.mark.asyncio
async def test_caption_generator_success(async_client):
    """
    Tests POST /api/v1/caption with valid payload.
    """
    payload = {
        "topic": "Beach Vacation",
        "tone": "Professional",
        "language": "English"
    }

    response = await async_client.post("/api/v1/caption", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Captions Generated"
    assert "requestId" in data
    assert "processingTime" in data
    assert len(data["data"]["captions"]) == 3


@pytest.mark.asyncio
async def test_caption_generator_validation_error(async_client):
    """
    Tests POST /api/v1/caption with invalid tone value.
    """
    payload = {
        "topic": "Beach Vacation",
        "tone": "UltraFunny", # Invalid enum
        "language": "English"
    }

    response = await async_client.post("/api/v1/caption", json=payload)
    assert response.status_code == 422

    data = response.json()
    assert data["success"] is False
    assert data["message"] == "Request validation error"
