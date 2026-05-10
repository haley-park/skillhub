.PHONY: dev-backend dev-frontend db-up db-down migrate seed sync install

db-up:
	docker-compose up -d postgres

db-down:
	docker-compose down

migrate:
	cd backend && alembic upgrade head

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && pnpm dev

install:
	cd backend && pip install -e ".[dev]"
	cd frontend && pnpm install

seed:
	python3 scripts/seed.py

sync:
	curl -s -X POST http://localhost:8000/api/sync | python3 -m json.tool
