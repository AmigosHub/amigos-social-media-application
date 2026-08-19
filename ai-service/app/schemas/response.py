from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """
    Standardized API Envelope for all Microservice responses.
    """
    success: bool = Field(..., description="Indicates whether the request was successful")
    message: str = Field(..., description="Descriptive status or error message")
    requestId: str = Field(..., description="Unique request tracing ID")
    processingTime: str = Field(..., description="Total execution time (e.g. 15.20ms)")
    data: Optional[T] = Field(default=None, description="Payload data returned by the API")

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "Operation completed successfully",
                "requestId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
                "processingTime": "14.20ms",
                "data": None
            }
        }
    }


def create_response(
    data: Optional[Any] = None,
    message: str = "Success",
    success: bool = True,
    request_id: str = "N/A",
    processing_time: str = "0.00ms"
) -> ApiResponse[Any]:
    """
    Helper function to build an ApiResponse object.
    """
    return ApiResponse(
        success=success,
        message=message,
        requestId=request_id,
        processingTime=processing_time,
        data=data
    )
