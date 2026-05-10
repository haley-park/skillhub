from __future__ import annotations

import threading
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
        if src.endswith(".md") or dest.endswith(".md"):
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
    _observer = Observer()

    for watch_path, label in [
        (settings.skills_path, "skills"),
        (settings.commands_path, "commands"),
    ]:
        watch_path.mkdir(parents=True, exist_ok=True)
        _observer.schedule(_SkillsEventHandler(sync_callback), str(watch_path), recursive=True)
        print(f"[watcher] Watching {watch_path} ({label})")

    _observer.start()


def stop_watcher() -> None:
    global _observer
    if _observer:
        _observer.stop()
        _observer.join()
        _observer = None
        print("[watcher] Stopped")
