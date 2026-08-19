from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config.settings import settings
from app.core.exceptions import AIServiceException
from app.core.exception_handlers import (
    ai_service_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler
)
from app.core.middleware import RequestIdMiddleware, ResponseTimeMiddleware
from app.core.logging import logger
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan Context Manager."""
    logger.info(f"Starting {settings.APP_NAME} in [{settings.APP_ENV}] mode on port {settings.PORT}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME} microservice.")


def create_application() -> FastAPI:
    """
    FastAPI Application Factory.
    Configures OpenAPI, Middlewares, Exception Handlers, and Routers.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        description="Production Generative AI Microservice for Amigos Platform.",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register Custom Middlewares (Order matters)
    app.add_middleware(ResponseTimeMiddleware)
    app.add_middleware(RequestIdMiddleware)

    # Register Global Exception Handlers
    app.add_exception_handler(AIServiceException, ai_service_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # Register API Routers
    app.include_router(api_router, prefix="/api")
    
    # Expose root-level /health endpoint as well for load balancers
    from app.api.health.endpoint import router as health_root_router
    app.include_router(health_root_router)

    return app


app = create_application()
