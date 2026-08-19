class AIServiceException(Exception):
    """Base exception for all AI Microservice errors."""
    def __init__(self, message: str = "An AI microservice error occurred", status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class LLMProviderException(AIServiceException):
    """Raised when communication with an LLM Provider (e.g. Groq AI, Gemini) fails."""
    def __init__(self, message: str = "LLM Provider communication error", status_code: int = 502):
        super().__init__(message=message, status_code=status_code)


class PromptNotFoundException(AIServiceException):
    """Raised when a prompt template is missing or unreadable."""
    def __init__(self, prompt_name: str):
        super().__init__(message=f"Prompt template '{prompt_name}' not found", status_code=444)


class AIResponseParseException(AIServiceException):
    """Raised when raw response from LLM cannot be parsed into target structure."""
    def __init__(self, message: str = "Failed to parse AI provider response"):
        super().__init__(message=message, status_code=422)


class InvalidAPIKeyException(AIServiceException):
    """Raised when invalid API key is provided."""
    def __init__(self, message: str = "Invalid or missing API key"):
        super().__init__(message=message, status_code=401)
