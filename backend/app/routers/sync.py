from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.skill import SyncResult
from app.services.scanner import scan_skills_dir

router = APIRouter(prefix="/api", tags=["sync"])


@router.post("/sync", response_model=SyncResult)
def sync(db: Session = Depends(get_db)) -> dict:
    return scan_skills_dir(db)
