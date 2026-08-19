from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import AIServiceException
from app.core.logging import logger


async def ai_service_exception_handler(request: Request, exc: AIServiceException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    logger.error(f"AIServiceException [{exc.status_code}]: {exc.message}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "requestId": request_id,
            "processingTime": processing_time,
            "data": None
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    logger.warning(f"HTTPException [{exc.status_code}]: {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "requestId": request_id,
            "processingTime": processing_time,
            "data": None
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    logger.warning(f"ValidationError: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Request validation error",
            "requestId": request_id,
            "processingTime": processing_time,
            "data": {"errors": exc.errors()}
        }
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "N/A")
    processing_time = getattr(request.state, "processing_time", "0.00ms")

    logger.exception(f"Unhandled Exception: {str(exc)}")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
            "requestId": request_id,
            "processingTime": processing_time,
            "data": None
        }
    )
