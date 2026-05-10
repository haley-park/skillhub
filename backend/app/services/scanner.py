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


def _collect_skill_files(base_path: Path) -> list[Path]:
    """
    한 디렉터리에서 스킬 파일을 수집. 두 가지 구조 지원:
      1. <dir>/<name>/SKILL.md  (폴더 방식)
      2. <dir>/<name>.md        (파일 직접 방식)
    심볼릭 링크도 follow해서 처리.
    """
    if not base_path.exists():
        return []

    files: list[Path] = []
    for entry in base_path.iterdir():
        if entry.is_dir():
            skill_file = entry / "SKILL.md"
            if skill_file.exists():
                files.append(skill_file)
        elif entry.is_file() and entry.suffix == ".md":
            files.append(entry)

    return files


def _all_skill_files() -> list[Path]:
    """skills_dir + commands_dir 모두에서 수집. 중복 실제 경로 제거."""
    seen: set[Path] = set()
    result: list[Path] = []

    for p in (
        _collect_skill_files(settings.skills_path)
        + _collect_skill_files(settings.commands_path)
    ):
        real = p.resolve()
        if real not in seen:
            seen.add(real)
            result.append(p)

    return result


def _parse_skill_file(skill_file: Path) -> dict | None:
    """파일을 파싱해 스킬 메타+본문 dict 반환. 필수 필드 없으면 None."""
    with open(skill_file, "r", encoding="utf-8") as f:
        post = frontmatter.load(f)

    meta = post.metadata
    default_name = (
        skill_file.parent.name
        if skill_file.name == "SKILL.md"
        else skill_file.stem
    )

    name: str = str(meta.get("name") or default_name)
    description: str = str(meta.get("description", "")).strip()
    if not description:
        return None

    return {
        "name": name,
        "description": description,
        "tags": [str(t) for t in meta.get("tags", [])] if isinstance(meta.get("tags"), list) else [],
        "version": str(meta["version"]) if meta.get("version") else None,
        "icon": str(meta["icon"]) if meta.get("icon") else None,
        "body": post.content,
        "body_hash": _compute_hash(post.content + description),
        "last_modified": datetime.fromtimestamp(skill_file.stat().st_mtime),
        "path": str(skill_file),
    }


def scan_skills_dir(db: Session) -> dict[str, int]:
    settings.skills_path.mkdir(parents=True, exist_ok=True)

    found_names: set[str] = set()
    added = updated = removed = 0

    for skill_file in _all_skill_files():
        try:
            data = _parse_skill_file(skill_file)
            if data is None:
                continue

            name = data["name"]
            found_names.add(name)

            existing = db.query(Skill).filter(Skill.name == name).first()
            if existing:
                if existing.body_hash != data["body_hash"]:
                    for field in ("description", "tags", "version", "icon", "body_hash", "last_modified", "path"):
                        setattr(existing, field, data[field])
                    existing.indexed_at = datetime.utcnow()
                    db.commit()
                    updated += 1
            else:
                db.add(Skill(
                    name=name,
                    description=data["description"],
                    tags=data["tags"],
                    version=data["version"],
                    icon=data["icon"],
                    path=data["path"],
                    body_hash=data["body_hash"],
                    last_modified=data["last_modified"],
                ))
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
    for skill_file in _all_skill_files():
        try:
            data = _parse_skill_file(skill_file)
            if data and data["name"] == name:
                return data["body"]
        except Exception:
            continue
    return None
