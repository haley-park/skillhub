from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import SessionLocal
from app.routers import skills, sync, system
from app.services.scanner import scan_skills_dir
from app.services.watcher import start_watcher, stop_watcher


def _sync_callback() -> None:
    db = SessionLocal()
    try:
        result = scan_skills_dir(db)
        print(f"[sync] {result}")
    except Exception as exc:
        print(f"[sync] Error: {exc}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initial scan + start watcher
    _sync_callback()
    start_watcher(_sync_callback)
    yield
    # Shutdown
    stop_watcher()


app = FastAPI(
    title="Skillhub API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skills.router)
app.include_router(sync.router)
app.include_router(system.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
