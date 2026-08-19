import pytest


@pytest.mark.asyncio
async def test_analytics_metrics_and_flagged_comments(async_client):
    """
    Tests GET /api/v1/analytics and GET /api/v1/flagged-comments.
    """
    # 1. Fetch initial metrics
    resp1 = await async_client.get("/api/v1/analytics")
    assert resp1.status_code == 200
    metrics1 = resp1.json()["data"]

    # 2. Trigger moderation request with toxic comment
    mod_payload = {"comment": "You are stupid."}
    await async_client.post("/api/v1/moderate", json=mod_payload)

    # 3. Verify metrics incremented
    resp2 = await async_client.get("/api/v1/analytics")
    metrics2 = resp2.json()["data"]
    assert metrics2["moderationRequests"] == metrics1["moderationRequests"] + 1

    # 4. Verify flagged comment log
    resp3 = await async_client.get("/api/v1/flagged-comments")
    assert resp3.status_code == 200
    flagged = resp3.json()["data"]
    assert len(flagged) >= 1
    assert "You are stupid." in flagged[0]["comment"]
