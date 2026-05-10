from __future__ import annotations

import threading
import time
from pathlib import Path

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from app.config import settings

_observer: Observer | None = None
_debounce_timer: threading.Timer | None = None
_lock = threading.Lock()


class _SkillsEventHandler(FileSystemEventHandler):
    def __init__(self, sync_callback: callable) -> None:
        super().__init__()
        self._sync_callback = sync_callback

    def on_any_event(self, event) -> None:
        if event.is_directory:
            return
        src: str = getattr(event, "src_path", "") or ""
        dest: str = getattr(event, "dest_path", "") or ""
        if src.endswith("SKILL.md") or dest.endswith("SKILL.md"):
            self._schedule_sync()

    def _schedule_sync(self) -> None:
        global _debounce_timer
        with _lock:
            if _debounce_timer is not None:
                _debounce_timer.cancel()
            _debounce_timer = threading.Timer(0.5, self._sync_callback)
            _debounce_timer.daemon = True
            _debounce_timer.start()


def start_watcher(sync_callback: callable) -> None:
    global _observer
    skills_path = settings.skills_path
    skills_path.mkdir(parents=True, exist_ok=True)

    handler = _SkillsEventHandler(sync_callback)
    _observer = Observer()
    _observer.schedule(handler, str(skills_path), recursive=True)
    _observer.start()
    print(f"[watcher] Watching {skills_path}")


def stop_watcher() -> None:
    global _observer
    if _observer:
        _observer.stop()
        _observer.join()
        _observer = None
        print("[watcher] Stopped")
