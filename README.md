# 🧠 Skillhub

**Your local AI skill hub.** Drop a SKILL.md into `~/skillhub/skills/` — Skillhub detects it instantly and shows it as a card. No server, no sync, no setup beyond one config file.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)

---

## Features

- **Skill Library** — Card grid with search and tag filter
- **Real-time Sync** — File saved → UI updated instantly (watchdog, no refresh)
- **Trigger Test** — Enter a message, see if the Anthropic API would call this skill
- **Editor Integration** — Open any skill file directly in VSCode or your default app
- **Claude Commands** — Skills in `~/.claude/commands/` are auto-detected and also usable as `/commands` in Claude Code

---

## Preview

### Skill Library
![Home](docs/preview-home.svg)

### Skill Detail
![Detail](docs/preview-detail.svg)

### Trigger Test
![Trigger Test](docs/preview-trigger.svg)

---

## Claude Commands Integration

One `.md` file, two purposes — a Skillhub card and a Claude Code `/command`.

![Claude Commands Flow](docs/flow-commands.svg)

1. Save a `.md` file with YAML frontmatter to `~/.claude/commands/`
2. Skillhub detects the change and syncs automatically
3. The skill card appears in the UI
4. The same file works as `/command-name` in Claude Code

**Example — `~/.claude/commands/pdf-extraction.md`:**

```markdown
---
name: pdf-extraction
description: Extracts text and tables from PDF files. Handles multi-column layouts and scanned PDFs.
tags: [pdf, document, extraction]
version: 1.0.0
icon: "📄"
---

# PDF Extraction Skill

Your skill content here...
```

---

## Architecture

![Architecture](docs/architecture.svg)

- **File is source of truth** — SKILL.md on disk is canonical. DB is an index/cache only.
- **watchdog auto-detection** — Changes appear in the UI within 1 second.
- **Local, single-user** — No auth. Runs entirely on localhost.

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+ + pnpm
- PostgreSQL (local install)

### 1. Clone

```bash
git clone https://github.com/haley-park/skillhub.git
cd skillhub
```

### 2. Configure

```bash
cp backend/.env.example backend/.env
```

Fill in `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/skillhub
SKILLS_DIR=~/skillhub/skills
COMMANDS_DIR=~/.claude/commands
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

### 3. Install & migrate

```bash
make install
make migrate
```

### 4. Start

```bash
# Terminal 1
make dev-backend

# Terminal 2
make dev-frontend
```

Open **http://localhost:3000**.

---

## Writing a Skill File

Place a file at `~/skillhub/skills/<name>/SKILL.md` or `~/.claude/commands/<name>.md` — it will be picked up automatically.

```markdown
---
name: pdf-extraction
description: Extracts text and tables from PDF files.
tags: [pdf, document, extraction]
version: 1.0.0
icon: "📄"
---

# PDF Extraction Skill

Skill body in Markdown...
```

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Unique identifier |
| `description` | ✅ | Used for search and trigger detection |
| `tags` | — | Array of tags for filtering |
| `version` | — | Version string |
| `icon` | — | Emoji icon (first letter used as fallback) |

---

## Tech Stack

**Backend** — FastAPI · SQLAlchemy 2.0 · PostgreSQL · Alembic · watchdog · python-frontmatter · Anthropic SDK

**Frontend** — Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · react-markdown

---

## API

Backend running at `http://localhost:8000/docs` (Swagger UI).

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/skills` | List skills (`?q=query&tags=tag1`) |
| `GET` | `/api/skills/{name}` | Skill detail |
| `POST` | `/api/skills/{name}/test` | Trigger test |
| `POST` | `/api/sync` | Force re-scan |
| `POST` | `/api/skills/{name}/open` | Open in editor or folder |

---

## License

MIT
