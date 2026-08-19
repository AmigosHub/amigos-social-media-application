from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class ComponentHealth(BaseModel):
    status: str = Field(..., description="Status of component ('UP', 'DOWN', 'DEGRADED')")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Diagnostic details")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall service status ('HEALTHY', 'UNHEALTHY')")
    environment: str = Field(..., description="Running environment ('development', 'production')")
    components: Dict[str, ComponentHealth] = Field(..., description="Subsystem health status map")
