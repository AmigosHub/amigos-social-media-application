import logging
import sys
from app.config.settings import settings


def setup_logger(name: str = "ai_service") -> logging.Logger:
    """
    Configures and returns a structured logger for the microservice.
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="[%(asctime)s] [%(levelname)s] [%(name)s] [ReqID: %(requestId)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


class RequestIDLogFilter(logging.Filter):
    """
    Injects request_id context into log records if present.
    """
    def __init__(self, request_id: str = "N/A"):
        super().__init__()
        self.request_id = request_id

    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, "requestId"):
            record.requestId = self.request_id
        return True


logger = setup_logger()
logger.addFilter(RequestIDLogFilter())
