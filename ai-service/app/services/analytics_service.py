import uuid
import json
import os
from datetime import datetime, timezone
from typing import List
from threading import Lock

from app.schemas.analytics import AnalyticsResponseData, FlaggedCommentItem
from app.schemas.moderation import ModerationResponseData

# Persist data to this file so it survives container restarts and server reloads
def _get_default_persist_path() -> str:
    env_path = os.environ.get("ANALYTICS_PERSIST_PATH")
    if env_path:
        return env_path
    # Fallback to local data directory relative to current working directory or script location
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(base_dir, "data", "analytics.json")

_PERSIST_PATH = _get_default_persist_path()


def _load_persisted() -> dict:
    """Load saved analytics from disk. Returns empty structure on first run."""
    try:
        os.makedirs(os.path.dirname(_PERSIST_PATH), exist_ok=True)
        if os.path.exists(_PERSIST_PATH):
            with open(_PERSIST_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"[Analytics] Warning loading persisted analytics from {_PERSIST_PATH}: {e}")
    return {"caption_count": 0, "moderation_count": 0, "flagged_comments": []}


def _save_persisted(data: dict) -> None:
    """Write analytics to disk."""
    try:
        os.makedirs(os.path.dirname(_PERSIST_PATH), exist_ok=True)
        with open(_PERSIST_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"[Analytics] Error saving persisted analytics to {_PERSIST_PATH}: {e}")


class AnalyticsService:
    """
    Thread-safe Analytics & Flagged Comments tracker.
    Data is persisted to disk so it survives container/process restarts.
    """
    _instance = None
    _lock = Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                saved = _load_persisted()
                cls._instance._caption_count = saved.get("caption_count", 0)
                cls._instance._moderation_count = saved.get("moderation_count", 0)
                # Rebuild FlaggedCommentItem objects from saved dicts
                raw_flagged = saved.get("flagged_comments", [])
                cls._instance._flagged_comments: List[FlaggedCommentItem] = []
                for item in raw_flagged:
                    try:
                        cls._instance._flagged_comments.append(FlaggedCommentItem(**item))
                    except Exception:
                        pass  # skip malformed entries
            return cls._instance

    def _persist(self) -> None:
        """Serialize current state to disk (called while lock is held)."""
        data = {
            "caption_count": self._caption_count,
            "moderation_count": self._moderation_count,
            "flagged_comments": [item.model_dump() for item in self._flagged_comments],
        }
        _save_persisted(data)

    def increment_caption_requests(self) -> None:
        with self._lock:
            self._caption_count += 1
            self._persist()

    def increment_moderation_requests(self) -> None:
        with self._lock:
            self._moderation_count += 1
            self._persist()

    def record_flagged_comment(self, comment: str, result: ModerationResponseData) -> None:
        with self._lock:
            item = FlaggedCommentItem(
                id=str(uuid.uuid4()),
                comment=comment,
                confidence=result.confidence,
                category=result.category,
                reason=result.reason,
                action=result.action.value if hasattr(result.action, "value") else str(result.action),
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            self._flagged_comments.append(item)
            self._persist()

    def get_metrics(self) -> AnalyticsResponseData:
        with self._lock:
            return AnalyticsResponseData(
                captionRequests=self._caption_count,
                moderationRequests=self._moderation_count,
                flaggedComments=len(self._flagged_comments)
            )

    def get_flagged_comments(self) -> List[FlaggedCommentItem]:
        with self._lock:
            return list(reversed(self._flagged_comments))


# Global singleton instance for dependency injection
analytics_service = AnalyticsService()
