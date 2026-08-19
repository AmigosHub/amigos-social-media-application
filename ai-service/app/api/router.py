from fastapi import APIRouter
from app.api.health.endpoint import router as health_router
from app.api.caption.endpoint import router as caption_router
from app.api.moderation.endpoint import router as moderation_router
from app.api.analytics.endpoint import router as analytics_router

api_router = APIRouter()

# Register health check router under root /api/health
api_router.include_router(health_router)

# Register feature endpoints under /api/v1 prefix
v1_router = APIRouter(prefix="/v1")
v1_router.include_router(caption_router)
v1_router.include_router(moderation_router)
v1_router.include_router(analytics_router)

api_router.include_router(v1_router)
