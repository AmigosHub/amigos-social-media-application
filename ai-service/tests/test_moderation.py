import pytest


@pytest.mark.asyncio
async def test_moderation_clean_comment(async_client):
    """
    Tests POST /api/v1/moderate with safe comment.
    """
    payload = {
        "comment": "Have a wonderful day everyone!"
    }

    response = await async_client.post("/api/v1/moderate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Moderation Completed"
    assert data["data"]["safe"] is True
    assert data["data"]["action"] == "ALLOW"


@pytest.mark.asyncio
async def test_moderation_toxic_comment(async_client):
    """
    Tests POST /api/v1/moderate with toxic comment triggering BLOCK action.
    """
    payload = {
        "comment": "You are stupid and I hate you."
    }

    response = await async_client.post("/api/v1/moderate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert data["data"]["safe"] is False
    assert data["data"]["action"] == "BLOCK"


@pytest.mark.asyncio
async def test_moderation_slang_comment(async_client):
    """
    Tests POST /api/v1/moderate with slang comment triggering BLOCK action.
    """
    payload = {
        "comment": "This post is total chutiya bakwas content."
    }

    response = await async_client.post("/api/v1/moderate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert data["data"]["safe"] is False
    assert data["data"]["action"] == "BLOCK"

