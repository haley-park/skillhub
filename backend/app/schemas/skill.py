from __future__ import annotations

from datetime import datetime
from uuid import UUID
from typing import Literal

from pydantic import BaseModel, ConfigDict


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: str
    tags: list[str]
    version: str | None
    icon: str | None
    last_modified: datetime
    indexed_at: datetime


class SkillDetailOut(SkillOut):
    model_config = ConfigDict(from_attributes=False)
    body: str = ""
    path: str = ""


class TriggerTestRequest(BaseModel):
    prompt: str


class TriggerTestResult(BaseModel):
    triggered: bool
    reason: str
    tokens_used: int
    input_tokens: int
    output_tokens: int
    latency_ms: int
    cost_usd: float


class SyncResult(BaseModel):
    added: int
    updated: int
    removed: int


class OpenRequest(BaseModel):
    target: Literal["editor", "folder"]
