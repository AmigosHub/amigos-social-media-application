import os
from pathlib import Path
from typing import Dict, Any, Optional

from app.core.exceptions import PromptNotFoundException
from app.core.logging import logger


class PromptManager:
    """
    Reusable Prompt Template Manager.
    Loads, caches, and formats prompt template text files from app/prompts/.
    """

    def __init__(self, prompts_dir: Optional[str] = None):
        if prompts_dir:
            self.prompts_dir = Path(prompts_dir)
        else:
            self.prompts_dir = Path(__file__).resolve().parent.parent.parent / "prompts"

        self._cache: Dict[str, str] = {}

    def get_prompt(self, template_name: str, **kwargs: Any) -> str:
        """
        Loads prompt template by filename (e.g. 'caption.txt' or 'caption') and formats with kwargs.
        """
        if not template_name.endswith(".txt"):
            filename = f"{template_name}.txt"
        else:
            filename = template_name

        if filename not in self._cache:
            file_path = self.prompts_dir / filename
            if not file_path.exists():
                logger.error(f"Prompt template missing at: {file_path}")
                raise PromptNotFoundException(prompt_name=filename)
            
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    self._cache[filename] = f.read()
            except Exception as e:
                logger.error(f"Failed to read prompt file {filename}: {str(e)}")
                raise PromptNotFoundException(prompt_name=filename)

        raw_template = self._cache[filename]
        if kwargs:
            try:
                return raw_template.format(**kwargs)
            except KeyError as e:
                logger.warning(f"Missing variable {e} when formatting prompt template '{filename}'")
                return raw_template

        return raw_template
