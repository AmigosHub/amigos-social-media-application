import pytest


@pytest.mark.asyncio
async def test_health_check_endpoint(async_client):
    """
    Tests GET /health endpoint envelope format and standard fields.
    """
    response = await async_client.get("/health")
    assert response.status_code == 200

    payload = response.json()
    assert payload["success"] is True
    assert "requestId" in payload
    assert "processingTime" in payload
    assert payload["message"] == "AI Microservice status retrieved successfully"
    assert payload["data"]["status"] == "HEALTHY"
    assert "components" in payload["data"]


@pytest.mark.asyncio
async def test_api_v1_health_check_endpoint(async_client):
    """
    Tests GET /api/health endpoint.
    """
    response = await async_client.get("/api/health")
    assert response.status_code == 200

    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["components"]["application"]["status"] == "UP"
