from __future__ import annotations

import hashlib
from datetime import datetime
from pathlib import Path

import frontmatter
from sqlalchemy.orm import Session

from app.config import settings
from app.models.skill import Skill


def _compute_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def scan_skills_dir(db: Session) -> dict[str, int]:
    skills_path = settings.skills_path
    skills_path.mkdir(parents=True, exist_ok=True)

    found_names: set[str] = set()
    added = updated = removed = 0

    for entry in skills_path.iterdir():
        if not entry.is_dir():
            continue

        skill_file = entry / "SKILL.md"
        if not skill_file.exists():
            continue

        try:
            with open(skill_file, "r", encoding="utf-8") as f:
                post = frontmatter.load(f)

            meta = post.metadata
            name: str = str(meta.get("name") or entry.name)
            description: str = str(meta.get("description", "")).strip()
            if not description:
                continue

            raw_tags = meta.get("tags", [])
            tags: list[str] = [str(t) for t in raw_tags] if isinstance(raw_tags, list) else []
            version: str | None = str(meta["version"]) if meta.get("version") else None
            icon: str | None = str(meta["icon"]) if meta.get("icon") else None

            body: str = post.content
            body_hash = _compute_hash(body + description + "".join(tags))
            last_modified = datetime.fromtimestamp(skill_file.stat().st_mtime)

            found_names.add(name)

            existing = db.query(Skill).filter(Skill.name == name).first()
            if existing:
                if existing.body_hash != body_hash:
                    existing.description = description
                    existing.tags = tags
                    existing.version = version
                    existing.icon = icon
                    existing.body_hash = body_hash
                    existing.last_modified = last_modified
                    existing.path = str(skill_file)
                    existing.indexed_at = datetime.utcnow()
                    db.commit()
                    updated += 1
            else:
                skill = Skill(
                    name=name,
                    description=description,
                    tags=tags,
                    version=version,
                    icon=icon,
                    path=str(skill_file),
                    body_hash=body_hash,
                    last_modified=last_modified,
                )
                db.add(skill)
                db.commit()
                added += 1

        except Exception as exc:
            print(f"[scanner] Error processing {skill_file}: {exc}")

    for skill in db.query(Skill).all():
        if skill.name not in found_names:
            db.delete(skill)
            removed += 1

    if removed:
        db.commit()

    return {"added": added, "updated": updated, "removed": removed}


def get_skill_body(name: str) -> str | None:
    skills_path = settings.skills_path
    skill_file = skills_path / name / "SKILL.md"
    if not skill_file.exists():
        return None
    with open(skill_file, "r", encoding="utf-8") as f:
        post = frontmatter.load(f)
    return post.content
