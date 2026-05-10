from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.skill import Skill
from app.schemas.skill import OpenRequest

router = APIRouter(prefix="/api/skills", tags=["system"])


def _open_path(path: str) -> None:
    if sys.platform == "darwin":
        subprocess.Popen(["open", path])
    elif sys.platform == "win32":
        subprocess.Popen(["explorer", path])
    else:
        subprocess.Popen(["xdg-open", path])


@router.post("/{name}/open")
def open_skill(
    name: str,
    req: OpenRequest,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    skill = db.query(Skill).filter(Skill.name == name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    skill_path = Path(skill.path)

    try:
        if req.target == "folder":
            _open_path(str(skill_path.parent))
        else:
            # Try VSCode first, fall back to system open
            try:
                subprocess.Popen(["code", str(skill_path)])
            except FileNotFoundError:
                _open_path(str(skill_path))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to open: {exc}")

    return {"status": "ok"}
