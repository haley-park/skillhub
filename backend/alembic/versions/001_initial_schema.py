"""initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "skills",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("tags", postgresql.ARRAY(sa.String), nullable=False, server_default="{}"),
        sa.Column("version", sa.String(50), nullable=True),
        sa.Column("icon", sa.String(50), nullable=True),
        sa.Column("path", sa.Text, nullable=False),
        sa.Column("body_hash", sa.String(64), nullable=False),
        sa.Column("last_modified", sa.DateTime, nullable=False),
        sa.Column("indexed_at", sa.DateTime, nullable=False),
        sa.UniqueConstraint("name", name="uq_skills_name"),
    )
    op.create_index("ix_skills_name", "skills", ["name"])

    op.create_table(
        "trigger_tests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("skill_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("prompt", sa.Text, nullable=False),
        sa.Column("triggered", sa.Boolean, nullable=False),
        sa.Column("reason", sa.Text, nullable=False),
        sa.Column("tokens_used", sa.Integer, nullable=False),
        sa.Column("latency_ms", sa.Integer, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("trigger_tests")
    op.drop_index("ix_skills_name", table_name="skills")
    op.drop_table("skills")
