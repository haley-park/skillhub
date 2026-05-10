from __future__ import annotations

from datetime import datetime
from uuid import uuid4, UUID

from sqlalchemy import Text, String, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False, server_default="{}")
    version: Mapped[str | None] = mapped_column(String(50), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    path: Mapped[str] = mapped_column(Text, nullable=False)
    body_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    last_modified: Mapped[datetime] = mapped_column(nullable=False)
    indexed_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    trigger_tests: Mapped[list[TriggerTest]] = relationship("TriggerTest", back_populates="skill", cascade="all, delete-orphan")


class TriggerTest(Base):
    __tablename__ = "trigger_tests"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    skill_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    triggered: Mapped[bool] = mapped_column(Boolean, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    tokens_used: Mapped[int] = mapped_column(Integer, nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    skill: Mapped[Skill] = relationship("Skill", back_populates="trigger_tests")
