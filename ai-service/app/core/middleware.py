import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

from app.core.logging import logger, RequestIDLogFilter


class RequestIdMiddleware(BaseHTTPMiddleware):
    """
    Middleware that assigns a unique X-Request-ID trace header to every incoming request.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id

        # Update logger filter context
        for handler in logger.handlers:
            handler.addFilter(RequestIDLogFilter(request_id))

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class ResponseTimeMiddleware(BaseHTTPMiddleware):
    """
    Middleware that measures request execution time and injects X-Response-Time header.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        execution_time_ms = (time.perf_counter() - start_time) * 1000
        formatted_time = f"{execution_time_ms:.2f}ms"
        
        request.state.processing_time = formatted_time
        response.headers["X-Response-Time"] = formatted_time
        return response
