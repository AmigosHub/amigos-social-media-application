from typing import Optional
from app.config.settings import settings
from app.infrastructure.llm.base import BaseLLMClient
from app.schemas.health import HealthResponse, ComponentHealth


class HealthService:
    """
    Health Service managing application system health checks and component statuses.
    """

    def __init__(self, llm_client: Optional[BaseLLMClient] = None):
        self.llm_client = llm_client

    async def get_health_status(self) -> HealthResponse:
        """
        Gathers system health details across subsystems.
        """
        components = {
            "application": ComponentHealth(
                status="UP",
                details={
                    "name": settings.APP_NAME,
                    "environment": settings.APP_ENV,
                    "debugMode": settings.DEBUG
                }
            )
        }

        provider_key = f"{settings.LLM_PROVIDER.lower()}_api"
        if self.llm_client:
            llm_health = await self.llm_client.health_check()
            components[provider_key] = ComponentHealth(
                status=llm_health.get("status", "UNKNOWN"),
                details=llm_health
            )
        else:
            components[provider_key] = ComponentHealth(
                status="UP",
                details={"status": "UNCHECKED", "message": "Client not injected in probe"}
            )

        overall_status = "HEALTHY"
        if any(comp.status == "DOWN" for comp in components.values()):
            overall_status = "UNHEALTHY"

        return HealthResponse(
            status=overall_status,
            environment=settings.APP_ENV,
            components=components
        )
