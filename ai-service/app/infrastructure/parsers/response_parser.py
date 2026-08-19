import json
import re
from typing import Any, Dict, Type
from pydantic import BaseModel, ValidationError

from app.core.exceptions import AIResponseParseException
from app.core.logging import logger


class ResponseParser:
    """
    Reusable response parser to clean, extract, and parse text and JSON outputs from LLM providers.
    """

    @staticmethod
    def extract_json(raw_response: str) -> Dict[str, Any]:
        """
        Extracts JSON dictionary from raw response string, cleaning markdown code fences (```json ... ```).
        """
        if not raw_response:
            raise AIResponseParseException("Raw response text is empty.")

        cleaned = raw_response.strip()

        # Remove markdown code fences if present
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\n?", "", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"\n?```$", "", cleaned)
            cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from LLM output: {str(e)} | Raw: {raw_response[:200]}")
            raise AIResponseParseException(f"Invalid JSON formatted response: {str(e)}")

    @staticmethod
    def parse_to_schema(raw_response: str, schema_class: Type[BaseModel]) -> BaseModel:
        """
        Extracts JSON and parses it into specified Pydantic BaseModel class.
        """
        json_dict = ResponseParser.extract_json(raw_response)
        try:
            return schema_class.model_validate(json_dict)
        except ValidationError as e:
            logger.error(f"Schema validation error on LLM response: {str(e)}")
            raise AIResponseParseException(f"Response validation failed against schema {schema_class.__name__}")
