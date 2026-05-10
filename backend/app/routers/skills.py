from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.skill import Skill, TriggerTest
from app.schemas.skill import SkillOut, SkillDetailOut, TriggerTestRequest, TriggerTestResult
from app.services import scanner, trigger as trigger_svc

router = APIRouter(prefix="/api/skills", tags=["skills"])


@router.get("", response_model=list[SkillOut])
def list_skills(
    q: str | None = Query(default=None),
    tags: list[str] = Query(default=[]),
    db: Session = Depends(get_db),
) -> list[Skill]:
    query = db.query(Skill)

    if q:
        term = f"%{q}%"
        from sqlalchemy import or_, cast, String
        from sqlalchemy.dialects.postgresql import ARRAY
        query = query.filter(
            or_(
                Skill.name.ilike(term),
                Skill.description.ilike(term),
                Skill.tags.cast(String).ilike(term),
            )
        )

    if tags:
        from sqlalchemy import func
        for tag in tags:
            query = query.filter(Skill.tags.any(tag))

    return query.order_by(Skill.last_modified.desc()).all()


@router.get("/{name}", response_model=SkillDetailOut)
def get_skill(name: str, db: Session = Depends(get_db)) -> dict:
    skill = db.query(Skill).filter(Skill.name == name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    body = scanner.get_skill_body(name) or ""

    return SkillDetailOut.model_validate({
        "id": skill.id,
        "name": skill.name,
        "description": skill.description,
        "tags": skill.tags,
        "version": skill.version,
        "icon": skill.icon,
        "last_modified": skill.last_modified,
        "indexed_at": skill.indexed_at,
        "path": skill.path,
        "body": body,
    })


@router.post("/{name}/test", response_model=TriggerTestResult)
def test_skill_trigger(
    name: str,
    req: TriggerTestRequest,
    db: Session = Depends(get_db),
) -> dict:
    skill = db.query(Skill).filter(Skill.name == name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    try:
        result = trigger_svc.test_trigger(skill.name, skill.description, req.prompt)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Anthropic API error: {exc}")

    log = TriggerTest(
        skill_id=skill.id,
        prompt=req.prompt,
        triggered=result["triggered"],
        reason=result["reason"],
        tokens_used=result["tokens_used"],
        latency_ms=result["latency_ms"],
    )
    db.add(log)
    db.commit()

    return result
